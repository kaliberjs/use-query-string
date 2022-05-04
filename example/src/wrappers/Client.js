import { QueryStringProvider } from '@kaliber/use-query-string'

// eslint-disable-next-line @kaliber/no-default-export
export default function ClientWrapper({ children, ...props }) {
  const { clientContext } = props

  return (
    <QueryStringProvider {...clientContext.queryStringContext}>
      {children}
    </QueryStringProvider>
  )
}
