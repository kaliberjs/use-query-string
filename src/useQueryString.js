import React from 'react'
import qs from 'query-string'

const QueryStringContext = React.createContext({ update, search: null })

const listeners = new Set()

export function useQueryString(initialState = {}) {
  const { search, update } = React.useContext(QueryStringContext)
  const [query, setQuery] = React.useState(() => search
    ? { ...initialState, ...qs.parse(search, { arrayFormat: 'bracket' }) } 
    : initialState
  )

  React.useEffect(
    () => {
      setQuery(qs.parse(window.location.search, { arrayFormat: 'bracket' }))
      listeners.add(setQuery)
      return () => { listeners.delete(setQuery) }
    },
    []
  )

  const set = React.useCallback(
    queryOrFn => {
      const newQuery = typeof queryOrFn === 'function' ? queryOrFn(query) : query
      const queryString = qs.stringify(newQuery, { skipEmptyString: true, skipNull: true, arrayFormat: 'bracket' })
      update(newQuery, queryString)
      listeners.forEach(fn => fn(newQuery))
    },
    [update, query]
  )

  return [query, set]
}

export function QueryStringProvider({ search, update, children }) {
  const fallback = React.useContext(QueryStringContext)
  const value = React.useMemo(
    () => ({ 
      search: search ?? fallback.search, 
      update: update ?? fallback.update 
    }), 
    [fallback, search, update]
  )

  return <QueryStringContext.Provider {...{ value, children }} />
}

function update(query, queryString) {
  const url = window.location.pathname + (queryString ? '?' + queryString : '') + window.location.hash
  window.history.replaceState(query, null, url)
}