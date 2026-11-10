// import { useQuery } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import axios from 'axios'
import type { Post } from '../types'

async function fetchPosts(url: string) {
  const response = await axios.get(url)
  return response.data
}

function QueryExample() {
  const [loadData, setLoadData] = useState(false)
  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      fetchPosts('https://jsonplaceholder.typicode.com/posts?_limit=5'),
    enabled: loadData,
  })

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Posts</h2>
        <div className="actions">
          <button type="button" onClick={() => setLoadData(true)}>
            Load Data
          </button>
          <button type="button" className="secondary" onClick={() => refetch()}>
            Refetch
          </button>
        </div>
      </div>
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
    </section>
  )
}

export default QueryExample
