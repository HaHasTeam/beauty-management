import { Toaster } from 'sonner'

import RouterProvider from '@/router'

import { TooltipProvider } from './components/ui/tooltip'
import AppProvider from './contexts/AppProvider'
import QueryProvider from './contexts/QueryProvider'
import { ThemeProvider } from './contexts/theme-provider'
// Create a client

function App() {
  return (
    <>
      <QueryProvider>
        {/* <AppProvider> */}
        <ThemeProvider>
          <TooltipProvider>
            <RouterProvider />
          </TooltipProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <Toaster closeButton position='top-center' richColors />
        </ThemeProvider>
        {/* </AppProvider> */}
      </QueryProvider>
    </>
  )
}

export default App
