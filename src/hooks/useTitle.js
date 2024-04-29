import { useEffect } from 'react'

// TODO: use this hook on all pages to change title easily
const useTitle = (title) => {
    useEffect(() => {
        const prevTitle = document.title
        document.title = title

        return () => document.title = prevTitle
    }, [title])
}

export default useTitle