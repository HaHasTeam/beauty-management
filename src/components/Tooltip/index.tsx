import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type Props = {
  trigger: React.ReactNode
  content: React.ReactNode
}

const CompoundTooltip = ({ trigger, content }: Props) => {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger>{trigger}</TooltipTrigger>
      <TooltipContent className='max-w-60 bg-accent'>{content}</TooltipContent>
    </Tooltip>
  )
}

export default CompoundTooltip
