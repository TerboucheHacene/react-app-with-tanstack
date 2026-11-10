import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import axios from 'axios'
import type { Post } from '../types'

function PostList() {
  async function fetchPosts() {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/posts?_limit=5',
    )
    return response.data
  }

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return (
    <>
      {isLoading && <p className="status">Loading...</p>}
      {isError && <p className="status error">Error: something went wrong</p>}
      {posts && (
        <ul className="posts">
          {posts.map((post: Post) => (
            <li className="post" key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function CachingExample() {
  const [showPosts, setShowPosts] = useState(false)
  const queryClient = useQueryClient()
  function invalidatePosts() {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  }
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Caching Example</h2>
          <p className="hint">
            Toggle this component off and on again to see the cached data
          </p>
        </div>
        <div className="actions">
          <button type="button" onClick={() => setShowPosts(!showPosts)}>
            Toggle
          </button>
          <button type="button" className="secondary" onClick={invalidatePosts}>
            Invalidate Posts
          </button>
        </div>
      </div>
      {showPosts && <PostList />}
    </section>
  )
}

export default CachingExample
