import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Welcome = () => {
    const { username, isOrgUser, isOrgAdmin, isAdmin } = useAuth()

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-UK', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const content = (
        <section className='welcome'>
            <p>{today}</p>
            <h1>Welcome {username}!</h1>

            <p><Link to='/dash/users'>View Users</Link></p>
            {(isOrgAdmin || isAdmin) && <p><Link to='/dash/users/new'>Add New User</Link></p>}

            {(isOrgUser || isOrgAdmin || isAdmin) && <p><Link to='/dash/posts'>View Posts</Link></p>}
            {(isOrgUser || isOrgAdmin || isAdmin) && <p><Link to='/dash/posts/new'>Add New Post</Link></p>}
        </section>
    )

    return content
}

export default Welcome