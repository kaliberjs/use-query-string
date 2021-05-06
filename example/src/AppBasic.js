import { QueryStringProvider, useQueryString }  from '@kaliber/use-query-string'

export default function AppWithProviders({ location }) {
  return (
    <QueryStringProvider {...{ location }}>
      <App />
    </QueryStringProvider>
  )
}

function App() {
  const [{ search }, setQueryString] = useQueryString({ search: '' })
  const [input, setInput] = React.useState(search)

  return (
    <form onSubmit={handleSubmit}>
      {search
        ? <h1>You've searched on '{search}'</h1>
        : <h1>Search</h1>
      }
      <input type='text' value={input} onChange={e => setInput(e.currentTarget.value)} name='search' />
      <button type='submit'>Apply search query</button>
    </form>
  )

  function handleSubmit(e) {
    e.preventDefault()
    setQueryString(x => ({ ...x, search: input }))
  }
}
