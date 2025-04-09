import { Check } from 'lucide-react'

const SuccessContent = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center p-4  dark:bg-gray-900 py-10'>
      <div className='relative z-0 animate-pulse'>
        <div className='absolute -top-8 -left-8 w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-full blur-2xl' />
        <div className='absolute top-4 right-4 w-4 h-4 bg-green-200 dark:bg-green-800 rounded-full' />
        <div className='absolute -bottom-4 left-12 w-6 h-6 bg-green-200 dark:bg-green-800 rounded-full' />
        <div className='relative w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-8'>
          <Check className='w-12 h-12 text-green-500 dark:text-green-400' />
        </div>
      </div>

      <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4 z-20'>Success!</h1>

      <p className='text-center text-gray-500 dark:text-gray-400 max-w-md'>
        Your transaction has been successfully processed. Refresh wallet balance to see the changes.
      </p>
    </div>
  )
}

export default SuccessContent
