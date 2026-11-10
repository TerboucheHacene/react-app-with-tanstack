import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { Post } from '../../../types'

const getPosts = async () => {
  const response = await axios.get<Post[]>(
    'https://jsonplaceholder.typicode.com/posts?_limit=10',
  )
  return response.data
}

export const Route = createFileRoute('/_auth/posts/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <ul className="posts">
          {data.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ul>
      )}
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  return (
    <li className="post">
      <Link
        to="/posts/$postId"
        params={{ postId: String(post.id) }}
        className="post-card"
      >
        <span className="post-card-id">#{post.id}</span>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </Link>
    </li>
  )
}
