import { useGetArticlesQuery } from './articlesApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'

import Article from './Article'

const ArticlesList = () => {
    const {
        data: articles,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetArticlesQuery('articlesList', {
        pollingInterval: 60000, // Equals to 60secs
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <PulseLoader color={'#FFF'} />

    if (isError) {
        content = <p className='errmsg'>{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids } = articles // data was renamed articles above when destructuring useGetArticlesQuery result

        const tableContent = ids?.length && ids.map(articleId => <Article key={articleId} articleId={articleId} />)

        content = (
            <table className='table table--articles'>
                <thead className='table__thead'>
                    <tr>
                        <th scope='col' className='table__th article__name'>
                            Name
                        </th>
                        <th scope='col' className='table__th article__articlename'>
                            Articlename
                        </th>
                        <th scope='col' className='table__th article__email'>
                            Email
                        </th>
                        <th scope='col' className='table__th article__roles'>
                            Roles
                        </th>
                        <th scope='col' className='table__th article__status'>
                            Status
                        </th>
                        <th scope='col' className='table__th article__edit'>
                            Edit
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}

export default ArticlesList