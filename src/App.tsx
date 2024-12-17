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
              <div className='absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'>
                <div className='absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]'></div>
              </div>
            </ThemeProvider>
          </NuqsAdapter>
        </AppProvider>
      </QueryProvider>
    </>
  )
}

export default App
