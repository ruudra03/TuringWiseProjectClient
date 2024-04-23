import { Link } from 'react-router-dom'

const Welcome = () => {
    const date = new Date()
    const today = new Intl.DateTimeFormat('en-UK', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const content = (
        <section className='welcome'>
            <p>{today}</p>
            <h1>Welcome!</h1>
            <p><Link to='/dash/posts'>View Posts</Link></p>
            <p><Link to='/dash/users'>View Users</Link></p>
        </section>
    )

    return content
}

export default Welcome