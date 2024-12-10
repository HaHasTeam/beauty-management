import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

interface ExpandableDescriptionProps {
  description: string
}

const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className='bg-background p-3 rounded-lg shadow'>
      <div className='flex justify-between items-center mb-2'>
        <span className='text-sm font-medium text-muted-foreground'>Description</span>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => setIsExpanded(!isExpanded)}
          className='text-primary'
        >
          {isExpanded ? (
            <>
              <ChevronUp className='w-4 h-4 mr-1' />
              Less
            </>
          ) : (
            <>
              <ChevronDown className='w-4 h-4 mr-1' />
              More
            </>
          )}
        </Button>
      </div>
      <p className={`text-foreground font-semibold ${isExpanded ? '' : 'line-clamp-2'}`}>{description}</p>
    </div>
  )
}

export default ExpandableDescription
