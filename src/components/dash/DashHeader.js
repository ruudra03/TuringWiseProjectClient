// import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
    faRightFromBracket
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link, useLocation } from 'react-router-dom'

import { useSendLogoutMutation } from '../../features/auth/authApiSlice'
import useAuth from '../../hooks/useAuth'

const DASH_REGEX = /^\/dash(\/)?$/
const POSTS_REGEX = /^\/dash\/posts(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {
    const { isOrgUser, isOrgAdmin, isAdmin } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        // isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    // useEffect(() => {
    //     if (isSuccess) navigate('/')
    // }, [isSuccess, navigate])

    const onLogoutClicked = () => {
        sendLogout()
        navigate('/login')
    }

    const onNewUserClicked = () => navigate('/dash/users/new')
    const onNewPostClicked = () => navigate('/dash/posts/new')
    const onUsersListClicked = () => navigate('/dash/users')
    const onPostsListClicked = () => navigate('/dash/posts')

    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !POSTS_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = 'dash-header__container--small'
    }

    let newPostButton = null
    if (POSTS_REGEX.test(pathname)) {
        newPostButton = (
            <button
                className='icon-button'
                title='New Post'
                onClick={onNewPostClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }

    let newUserButton = null
    if (isAdmin) {
        if (USERS_REGEX.test(pathname)) {
            newUserButton = (
                <button
                    className='icon-button'
                    title='New User'
                    onClick={onNewUserClicked}
                >
                    <FontAwesomeIcon icon={faUserPlus} />
                </button>
            )
        }
    }

    let usersListButton = null
    if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
        usersListButton = (
            <button
                className='icon-button'
                title='Users'
                onClick={onUsersListClicked}
            >
                <FontAwesomeIcon icon={faUserGear} />
            </button>
        )
    }

    let postsListButton = null
    if (isOrgUser || isOrgAdmin || isAdmin) {
        if (!POSTS_REGEX.test(pathname) && pathname.includes('/dash')) {
            postsListButton = (
                <button
                    className='icon-button'
                    title='Posts'
                    onClick={onPostsListClicked}
                >
                    <FontAwesomeIcon icon={faFilePen} />
                </button>
            )
        }
    }

    const logoutButton = (
        <button
            className='icon-button'
            title='Logout'
            onClick={onLogoutClicked}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    const errClass = isError ? 'errMsg' : 'offscreen'

    let buttonContent
    if (isLoading) {
        buttonContent = <p>Logging out...</p>
    } else {
        buttonContent = (
            <>
                {newPostButton}
                {newUserButton}
                {postsListButton}
                {usersListButton}
                {logoutButton}
            </>
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className='dash-header'>
                <div className={`dash-header__container ${dashClass}`}>
                    <Link to='/dash'>
                        <h1 className='dash-header__title'>TuringWise</h1>
                    </Link>
                    <nav className='dash-header__nav'>
                        {/* TODO: add nav buttons */}
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    )

    return content
}

export default DashHeader