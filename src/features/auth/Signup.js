import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import PulseLoader from 'react-spinners/PulseLoader'
import { useDispatch } from 'react-redux'

import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import { useSignupUserMutation } from '../users/usersApiSlice'

const NAME_REGEX = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
const USERNAME_REGEX = /^[a-z0-9_]{5,16}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
const TEMP_DEV_PWD_REGEX = /^[a-z0-9_]{5,16}$/
// TODO: use the PWD_REGEX after development
// const PWD_REGEX = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/ // Strong Password

const Signup = () => {
    const [signupUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSignupUserMutation()

    const [login, {
        isLoading: isLoginLoading
    }] = useLoginMutation()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const [persist, setPersist] = usePersist()

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
        setValidPassword(TEMP_DEV_PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {
            setName('')
            setUsername('')
            setEmail('')
            setPassword('')
        }
    }, [isSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onUsernameChanged = e => setUsername(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const handleToggle = () => setPersist(prev => !prev)

    const canSave = [validName, validUsername, validEmail, validPassword].every(Boolean) && !isLoading

    const onSignupClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            try {
                await signupUser({ name, username, email, password })

                const { accessToken } = await login({ username, password }).unwrap()
                dispatch(setCredentials({ accessToken }))

                navigate('/dash')
            } catch (err) {
                if (!err.status) {
                    setErrMsg('No Server Response')
                } else if (err.status === 400) {
                    setErrMsg('Missing Username or Password')
                } else if (err.status === 401) {
                    setErrMsg('Unauthorized')
                } else {
                    setErrMsg(err.data?.message)
                }
            }
        }
    }

    const errClass = isError ? 'errmsg' : 'offscreen'
    const validNameClass = !validName ? 'form__input--incomplete' : ''
    const validUsernameClass = !validUsername ? 'form__input--incomplete' : ''
    const validEmailClass = !validEmail ? 'form__input--incomplete' : ''
    const validPasswordClass = !validPassword ? 'form__input--incomplete' : ''

    if (isLoginLoading) return <PulseLoader color={'#FFF'} />

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <p className={errClass}>{errMsg}</p>
            <form className='form' onSubmit={onSignupClicked}>
                <div className='form__title-row'>
                    <h2>Sign Up</h2>
                    <div className='form__action-buttons'>
                        <button
                            className='icon-button'
                            title='Sign Up'
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faUserPlus} />
                            Sign up
                        </button>
                        <label htmlFor='persist' className='form__persist'>
                            <input
                                type='checkbox'
                                className='form__checkbox'
                                id='persist'
                                onChange={handleToggle}
                                checked={persist}
                            />
                            Trust this device
                        </label>
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
                    type='password'
                    value={password}
                    onChange={onPasswordChanged}
                />
            </form>
        </>
    )

    return content
}

export default Signup