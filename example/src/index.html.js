import AppBasic from '/AppBasic?universal'
import AppReachRouter from '/AppReachRouter?universal'
import javascript from '@kaliber/build/lib/javascript'


Index.routes = {
  match(location) {
    const path = location.pathname
    if (path === '/') return { status: 200 }
    if (path === '/reach-router') return { status: 200 }
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
          path === '/' ? <AppBasic url={location.pathname + location.search} /> :
          path === '/reach-router' ? <AppReachRouter url={location.pathname + location.search} /> :
          null
        }
      </body>
    </html>
  )
}
