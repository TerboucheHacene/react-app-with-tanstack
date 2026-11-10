import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { Post } from '../types'

async function fetchInfinitePosts(page: number) {
  const response = await axios.get<Post[]>(
    `https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`,
  )
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
    getNextPageParam: (lastPage, pages) =>
      lastPage.length > 0 ? pages.length + 1 : undefined,
    initialPageParam: 1,
  })

  return (
    <section className="panel">
      <h2>Infinite Example</h2>
      {isLoading && <p className="status">Loading...</p>}
      {isFetching && <p className="status">Fetching...</p>}
      {isFetchingNextPage && <p className="status">Fetching Next Page...</p>}
      {data && (
        <ul className="posts">
          {data.pages.flat().map((post: Post) => (
            <li className="post" key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="panel-footer">
        {hasNextPage && (
          <button type="button" onClick={() => fetchNextPage()}>
            Load More
          </button>
        )}
        {data && !hasNextPage && <p className="status">No more posts</p>}
      </div>
    </section>
  )
}

export default InfiniteExample
