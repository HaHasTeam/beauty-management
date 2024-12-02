import type { Steppers } from '@/hooks/useStepper'

type Props = {
  stepIndex: number
  goNextFn: (number?: number) => void
  goBackfn: (number?: number) => void
  steppers: Steppers[]
}
function Confirmation({ stepIndex, goBackfn, goNextFn, steppers }: Props) {
  return <div className=''>Confirmation</div>
}

export default Confirmation
