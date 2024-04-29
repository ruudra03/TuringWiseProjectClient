import { Outlet, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import PulseLoader from 'react-spinners/PulseLoader'

import { useRefreshMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import { selectCurrentToken } from './authSlice'

const PersistLogin = () => {
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false) // Due to ReactStrict mode

    // NOTE: the isSuccess status below can be true before the credential's (i.e., accessToken) value is set (i.e., it doesn't get the time)
    // hence using additional state here (i.e., trueSuccess) for the credentials to be set further below while using refresh()
    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    // NOTE: in ReactStrict mode every component mounts (i.e., suscribe), unmounts (i.e., unsuscribe) and then remounts
    // hence useEffect() runs twice in development using Strict mode
    // and we need thsi useEffect() to only run once
    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // ReactStrict mode
            const verifyRefreshToken = async () => {
                console.log('Verifying refresh token')
                try {
                    // const response =
                    await refresh()
                    // const { accessToken } = response.data
                    // console.log(accessToken)
                    setTrueSuccess(true)
                } catch (err) {
                    console.log(err)
                }
            }

            if (!token && persist) verifyRefreshToken() // When app is refreshed
        }

        return () => effectRan.current = true // useRef() will keep effectRan value even in RecatStrict mode

        // eslint-disable-next-line
    }, [])

    let content
    // NOTE: using multiple if-else statements for different situations/possibilities
    if (!persist) { // Untrusted device (persist: no)
        console.log('Untrusted device')
        content = <Outlet />
    } else if (isLoading) { // No token set yet (persist: yes, token: no)
        console.log('Loading login access');
        content = <PulseLoader color={'#FFF'} />
    } else if (isError) { // Failed to get the token (persist: yes, token: no)
        console.log('Failed to get login access')
        content = (
            <p className='errmsg'>
                {`${error?.data?.message} - `}
                <Link to='/login'>Please login again</Link>
            </p>
        )
    } else if (isSuccess && trueSuccess) { // Token is present (persist: yes, token: yes)
        console.log('Success in getting login access')
        content = <Outlet />
    } else if (token && isUninitialized) { // Token is present but refresh() mutation is not initialised (persist: yes, token: yes)
        console.log('Token present but app not refreshed yet')
        content = <Outlet />
    }

    return content
}

export default PersistLogin