import OrderTable from './order-table-ui'

const OrderList = () => {
  return (
    <div className='h-full w-full gap-5 flex flex-col relative'>
      {/* <div className='flex gap-5 flex-col xl:flex-row w-full'>
          <MainChart />
        </div> */}
      <div className='h-full w-full rounded-lg '>
        <OrderTable />
      </div>
    </div>
  )
}

export default OrderList
