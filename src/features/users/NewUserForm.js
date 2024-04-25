import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'

import { useAddNewUserMutation } from './usersApiSlice'
import { ROLES } from '../../config/roles'

const NAME_REGEX = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
const USERNAME_REGEX = /^[a-z0-9_]{5,16}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
const PWD_REGEX = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/ // Strong Password

const NewUserForm = () => {
    const [addNewUser, { // Provides addNewUser function
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [roles, setRoles] = useState(['User'])

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
        if (isSuccess) {
            setName('')
            setUsername('')
            setEmail('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

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

    const canSave = [validName, validUsername, validEmail, validPassword, roles.length].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ name, username, email, password, roles })
        }
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

    const errClass = isError ? 'errmsg' : 'offscreen'
    const validNameClass = !validName ? 'form__input--incomplete' : ''
    const validUsernameClass = !validUsername ? 'form__input--incomplete' : ''
    const validEmailClass = !validEmail ? 'form__input--incomplete' : ''
    const validPasswordClass = !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <form className='form' onSubmit={onSaveUserClicked}>
                <div className='form__title-row'>
                    <h2>New User</h2>
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
            </form>
        </>
    )

    return content
}

export default NewUserForm