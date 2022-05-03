import { useQueryString }  from '@kaliber/use-query-string'

export function AppWithoutProvider() {
  const [{ search: searchQuery = '' }, setQueryString] = useQueryString()
  const [input, setInput] = React.useState('')

  React.useEffect(
    () => { setInput(searchQuery) },
    [searchQuery]
  )

  return (
    <form onSubmit={handleSubmit}>
      {searchQuery
        ? <h1>You've searched on '{searchQuery}'</h1>
        : <h1>Search</h1>
      }
      <input type='search' value={input} onChange={e => setInput(e.currentTarget.value)} name='search' />
      <button type='submit'>Apply search query</button>
    </form>
  )

  function handleSubmit(e) {
    e.preventDefault()
    setQueryString(x => ({ ...x, search: input }))
  }
}
