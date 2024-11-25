import BasicInformation from './BasicInformation'
import DetailInformation from './DetailInformation'
import SalesInformation from './SalesInformation'

const index = () => {
  return (
    <div>
      <form>
        <BasicInformation />
        <DetailInformation />
        <SalesInformation />
      </form>
    </div>
  )
}

export default index
