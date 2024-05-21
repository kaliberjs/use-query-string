# `@kaliber/use-query-string`
Update the query string, just like you would update your state. 

## Installation

```
yarn add query-string
yarn add @kaliber/use-query-string
```

If you're using `@kaliber/build`, make sure `query-string` and it's non es5-compatible dependencies are transpiled:

_config/default.js_
```js
module.exports = {
  kaliber: {
    compileWithBabel: [
      /@kaliber\/use-query-string/,
      /filter-obj/,
      /query-string/,
      /split-on-first/,
      /strict-uri-encode/,
    ]
  }
}
```

## Usage

`useQueryString` returns an array with two items: the parsed query string and a setter function. If there is no query to parse the parsed query will be an empty object. This makes it realiable to destructure values from the parsed query. The setter function accepts an object or a function as argument. 

When passed an object, it will overwrite the existing query string with the object provided.

When passed a function, it will use the return value of this function to overwrite the existing query string. The functions receives the current parsed query string as argument. You can use this to make selective changes to the query string. E.g.: to only update the search query but keep the rest of the query string: `setQueryString(x => ({ ...x, search: 'hello' }))`.

### Without SSR

```jsx
import { useQueryString } from '@kaliber/use-query-string'

function Component() {
  const [{ search: searchQuery = '' }, setQueryString] = useQueryString()
  const [input, setInput] = React.useState(null)

  React.useEffect(
    () => { setInput(searchQuery) },
    [searchQuery]
  )

  return (
    <form onSubmit={handleSubmit}>
      {search
        ? <h1>You've searched for '{searchQuery}'</h1>
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
```

### With SSR
Wrap you application in a `QueryStringProvider`, which you provide with the known `search` string. If you're using express that would be `req.location.search`. Because `search` is now correctly set on the first render, you can safely use it as the default value for `input`.

```jsx
import { QueryStringProvider, useQueryString } from '@kaliber/use-query-string'

function AppWithProviders({ search }) {
  return (
    <QueryStringProvider {...{ search }}>
      <App />
    </QueryStringProvider>
  )
}


function Component() {
  const [{ search: searchQuery = '' }, setQueryString] = useQueryString()
  const [input, setInput] = React.useState(searchQuery)

  return (
    <form onSubmit={handleSubmit}>
      {search
        ? <h1>You've searched for '{searchQuery}'</h1>
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
```

### With a routing library

If you're using a routing library which manages the history for you, you can provide the `QueryStringProvider` with a custom `update` function. This allows you to wrap your routing libraries `navigate` function to keep it in sync with changes to the query string.

```jsx
import { navigate } from 'your-favorite-routing-library'
import { QueryStringProvider, useQueryString } from '@kaliber/use-query-string'

function AppWithProviders({ search }) {
  return (
    <QueryStringProvider update={updateQueryString} {...{ search }}>
      <App />
    </QueryStringProvider>
  )
}

function updateQueryString({ query, queryString }) {
  navigate([window.location.pathname, queryString].join('?'), {
    state: query,
    replace: true
  })
}
```

**🚨 Caution:** Functions cannot be passed from a server side context to a client side one. So make sure to import your custom import function in your client wrapper as well and pass it to the `QueryStringProvider` again.

You can also use this if you really, *really* want to use `history.pushState` instead of `history.replaceState`. 

## Configuring `query-string`

### Default options
```
{
  parse: {
    arrayFormat: 'bracket'
  },
  stringify: {
    skipEmptyString: true, 
    skipNull: true, 
    arrayFormat: 'bracket'
  }
}
```

### Providing & sharing options
Normally, the default options should be sufficient, but should you wish to provide your own options for `query-string`, you can do so by providing them to the `QueryStringProvider`. 

**🚨 Caution:** make sure this is a stable object!
The easiest way to do this is to define it outside of your component:

```jsx
import { navigate } from 'your-favorite-routing-library'
import { QueryStringProvider, useQueryString } from '@kaliber/use-query-string'

const options = {
  stringify: { arrayFormat: 'comma', skipEmptyString: false, skipNull: false },
  parse: { arrayFormat: 'comma' }
}

function AppWithProviders({ search }) {
  return (
    <QueryStringProvider {...{ search }}>
      <App />
    </QueryStringProvider>
  )
}
```

Sometimes you'll want to use `query-string` in parallel, for instance when generating links with query strings. In that case you should make sure you always use the same options for both. You can either provide `query-string` with options imported from a shared location, or import the default options used by `@kaliber/use-query-string` and use those in your `qs.parse` an `qs.stringify` calls.

```jsx
import qs from 'query-string'
import { defaultOptions as options } from '@kaliber/use-query-string'

function Component(query = {}) {
  const url = '?' + qs.stringify(query, options.stringify)

  return (
    <div>
      <Link to={url}>Link</Link>
    </div>
  )
}
```

or 

```jsx
import { queryStringOptions } from '/some-shared-location'
import { QueryStringProvider, useQueryString } from '@kaliber/use-query-string'

function AppWithProviders({ search }) {
  return (
    <QueryStringProvider options={queryStringOptions} {...{ search }}>
      <App />
    </QueryStringProvider>
  )
}
```

----

![](https://media.giphy.com/media/3o85fQzrJTtmr7iitO/giphy.gif)

## Disclaimer
This library is intended for internal use, we provide __no__ support, use at your own risk. 

This library is not transpiled.
