import type { Steppers } from '@/hooks/useStepper'

type Props = {
  stepIndex: number
  goNextFn: (number?: number) => void
  goBackfn: (number?: number) => void
  steppers: Steppers[]
}
function DocumentDetails({ stepIndex, goBackfn, goNextFn, steppers }: Props) {
  return <div className=''></div>
}

export default DocumentDetails
