import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'

interface Post {
    id: number
    title: string
    body: string
}
async function fetchInfinitePosts(page: number) {
    const response = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`)
    return response.data
}


function InfiniteExample() {
    const { 
        data,
        isLoading,
        isFetching, 
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['infinite-posts'],
        queryFn: ({ pageParam }) => fetchInfinitePosts(pageParam),
        getNextPageParam: (lastPage, pages) => lastPage.length > 0 ? pages.length + 1 : undefined,
        initialPageParam: 1
    })


    return (
        <section className="panel">
            <h2>Infinite Example</h2>
            {isLoading && <div>Loading...</div>}
            {isFetching && <div>Fetching...</div>}
            {isFetchingNextPage && <div>Fetching Next Page...</div>}
            {data?.pages.map((page, index) => (
                <div key={index}>
                    {page.map((post: Post) => (
                        <div key={post.id}>
                            <h2>{post.title}</h2>
                            <p>{post.body}</p>
                        </div>
                    ))}
                </div>
            ))}
            {hasNextPage && <button type="button" onClick={() => fetchNextPage()}>Load More</button>}
            {!hasNextPage && <div>No more posts</div>}
        </section>
    )
}

export default InfiniteExample