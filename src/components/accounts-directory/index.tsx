import MainChart from '@/components/charts/MainChart'
import BaseTable from '@/components/tables'
import tableDataUserReports from '@/variables/tableDataUserReports'

import ActionsBar from './ActionsBar'

export default function index() {
  return (
    <div className='h-full w-full gap-5 flex flex-col relative'>
      <div className='flex gap-5 flex-col xl:flex-row w-full'>
        <MainChart />
      </div>
      <ActionsBar />
      {/* Conversion and tables*/}
      <div className='h-full w-full rounded-lg '>
        <BaseTable tableData={tableDataUserReports} />
      </div>
    </div>
  )
}
