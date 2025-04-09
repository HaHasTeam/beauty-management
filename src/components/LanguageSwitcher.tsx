import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from './ui/button'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const supportedLngs = i18n.options.supportedLngs || []
  const [isOpenLanguage, setOpenLanguage] = useState(false)
  const toggleDropdown = () => setOpenLanguage(!isOpenLanguage)
  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setOpenLanguage(false)
  }
  return (
    <div className='flex space-x-2 relative'>
      <Button variant='ghost' size='sm' className='h-8 px-2' onClick={toggleDropdown}>
        <span className='text-sm'>{i18n.resolvedLanguage?.toUpperCase()}</span>
        <ChevronDown className='ml-1 h-4 w-4' />
      </Button>
      {isOpenLanguage && (
        <div className='absolute flex flex-col top-full right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-md z-10'>
          {supportedLngs.slice(0, -1).map((lng) => (
            <Button
              key={lng}
              className={`rounded-none ${
                i18n.resolvedLanguage === lng
                  ? 'font-bold bg-primary text-primary-foreground hover:text-primary-foreground'
                  : 'font-normal bg-accent text-accent-foreground  hover:text-primary-foreground'
              }`}
              type='button'
              onClick={() => handleChangeLanguage(lng)}
            >
              {lng.toUpperCase()}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
