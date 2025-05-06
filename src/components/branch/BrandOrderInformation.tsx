import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface BrandOrderInformationProps {
  brandName: string
  brandLogo: string
}

const BrandOrderInformation = ({ brandName, brandLogo }: BrandOrderInformationProps) => {
  return (
    <div className='space-y-2 bg-white shadow-sm w-full p-4 rounded-lg'>
      <div className='flex sm:flex-row flex-col gap-2 sm:items-center'>
        <div className='flex gap-2 items-center'>
          <div className='flex items-center'>
            {brandLogo && (
              <Avatar>
                <AvatarImage src={brandLogo} alt={brandName} />
                <AvatarFallback>{brandName.charAt(0).toUpperCase() ?? 'A'}</AvatarFallback>
              </Avatar>
            )}
          </div>
          <span className='text-xl font-bold'>{brandName}</span>
        </div>
      </div>
    </div>
  )
}

export default BrandOrderInformation
