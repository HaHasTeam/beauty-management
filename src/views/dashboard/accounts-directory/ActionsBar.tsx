import { Card } from '../../../components/ui/card'
import InviteCoWorker from './InviteCoWorker'

const ActionsBar = () => {
  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full sticky top-28 z-10'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <InviteCoWorker />
        </div>
      </div>
    </Card>
  )
}

export default ActionsBar
