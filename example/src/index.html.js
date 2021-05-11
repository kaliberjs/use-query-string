import App from '/App?universal'
import javascript from '@kaliber/build/lib/javascript'


Index.routes = {
  match(location) {
    const path = location.pathname
    if (path === '/') return { status: 200 }
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
          path === '/' ? <App url={location.pathname + location.search} /> :
          null
        }
      </body>
    </html>
  )
}
