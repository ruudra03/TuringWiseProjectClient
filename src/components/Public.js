import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className='public'>
            <header>
                <h1>Welcome to <span className='nowrap'>TuringWise App</span>!</h1>
            </header>
            <main className='public__main'>
                <p>The project is currently under development.</p>
                <br />
                <p>@ruudra</p>
            </main>
            <footer>
                <Link to='/login'>Login</Link>
            </footer>
        </section>
    )

    return content
}

export default Public