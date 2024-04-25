import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPlus } from '@fortawesome/free-solid-svg-icons'

import { useAddNewPostMutation } from './postsApiSlice'

const TAG_REGEX = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/

// TODO: change the logic to get only the current user and not all users
const NewPostForm = ({ users }) => {
    const [addNewPost, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewPostMutation()

    const navigate = useNavigate()

    const [userId, setUserId] = useState(users[0].id)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [tags, setTags] = useState(['Post'])

    const [addNewTag, setAddNewTag] = useState('')
    const [validNewTag, setValidNewTag] = useState(false)

    useEffect(() => {
        setValidNewTag(TAG_REGEX.test(addNewTag))
    }, [addNewTag])

    useEffect(() => {
        if (isSuccess) {
            setUserId('')
            setTitle('')
            setBody('')
            setTags([])
            setAddNewTag('')
            navigate('/dash/posts')
        }
    }, [isSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onBodyChanged = e => setBody(e.target.value)
    const onAddNewTagChanged = e => setAddNewTag(e.target.value)

    const canSave = [userId, title, body].every(Boolean) && !isLoading

    const onSavePostClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewPost({ user: userId, title, body, tags })
        }
    }

    const handleAddNewTag = (e) => {
        e.preventDefault()
        if (validNewTag) {
            setTags(tags => [addNewTag, ...tags])
            setAddNewTag('')
        }
    }

    const tagsString = tags.toString().replaceAll(',', ', ')

    const errClass = isError ? 'errmsg' : 'offscreen'
    const validTitleClass = !title ? 'form__input--incomplete' : ''
    const validBodyClass = !body ? 'form__input--incomplete' : ''
    const validNewTagClass = !validNewTag ? 'form__input--invalid' : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className='form' onSubmit={onSavePostClicked}>
                <div className='form__title-row'>
                    <h2>New Post</h2>
                    <div className='form__action-buttons'>
                        <button
                            className='icon-button'
                            title='Save'
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
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

            </form>
        </>
    )

    return content
}

export default NewPostForm