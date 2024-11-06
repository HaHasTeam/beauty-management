import MainChart from '@/components/charts/MainChart'
import BaseTable from '@/components/tables'
import tableDataUserReports from '@/variables/tableDataUserReports'

export default function index() {
  return (
    <div className="h-full w-full">
      <div className="mb-5 flex gap-5 flex-col xl:flex-row w-full">
        <MainChart />
      </div>
      {/* Conversion and tables*/}
      <div className="h-full w-full rounded-lg ">
        <BaseTable tableData={tableDataUserReports} />
      </div>
    </div>
  )
}
