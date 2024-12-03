import CardSection from '@/components/card-section'
import SummeryItem from '@/components/summary/summary-item'

const PreOrderSummary = () => {
  return (
    <CardSection
      title='Pre-order Summary'
      description='This is  summary for your pre-order. Please review the information below and make sure everything is correct.'
    >
      <div className='grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-2'>
        <SummeryItem label='Product Name' value={''} />
        <SummeryItem label='Start Time' value={''} />
        <SummeryItem label='End Time' value={''} />
      </div>
    </CardSection>
  )
}

export default PreOrderSummary
