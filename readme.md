# `@kaliber/use-query-string`
Update the query string, just like you would update your state. 

## Installation

```
yarn add query-string
yarn add @kaliber/use-query-string
```

If you're using `@kaliber/build`, make sure `query-string` and it's es6 dependencies are transpiled:

_config/default.js_
```js
module.exports = {
  kaliber: {
    compileWithBabel: [
      /@kaliber\//,
      /query-string/,
      /split-on-first/,
      /strict-uri-encode/,
    ]
  }
}
```

## Usage

`useQueryString` returns an array with two items: the parsed query string and a setter function. The setter function accepts an object or a function as argument. 

When passed an object, it will overwrite the existing query string with the object provided:
Given a query string `?hello=word`, calling `setQueryString({ foo: 'bar' })` results in `?foo=bar`.

When passed a function, it will use the return value of this function to overwrite the existing query string. The functions receives the parsed current query string as argument. You can use this to make selective changes to the query string:
Given a query string `?hello=world`, calling `setQueryString(x => ({ ...x, foo: 'bar' }))` results in `?hello=world&foo=bar`.

### Without SSR

```jsx
import { useQueryString } from '@kaliber/useQueryString'

function Component() {
  const [{ search: searchQuery }, setQueryString] = useQueryString({ search: '' })
  const [input, setInput] = React.useState(null)

  return (
    <form onSubmit={handleSubmit}>
      {search
        ? <h1>You've searched on '{searchQuery}'</h1>
        : <h1>Search</h1>
      }
      <input type='text' value={input ?? searchQuery} onChange={e => setInput(e.currentTarget.value)} name='search' />
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
Wrap you application in a `QueryStringProvider`, which you provide with the known `search` string. If you're using express, that would be `req.location.search`. Because `search` is now correctly set on the first render, you can safely use it as the default value for `input`.

```jsx
import { QueryStringProvider, useQueryString } from '@kaliber/useQueryString'

function AppWithProviders({ search }) {
  return (
    <QueryStringProvider {...{ search }}>
      <App />
    </QueryStringProvider>
  )
}


function Component() {
  const [{ search: searchQuery }, setQueryString] = useQueryString({ search: '' })
  const [input, setInput] = React.useState(search)

  return (
    <form onSubmit={handleSubmit}>
      {search
        ? <h1>You've searched on '{searchQuery}'</h1>
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
import { QueryStringProvider, useQueryString } from '@kaliber/useQueryString'

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

You can also use this if you really, *really* want to use `history.pushState` instead of `history.replaceState`. 

----

![](https://media.giphy.com/media/3o85fQzrJTtmr7iitO/giphy.gif)

## Disclaimer
This library is intended for internal use, we provide __no__ support, use at your own risk. 

This library is not transpiled.