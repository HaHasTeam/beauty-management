import FlashSaleDetails from './FlashSaleDetails'
import FlashSaleSummary from './FlashSaleSummary'

const FlashSaleDetailsById = () => {
  return (
    <div className='relative flex w-full flex-col md:pt-[unset]'>
      <div className='max-w-full mx-auto w-full flex-col justify-center md:w-full xl:w-full gap-8 flex md:flex-row-reverse'>
        <div className='w-full md:w-2/5 lg:w-4/12  flex flex-col gap-8'>
          <FlashSaleSummary />
        </div>
        <div className='w-full  md:w-3/5 lg:w-8/12  flex flex-col gap-8'>
          <FlashSaleDetails />
        </div>
      </div>
    </div>
  )
}

export default FlashSaleDetailsById
