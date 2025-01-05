import GroupProductDetails from './GroupProductDetails'
import GroupProductSummary from './GroupProductSummary'

const AddGroupProduct = () => {
  return (
    <div className='relative flex w-full flex-col md:pt-[unset]'>
      <div className='max-w-full mx-auto w-full flex-col justify-center md:w-full md:flex-row xl:w-full gap-8 flex'>
        <div className='w-full md:w-3/5 lg:w-3/4 flex flex-col gap-8'>
          <GroupProductDetails />
        </div>
        <div className='w-full md:w-2/5 lg:w-1/4 flex flex-col gap-8'>
          <GroupProductSummary />
        </div>
      </div>
    </div>
  )
}

export default AddGroupProduct
