import { ArrowRight } from 'lucide-react' // Example icons
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// Import Home Assets
import bookingStaticsImage from '@/assets/home/booking-statics.png'
import flashSaleImage from '@/assets/home/flash-sale.png'
import groupSaleImage from '@/assets/home/group-sale.png'
import orderStaticsImage from '@/assets/home/order-statics.png'
import voucherImage from '@/assets/home/voucher.png'
// Assuming Shadcn Avatar
import { Button } from '@/components/ui/button' // Assuming Shadcn Button
// Assuming Shadcn Card

const Home = () => {
  const { t } = useTranslation('layout') // Assuming 'layout' namespace

  const processSteps = [
    { step: '01', titleKey: 'home.process1Title', descriptionKey: 'home.process1Desc' }, // Title: Đăng kí và xác thực tài khoản
    { step: '02', titleKey: 'home.process2Title', descriptionKey: 'home.process2Desc' }, // Title: Điền đẩy đủ các thông tin về các điều khoản
    { step: '03', titleKey: 'home.process3Title', descriptionKey: 'home.process3Desc' }, // Title: Lên lịch hẹn với nhân viên hệ thống
    { step: '04', titleKey: 'home.process4Title', descriptionKey: 'home.process4Desc' } // Title: Trở thành thành viên của Allure
  ]
  const navigate = useNavigate()
  const handleGetStarted = () => {
    navigate('/auth')
  }
  return (
    <div className='flex flex-col min-h-screen'>
      {/* Hero Section - Enhanced Background & Padding */}
      <section className='bg-gradient-to-br from-primary/5 via-primary/15 to-primary/5 dark:from-primary/10 dark:via-primary/20 dark:to-primary/10 py-24 md:py-10 h-screen'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-4 leading-tight'>
            {t('home.heroTitle', 'Building Digital Experiences')}
          </h1>
          <p className='text-lg md:text-xl text-muted-foreground mb-4 max-w-5xl mx-auto'>
            {t('home.heroSubtitle', 'We help businesses transform with cutting-edge technology and design.')}
          </p>
          {/* Added Allure description */}

          <Button
            onClick={handleGetStarted}
            className='mt-4 px-8 py-3 text-lg font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300'
          >
            {t('home.heroCTA', 'Get Started')} <ArrowRight className='ml-2 h-5 w-5' />
          </Button>
          {/* Container for layered images */}
          <div className='mt-8 mx-auto w-full max-w-5xl relative'>
            {/* Main Hero Image */}
            <img
              src={bookingStaticsImage}
              alt={t('home.heroImageAlt', 'Booking Statistics Overview')}
              className='w-full rounded-lg shadow-2xl ring-1 ring-black/5'
            />
            {/* Overlapping Image */}
            <img
              src={orderStaticsImage}
              alt={t('home.heroOrderStaticsAlt', 'Order Statistics Snippet')}
              className='absolute -bottom-12 -right-12 w-1/2 rounded-lg shadow-xl ring-1 ring-black/10 border border-border/10 transform transition-transform hover:scale-105'
            />
          </div>
        </div>
      </section>
      {/* New Features Section - Subtle Border & Image Shadow */}
      <section className='py-20 md:py-28 border-t border-border/5'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-16'>{t('home.featuresTitle', 'Powerful Features')}</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
            {/* Feature 1: Flash Sale */}
            <div className='text-center'>
              <img
                src={flashSaleImage}
                alt={t('home.featureFlashSaleAlt', 'Flash Sale Management')}
                className='rounded-lg shadow-xl mb-6 w-full h-auto aspect-[16/10] object-cover ring-1 ring-black/5 border border-border/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300'
              />
              <h3 className='text-xl font-semibold mb-2'>{t('home.featureFlashSaleTitle', 'Flash Sales')}</h3>
              <p className='text-muted-foreground'>
                {t('home.featureFlashSaleDesc', 'Easily create and manage timed promotions.')}
              </p>
            </div>

            {/* Feature 2: Group Sale */}
            <div className='text-center'>
              <img
                src={groupSaleImage}
                alt={t('home.featureGroupSaleAlt', 'Group Sale Management')}
                className='rounded-lg shadow-xl mb-6 w-full h-auto aspect-[16/10] object-cover ring-1 ring-black/5 border border-border/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300'
              />
              <h3 className='text-xl font-semibold mb-2'>{t('home.featureGroupSaleTitle', 'Group Buying')}</h3>
              <p className='text-muted-foreground'>
                {t('home.featureGroupSaleDesc', 'Organize group purchase offers.')}
              </p>
            </div>

            {/* Feature 3: Vouchers */}
            <div className='text-center'>
              <img
                src={voucherImage}
                alt={t('home.featureVoucherAlt', 'Voucher Management')}
                className='rounded-lg shadow-xl mb-6 w-full h-auto aspect-[16/10] object-cover ring-1 ring-black/5 border border-border/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300'
              />
              <h3 className='text-xl font-semibold mb-2'>{t('home.featureVoucherTitle', 'Voucher System')}</h3>
              <p className='text-muted-foreground'>
                {t('home.featureVoucherDesc', 'Generate and track discount vouchers.')}
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Process Section - Richer Muted Background */}
      <section className='py-20 md:py-28 bg-muted/50 dark:bg-muted/30'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-16'>{t('home.processTitle', 'Our Process')}</h2>
          <div className='relative grid grid-cols-1 md:grid-cols-4 gap-8'>
            {/* Optional: Add connecting lines/elements for process visualization */}
            {/* <div className='absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2 hidden md:block'></div> */}
            {processSteps.map((step, index) => (
              <div
                key={index}
                className='relative flex flex-col items-center text-center md:items-start md:text-left p-4 z-10'
              >
                {/* <div className='absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-background hidden md:block'></div> */}
                <div className='text-5xl font-bold text-primary/50 dark:text-primary/40 mb-3'>{step.step}</div>
                <h3 className='text-xl font-semibold mb-2'>{t(step.titleKey, `Step ${index + 1} Title`)}</h3>
                <p className='text-muted-foreground'>{t(step.descriptionKey, `Step ${index + 1} Description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section - Subtle Gradient Overlay */}
      <section className='relative py-20 md:py-28 bg-primary text-primary-foreground overflow-hidden'>
        <div
          aria-hidden='true'
          className='absolute inset-0 bg-gradient-radial from-primary-foreground/10 to-transparent opacity-50'
        ></div>
        <div className='relative container mx-auto px-4 text-center z-10'>
          <h2 className='text-3xl font-bold mb-4'>{t('home.ctaTitle', "Let's Build Something Amazing Together")}</h2>
          <p className='text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto'>
            {t('home.ctaDescription', 'Ready to start your next project? Contact us today!')}
          </p>
          <Button variant='secondary' size='lg'>
            {t('home.ctaButton', 'Contact Us')}
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Home
