import BrandTable from './voucher-table-ui'

export default function VoucherTable() {
  return (
    <div className='h-full w-full gap-5 flex flex-col relative'>
      {/* <div className='flex gap-5 flex-col xl:flex-row w-full'>
        <MainChart />
      </div> */}
      <div className='h-full w-full rounded-lg '>
        <BrandTable />
      </div>
    </div>
  )
}
