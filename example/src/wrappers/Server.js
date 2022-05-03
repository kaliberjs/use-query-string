import { QueryStringContext } from '@kaliber/use-query-string'

// eslint-disable-next-line @kaliber/no-default-export
export default function ServerWrapper({ children, ...props }) {
  const queryStringContext = React.useContext(QueryStringContext)
  const clientContext = { queryStringContext }

  return React.Children.map(children, child =>
    React.isValidElement(child)
      ? React.cloneElement(child, { clientContext })
      : child
  )
}
