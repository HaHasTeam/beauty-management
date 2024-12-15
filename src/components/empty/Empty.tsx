import { Link } from 'react-router-dom'

import emptyInbox from '@/assets/images/EmptyInbox.png'

type EmptyProps = {
  title: string
  description: string
  icon?: string
  linkText?: string
  link?: string
}
const Empty = ({ title, description, icon, linkText, link }: EmptyProps) => {
  return (
    <div className='w-full h-full flex flex-col space-y-4 justify-center align-middle'>
      <div className='flex justify-center align-middle'>
        <img src={icon ? icon : emptyInbox} className='object-contain' />
      </div>
      <div className='flex flex-col space-y-2'>
        <h2 className='font-semibold text-primary text-center text-lg'>{title}</h2>
        <p className='text-gray-600 text-center'>{description}</p>
        {linkText && (
          <Link to={link ?? ''} className='p-3 rounded-md bg-primary hover:bg-primary/80'>
            {linkText}
          </Link>
        )}
      </div>
    </div>
  )
}

export default Empty
