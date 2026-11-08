import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import axios from 'axios'

interface Post {
    id: number
    title: string
    body: string
}
function PostList() {

    async function fetchPosts() {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
        return response.data
    }

    const { data: posts, isLoading, isError } = useQuery({
        queryKey: ['posts'],
        queryFn: () => fetchPosts(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    return (
        <div>
            {isLoading && <div>Loading...</div>}
            {isError && <div>Error: something went wrong</div>}
            {posts && posts.map((post: Post) => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                </div>
            ))}
        </div>
    )
}

function CachingExample() {
    const [showPosts, setShowPosts] = useState(false)
    const queryClient = useQueryClient()
    function invalidatePosts() {
        queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
    return (
        <div>
            <h2>
                <p>Toggle this component off and on again to see the cached data  </p>
                <button type="button" onClick={invalidatePosts}>Invalidate Posts</button>
                <button type="button" onClick={() => setShowPosts(!showPosts)}>Toggle</button>
            </h2>
            {showPosts && <PostList />}
        </div>
    )
}

export default CachingExample