import BookingTable from './booking-table-ui'

export default function BookingManagementPage() {
  return (
    <div className='flex flex-col gap-4'>
      {/* <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
        <TabsList className='w-fit grid-cols-2 mb-6'>
          <TabsTrigger value='bookings' className='flex items-center gap-2'>
            <Calendar className='h-4 w-4' />
            <span>{t('booking.tabs.bookings', 'Bookings')}</span>
          </TabsTrigger>
          <TabsTrigger value='requests' className='flex items-center gap-2'>
            <RefreshCw className='h-4 w-4' />
            <span>{t('booking.tabs.requests', 'Requests')}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='bookings'>
          <h2 className='text-xl font-semibold mb-4'>{t('booking.management', 'Bookings Management')}</h2>
          <BookingTable />
        </TabsContent>
        <TabsContent value='requests'>
          <h2 className='text-xl font-semibold mb-4'>{t('booking.management.requests', 'Booking Requests')}</h2>
          <BookingRequestsTable />
        </TabsContent>
      </Tabs> */}
      {/* <h2 className='text-xl font-semibold mb-4'>{t('booking.management', 'Bookings Management')}</h2> */}
      <BookingTable />
    </div>
  )
}
