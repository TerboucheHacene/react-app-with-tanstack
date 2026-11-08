import './App.css'
import QueryExample from './components/QueryExample'
import MutationExample from './components/MutationExample'
import CachingExample from './components/CachingExample'
import PaginationExample from './components/PaginationExample'
import InfiniteExample from './components/InfiniteExample'

function App() {

  return (
    <main className="page">
      <QueryExample />
      <MutationExample />
      <CachingExample />
      <PaginationExample />
      <InfiniteExample />
    </main>
  )
}

export default App
