import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type Props = {
  trigger: React.ReactNode
  content: React.ReactNode
  children?: React.ReactNode
}

const CompoundTooltip = ({ trigger, content, children }: Props) => {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger>{children ?? trigger}</TooltipTrigger>
      <TooltipContent className='max-w-60' alignOffset={20}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

export default CompoundTooltip
