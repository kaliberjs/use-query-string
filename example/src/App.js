import { QueryStringProvider, useQueryString }  from '@kaliber/use-query-string'

export default function AppWithProviders({ search }) {
  return (
    <QueryStringProvider {...{ search }}>
      <App />
    </QueryStringProvider>
  )
}

function App() {
  const [{ search }, setQueryString] = useQueryString({ search: '' })
  const [input, setInput] = React.useState(null)

  return (
    <form onSubmit={handleSubmit}>
      {search
        ? <h1>You've searched on '{search}'</h1>
        : <h1>Search</h1>
      }
      <input type='text' value={input ?? search} onChange={e => setInput(e.currentTarget.value)} name='search' />
      <button type='submit'>Apply search query</button>
    </form>
  )

  function handleSubmit(e) {
    e.preventDefault()
    setQueryString(x => ({ ...x, search: input }))
  }
}
