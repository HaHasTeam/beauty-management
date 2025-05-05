import Details from './Details'
import Summary from './Summary'

const DetailById = () => {
  return (
    <div className='relative flex w-full flex-col md:pt-[unset]'>
      <div className='max-w-full mx-auto w-full flex-col justify-center md:w-full md:flex-row-reverse xl:w-full gap-8 flex'>
        <div className='w-full md:w-2/5 lg:w-4/12 flex flex-col gap-8'>
          <Summary />
        </div>
        <div className='w-full md:w-3/5 lg:w-8/12 flex flex-col gap-8'>
          <Details />
        </div>
      </div>
    </div>
  )
}

export default DetailById
