import ProductTable from './product-table-ui'

const index = () => {
  return (
    <div className='h-full w-full gap-5 flex flex-col relative'>
      {/* <div className='flex gap-5 flex-col xl:flex-row w-full'>
        <MainChart />
      </div> */}
      <div className='h-full w-full rounded-lg '>
        <ProductTable />
      </div>
    </div>
  )
}

export default index
