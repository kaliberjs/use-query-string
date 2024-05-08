import React from 'react'
import qs from 'query-string'

export const defaultOptions = {
  /** @type {import('query-string').ParseOptions} */
  parse: {
    arrayFormat: 'bracket'
  },
  /** @type {import('query-string').StringifyOptions} */
  stringify: {
    skipEmptyString: true, 
    skipNull: true, 
    arrayFormat: 'bracket'
  }
}

/** @type {React.Context<object>} */
export const queryStringContext = React.createContext({ update: replaceQueryString, search: null, options: defaultOptions })

const listeners = new Set()
const EMPTY = {}

/** @returns {[object, (object | function) => void]} */
export function useQueryString() {
  const { search, update, options } = React.useContext(queryStringContext)
  const [query, setQuery] = React.useState(() => search ? qs.parse(search, options.parse) : EMPTY)

  React.useEffect(
    () => {
      setQuery(q => q === EMPTY ? qs.parse(window.location.search, options.parse) : q)
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

  return <queryStringContext.Provider {...{ value, children }} />
}

function replaceQueryString({ query, queryString }) {
  const url = window.location.pathname + (queryString ? '?' + queryString : '') + window.location.hash
  window.history.replaceState(query, null, url)
}
