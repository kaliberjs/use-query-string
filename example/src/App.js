import { QueryStringProvider, useQueryString }  from '@kaliber/use-query-string'

export default function AppWithProviders({ search }) {
  return (
    <QueryStringProvider {...{ search }}>
      <App />
    </QueryStringProvider>
  )
}

function App() {
  const [{ search: searchQuery }, setQueryString] = useQueryString({ search: '' })
  const [input, setInput] = React.useState(null)

  return (
    <form onSubmit={handleSubmit}>
      {searchQuery
        ? <h1>You've searched on '{searchQuery}'</h1>
        : <h1>Search</h1>
      }
      <input type='search' value={input ?? searchQuery ?? ''} onChange={e => setInput(e.currentTarget.value)} name='search' />
      <button type='submit'>Apply search query</button>
    </form>
  )

  function handleSubmit(e) {
    e.preventDefault()
    setQueryString(x => ({ ...x, search: input }))
  }
}
