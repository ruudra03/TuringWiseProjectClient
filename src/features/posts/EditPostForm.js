import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons"

import { useUpdatePostMutation, useDeletePostMutation } from "./postsApiSlice"

const TAG_REGEX = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/

const EditPostForm = ({ post }) => {
    const [updatePost, {
        isLoading: isUpdateLoading,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: updateError
    }] = useUpdatePostMutation()

    const [deletePost, {
        isSuccess: isDeleteSuccess,
        isError: isDeleteError,
        error: deleteError
    }] = useDeletePostMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(post.title)
    const [body, setBody] = useState(post.body)
    const [tags, setTags] = useState(post.tags)

    const [addNewTag, setAddNewTag] = useState('')
    const [validNewTag, setValidNewTag] = useState(false)

    useEffect(() => {
        setValidNewTag(TAG_REGEX.test(addNewTag))
    }, [addNewTag])

    useEffect(() => {
        if (isUpdateSuccess || isDeleteSuccess) {
            setTitle('')
            setBody('')
            setTags([])
            navigate('/dash/posts')
        }
    }, [isUpdateSuccess, isDeleteSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onBodyChanged = e => setBody(e.target.value)
    const onAddNewTagChanged = e => setAddNewTag(e.target.value)

    const canSave = [title, body, tags.length].every(Boolean) && !isUpdateLoading

    const onSavePostClicked = async () => {
        if (canSave) {
            await updatePost({ id: post.id, title, body, tags })
        }
    }

    const onDeletePostClicked = async () => {
        await deletePost({ id: post.id })
    }

    const handleAddNewTag = (e) => {
        e.preventDefault()
        if (validNewTag) {
            setTags(tags => [addNewTag, ...tags])
            setAddNewTag('')
        }
    }

    const created = new Date(post.createdAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })
    const updated = new Date(post.updatedAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })

    const tagsString = tags.toString().replaceAll(',', ', ')

    const errClass = (isUpdateError || isDeleteError) ? 'errmsg' : 'offscreen'
    const validTitleClass = !title ? 'form__input--incomplete' : ''
    const validBodyClass = !body ? 'form__input--incomplete' : ''
    const validNewTagClass = !validNewTag ? 'form__input--invalid' : ''

    const errContent = (updateError?.data?.message || deleteError?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Post #{post.id}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSavePostClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeletePostClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>

                <label className='form__label' htmlFor='title'>
                    Title:</label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id='title'
                    name='title'
                    type='text'
                    autoComplete='off'
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className='form__label' htmlFor='body'>
                    Body:</label>
                <textarea
                    className={`form__input form__input--body ${validBodyClass}`}
                    id='body'
                    name='body'
                    value={body}
                    onChange={onBodyChanged}
                />

                <p>Tags: {tagsString}</p>

                <label className='form__label' htmlFor='new-tag'>
                    Add New Tag:</label>
                <input
                    className={`form__input ${validNewTagClass}`}
                    id='addNewTag'
                    name='addNewTag'
                    type='text'
                    autoComplete='off'
                    value={addNewTag}
                    onChange={onAddNewTagChanged}
                />
                <button
                    className='icon-button'
                    title='Add New Tag'
                    type='button'
                    disabled={!validNewTag}
                    onClick={handleAddNewTag}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>

                <div className="form__row">
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                    <div className="form__divider">
                        {post.edited ? <p>Edited</p> : null}
                    </div>
                </div>
            </form>
        </>
    )

    return content
}

export default EditPostForm