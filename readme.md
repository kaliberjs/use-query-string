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
  const [query, setQueryString] = useQueryString({ order_by: 'descencing' })
  const { order_by: orderBy } = query

  return (
    <div>
      <button onClick={handleClick} type='button'>
        { order_by === 'descending' ? '↓' : '↑' }
      </button>
    </div>
  )

  function handleClick() {
    setQueryString(x => ({ ...x, order_by: orderBy === 'descending' ? 'ascending' : 'descending' }))
  }
}
```

### With SSR
The example with SSR doesn't change, just wrap you application in a `QueryStringProvider`, which you provide the location:

```jsx
import { useQueryString } from '@kaliber/useQueryString'

function AppWithProviders() {
  return (
    <QueryStringProvider {...{ location }}>
      <App />
    </QueryStringProvider>
  )
}
```

![](https://media.giphy.com/media/3bb5jcIADH9ewHnpl9/giphy.gif)

## Disclaimer
This library is intended for internal use, we provide __no__ support, use at your own risk. 

This library is not transpiled.