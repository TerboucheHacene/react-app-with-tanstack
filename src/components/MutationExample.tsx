// import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import axios from 'axios'
import type { Post } from '../types'

async function addPost(post: Post) {
  const response = await axios.post(
    'https://jsonplaceholder.typicode.com/posts',
    post,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  return response.data
}

function MutationExample() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const {
    mutate,
    data: addedPost,
    isPending,
    isError,
  } = useMutation({
    mutationFn: addPost,
  })

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
  }

  function handleBodyChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setBody(e.target.value)
  }

  function clickHandler(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    mutate({ id: 1, title, body, userId: 1 })
    setTitle('')
    setBody('')
  }

  return (
    <section className="panel">
      <h2>Add Post</h2>
      <form className="form">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            placeholder="Body"
            value={body}
            onChange={handleBodyChange}
          />
        </div>
        <button type="button" onClick={clickHandler}>
          Add Post
        </button>
      </form>
      {addedPost && (
        <p className="status success">Post added: {addedPost.title}</p>
      )}
      {isPending && <p className="status">Adding post...</p>}
      {isError && <p className="status error">Error: something went wrong</p>}
    </section>
  )
}

export default MutationExample
