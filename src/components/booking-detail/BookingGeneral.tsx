import { Card } from '../ui/card'

// Booking General section for timeline, consultant info, etc.
const BookingGeneral = ({
  title,
  icon,
  content,
}: {
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}) => {
  return (
    <Card className="w-full bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-3 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">{icon}</div>
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      <div>{content}</div>
    </Card>
  )
}
export default BookingGeneral
