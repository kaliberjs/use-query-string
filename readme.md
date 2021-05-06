# `@kaliber/use-query-string`
Update the query string, just like you would update your state. 

## Installation

```
yarn add query-string
yarn add @kaliber/use-query-string
```

## Usage

`useQueryString` return an array with the parsed query string and a setter function. The setter function accepts an object or a function as argument. 

When passed an object, it will overwrite the existing query string with the object provided:
Given a query string `?hello=word`, calling `setQueryString({ foo: 'bar' })` results in `?foo=bar`.

When passed a function, it will use the return value of this function to overwrite the existing query string. The functions receives the parsed current query string as argument. You can use this to make selective changes to the query string:
Given a query string `?hello=word`, calling `setQueryString(x => ({ ...x, foo: 'bar' }))` results in `?hello=world&foo=bar`.

### Without SSR

```jsx
import { useQueryString } from '@kaliber/useQueryString'

function Component() {
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
```

### With SSR
The example with SSR doesn't change, just wrap you application in a `QueryStringProvider`, which you provide the location:

```jsx
import { QueryStringProvider, useQueryString } from '@kaliber/useQueryString'

function AppWithProviders({ serverUrl }) {
  return (
    <QueryStringProvider url={serverUrl}>
      <App />
    </QueryStringProvider>
  )
}
```

### With a routing library

If you're using a routing library which manages the history for you, you can provide the `QueryStringProvider` with a custom `update` function. This allows you to wrap your routing libraries `navigate` function to keep it in sync with changes to the query string. Also see the the examples folder.

```jsx
import { QueryStringProvider, useQueryString } from '@kaliber/useQueryString'

function AppWithProviders({ serverUrl }) {
  return (
    <QueryStringProvider update={updateQueryString} url={serverUrl}>
      <App />
    </QueryStringProvider>
  )
}

function updateQueryString(query, queryString) {
  navigate([window.location.pathname, queryString].join('?'), {
    state: query,
    replace: true
  })
}
```

You can also use this if you really, *really* want to use `history.pushState` instead of `history.replaceState`. 

----

![](https://media.giphy.com/media/3bb5jcIADH9ewHnpl9/giphy.gif)

## Disclaimer
This library is intended for internal use, we provide __no__ support, use at your own risk. 

This library is not transpiled.