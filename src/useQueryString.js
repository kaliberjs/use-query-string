import React from 'react'
import qs from 'query-string'

export const defaultOptions = {
  parse: {
    arrayFormat: 'bracket'
  },
  stringify: {
    skipEmptyString: true, 
    skipNull: true, 
    arrayFormat: 'bracket'
  }
}

const QueryStringContext = React.createContext({ update: replaceQueryString, search: null, options: defaultOptions })

const listeners = new Set()

export function useQueryString(initialState = {}) {
  const { search, update, options } = React.useContext(QueryStringContext)
  const [query, setQuery] = React.useState(() => search
    ? { ...initialState, ...qs.parse(search, options.parse) } 
    : initialState
  )

  React.useEffect(
    () => {
      setQuery(qs.parse(window.location.search, options.parse))
      listeners.add(setQuery)
      return () => { listeners.delete(setQuery) }
    },
    [options]
  )

  const set = React.useCallback(
    queryOrFn => {
      const newQuery = typeof queryOrFn === 'function' ? queryOrFn(query) : queryOrFn
      const queryString = qs.stringify(newQuery, options.stringify)
      update({ query: newQuery, queryString })
      listeners.forEach(fn => fn(newQuery))
    },
    [update, query, options]
  )

  return [query, set]
}

export function QueryStringProvider({ search, update = replaceQueryString, options = defaultOptions, children }) {
  const updateRef = React.useRef(null)
  updateRef.current = update

  const value = React.useMemo(
    () => ({ 
      search,
      options,
      update(...args) {
        updateRef.current(...args)
      }
    }), 
    [search]
  )

  return <QueryStringContext.Provider {...{ value, children }} />
}

function replaceQueryString({ query, queryString }) {
  const url = window.location.pathname + (queryString ? '?' + queryString : '') + window.location.hash
  window.history.replaceState(query, null, url)
}