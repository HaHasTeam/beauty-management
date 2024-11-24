import { Navigate } from 'react-router-dom'

type Props = {
  forwardEndpoint: string
}
export const ForwardLink = ({ forwardEndpoint }: Props) => {
  const currentUrl = new URL(window.location.href)
  const newUrl = new URL(forwardEndpoint, currentUrl.origin)
  newUrl.search = currentUrl.search
  return <Navigate to={newUrl.toString()} replace />
}
