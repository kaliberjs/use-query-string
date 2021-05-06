import { ServerLocation, LocationProvider, navigate, useLocation } from '@reach/router'
import { QueryStringProvider, useQueryString }  from '@kaliber/use-query-string'

export default function AppWithProviders({ url }) {
  return (
    <ProvideLocation {...{ url }}>
      <QueryStringProvider update={updateQueryString} {...{ url }}>
        <App />
      </QueryStringProvider>
    </ProvideLocation>
  )
}

function App() {
  const [{ search }, setQueryString] = useQueryString({ search: '' })
  const [input, setInput] = React.useState(search)
  const location = useLocation()

  return (
    <>
      <form onSubmit={handleSubmit}>
        {search
          ? <h1>You've searched on '{search}'</h1>
          : <h1>Search</h1>
        }
        <input type='text' value={input} onChange={e => setInput(e.currentTarget.value)} name='search' />
        <button type='submit'>Apply search query</button>
      </form>
      <p>Query string reported by @reach/router: {location.search}</p>
    </>
  )

  function handleSubmit(e) {
    e.preventDefault()
    setQueryString(x => ({ ...x, search: input }))
  }
}

function ProvideLocation({ url, children }) {
  return (typeof window !== 'undefined')
    ? <LocationProvider {...{ children }} />
    : <ServerLocation {...{ url, children }} />
}

function updateQueryString(query, queryString) {
  navigate([window.location.pathname, queryString].join('?'), {
    state: query,
    replace: true
  })
}
