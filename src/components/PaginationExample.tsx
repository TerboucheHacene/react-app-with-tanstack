import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {useState} from 'react'
import axios from 'axios'

interface Post {
    id: number
    title: string
    body: string
}
async function fetchPosts(page: number) {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`)
    return response.data
}

function PaginationExample() {

    const [page, setPage] = useState(1)

    const { data: posts, isFetching, isError, isPlaceholderData } = useQuery({
        queryKey: ['posts', page],
        queryFn: () => fetchPosts(page),
        placeholderData: keepPreviousData, // keep the previous page data while fetching the next page
        staleTime: 1000 * 60, // 1 minute, with 'keepPreviousData', the data will be stale for 1 minute
    })

    return (
        <section className="panel">
            <h2>Pagination Example</h2>
            {isFetching && <div>Fetching...</div>}
            {isError && <div>Error: something went wrong</div>}
            {isPlaceholderData && <div>Showing previous page data while fetching the next page</div>}
            {posts && posts.map((post: Post) => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                </div>
            ))}
            <button type="button" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous Page</button>
            <button type="button" onClick={() => setPage(page + 1)}>Next Page</button>
        </section>
    )
}

export default PaginationExample