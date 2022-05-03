import App from '/App.universal'
import AppWithoutProvider from '/AppWithoutProvider.universal'
import javascript from '@kaliber/build/lib/javascript'
import { QueryStringProvider }  from '@kaliber/use-query-string'

Index.routes = {
  match(location) {
    const path = location.pathname
    if (['/', '/no-provider'].includes(path)) return { status: 200 }
    else return { status: 404 }
  }
}

export default function Index({ location }) {
  const path = location.pathname
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <title>@kaliber/use-query-string</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        {javascript}
      </head>
      <body>
        {
          path === '/' ? <AppWithProvider search={location.search} /> :
          path === '/no-provider' ? <AppWithoutProvider /> : // This is the case if you don't have SSR
          <h1>Not found</h1>
        }
      </body>
    </html>
  )
}

function AppWithProvider({ search }) {
  return (
    <QueryStringProvider {...{ search }}>
      <App />
    </QueryStringProvider>
  )
}