import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'

import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice'
import { ROLES } from '../../config/roles'

const NAME_REGEX = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
const USERNAME_REGEX = /^[a-z0-9_]{5,16}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
const PWD_REGEX = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/ // Strong Password

const EditUserForm = ({ user }) => {
    const [updateUser, { // Provides addNewUser function
        isLoading: isUpdateLoading,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateUserMutation()

    const [deleteUser, { // Provides addNewUser function
        // isLoading: isDeleteLoading,
        isSuccess: isDeleteSuccess,
        isError: isDeleteError,
        error: deleteError
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const [name, setName] = useState(user.name)
    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState('')
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)

    const [validName, setValidName] = useState(false)
    const [validUsername, setValidUsername] = useState(false)
    const [validEmail, setValidEmail] = useState(false)
    const [validPassword, setValidPassword] = useState(false)

    useEffect(() => {
        setValidName(NAME_REGEX.test(name))
    }, [name])

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isUpdateSuccess || isDeleteSuccess) {
            setName('')
            setUsername('')
            setEmail('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isUpdateSuccess, isDeleteSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onUsernameChanged = e => setUsername(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions, // HTML Collection
            (option) => option.value
        )
        setRoles(values)
    }
    const onActiveChanged = () => setActive(prev => !prev)

    let canSave
    if (password) {
        canSave = [validName, validUsername, validEmail, validPassword, roles.length].every(Boolean) && !isUpdateLoading
    } else {
        canSave = [validName, validUsername, validEmail, roles.length].every(Boolean) && !isUpdateLoading
    }

    // TODO: update/add seperate change password logic
    const onSaveUserClicked = async () => {
        if (password) {
            await updateUser({ id: user.id, name, username, email, password, roles, active })
        } else {
            await updateUser({ id: user.id, name, username, email, roles, active })
        }
    }

    // TODO: update/add seperate delete user logic
    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}
            >
                {role}
            </option>
        )
    })

    const errClass = (isUpdateError || isDeleteError) ? 'errmsg' : 'offscreen'
    const validNameClass = !validName ? 'form__input--incomplete' : ''
    const validUsernameClass = !validUsername ? 'form__input--incomplete' : ''
    const validEmailClass = !validEmail ? 'form__input--incomplete' : ''
    const validPasswordClass = (password && !validPassword) ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const errContent = (updateError?.data?.message || deleteError?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>
            <form className='form' onSubmit={e => e.preventDefault()}>
                <div className='form__title-row'>
                    <h2>Edit User</h2>
                    <div className='form__action-buttons'>
                        <button
                            className='icon-button'
                            title='Save'
                            onClick={onSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className='icon-button'
                            title='Delete'
                            onClick={onDeleteUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>

                <label className='form__label' htmlFor='name'>
                    Name: <span className='nowrap'></span>
                </label>
                <input
                    className={`form__input ${validNameClass}`}
                    id='name'
                    name='name'
                    type='text'
                    autoComplete='off'
                    value={name}
                    onChange={onNameChanged}
                />

                <label className='form__label' htmlFor='username'>
                    Username: <span className='nowrap'></span>
                </label>
                <input
                    className={`form__input ${validUsernameClass}`}
                    id='username'
                    name='username'
                    type='text'
                    autoComplete='off'
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className='form__label' htmlFor='email'>
                    Email: <span className='nowrap'></span>
                </label>
                <input
                    className={`form__input ${validEmailClass}`}
                    id='email'
                    name='email'
                    type='text'
                    value={email}
                    onChange={onEmailChanged}
                />

                <label className='form__label' htmlFor='password'>
                    Password: <span className='nowrap'></span>
                </label>
                <input
                    className={`form__input ${validPasswordClass}`}
                    id='password'
                    name='password'
                    type='text'
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className='form__label' htmlFor='roles'>
                    ROLES:
                </label>
                <select
                    id='roles'
                    name='roles'
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size='4'
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>

                <label className='form__label form__checkbox-container' htmlFor='user-active'>
                    ACTIVE:
                    <input
                        className='form__checkbox'
                        id='user-active'
                        name='user-active'
                        type='checkbox'
                        checked={active}
                        onChange={onActiveChanged}
                    />
                </label>
            </form>
        </>
    )

    return content
}

export default EditUserForm