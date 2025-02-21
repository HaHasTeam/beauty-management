import { ReactElement } from 'react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'

interface SectionCollapsableProps {
  header: ReactElement
  content: ReactElement
}
const SectionCollapsable = ({ header, content }: SectionCollapsableProps) => {
  return (
    <Accordion type='single' collapsible className='w-full' defaultValue='description'>
      <AccordionItem value='description'>
        <AccordionTrigger className='pt-0 text-left font-medium no-underline hover:no-underline'>
          <div className='flex gap-2 items-center'>{header}</div>
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default SectionCollapsable
