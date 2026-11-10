import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import type { Post } from '../../../types'

export const Route = createFileRoute('/_auth/posts/$postId')({
  component: RouteComponent,
})

const getPost = async (postId: string) => {
  const response = await axios.get<Post>(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  )
  return response.data
}

function RouteComponent() {
  const { postId } = Route.useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
  })

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <div>
          Post
          {JSON.stringify(data)}
        </div>
      )}
    </div>
  )
}
