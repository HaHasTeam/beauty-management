import CardSection from '@/components/card-section'
import SummeryItem from '@/components/summary/summary-item'

const FlashSaleSummary = () => {
  return (
    <CardSection
      title='Flash Sale Summary'
      description='This is  summary for your flash sale. Please review the information below and make sure everything is correct.'
    >
      <div className='grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-2'>
        <SummeryItem label='Product Name' value={''} />
        <SummeryItem label='Start Time' value={''} />
        <SummeryItem label='End Time' value={''} />
      </div>
    </CardSection>
  )
}

export default FlashSaleSummary
