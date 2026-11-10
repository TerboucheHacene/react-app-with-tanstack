import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import axios from 'axios'
import type { Post } from '../types'

async function fetchPosts(page: number) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`,
  )
  return response.data
}

function PaginationExample() {
  const [page, setPage] = useState(1)

  const {
    data: posts,
    isFetching,
    isError,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page),
    placeholderData: keepPreviousData, // keep the previous page data while fetching the next page
    staleTime: 1000 * 60, // 1 minute, with 'keepPreviousData', the data will be stale for 1 minute
  })

  return (
    <section className="panel">
      <h2>Pagination Example</h2>
      {isFetching && <p className="status">Fetching...</p>}
      {isError && <p className="status error">Error: something went wrong</p>}
      {isPlaceholderData && (
        <p className="status">
          Showing previous page data while fetching the next page
        </p>
      )}
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
      <div className="actions panel-footer">
        <button
          type="button"
          className="secondary"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous Page
        </button>
        <span className="page-indicator">Page {page}</span>
        <button
          type="button"
          className="secondary"
          onClick={() => setPage(page + 1)}
        >
          Next Page
        </button>
      </div>
    </section>
  )
}

export default PaginationExample
