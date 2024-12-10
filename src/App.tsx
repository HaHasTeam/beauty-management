import { NuqsAdapter } from 'nuqs/adapters/react'
import { Toaster } from 'sonner'

import RouterProvider from '@/router'

import { TooltipProvider } from './components/ui/tooltip'
import AppProvider from './contexts/AppProvider'
import QueryProvider from './contexts/QueryProvider'
import { ThemeProvider } from './contexts/ThemeProvider'
// Create a client

function App() {
  return (
    <>
      <QueryProvider>
        <AppProvider>
          <NuqsAdapter>
            <ThemeProvider>
              <TooltipProvider>
                <RouterProvider />
              </TooltipProvider>
              {/* <ReactQueryDevtools initialIsOpen={true} buttonPosition='bottom-left' /> */}
              {/* The rest of your application */}

              <Toaster closeButton position='top-center' richColors />
            </ThemeProvider>
          </NuqsAdapter>
        </AppProvider>
      </QueryProvider>
    </>
  )
}

export default App
