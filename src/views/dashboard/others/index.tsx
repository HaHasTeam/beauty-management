import { Navigate } from 'react-router-dom'

export const RedirectToMainDashboard = () => {
  return <Navigate to='/dashboard/home' replace />
}
