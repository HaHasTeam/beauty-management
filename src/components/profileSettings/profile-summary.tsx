import SummeryItem from '../ Summary/summary-item'
import CardSection from '../CardSection'

const ProfileSummary = () => {
  return (
    <CardSection
      title='Profile Summary'
      description='
     Summary of your profile details, this information will be displayed on your profile'
    >
      <div className='grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-2'>
        <SummeryItem label='Display Name' value='Allure Beauty' />
        <SummeryItem label='User Name' value='allure_beauty' />
        <SummeryItem label='Email Address' value='allure.beauty@gmail.com' />
        <SummeryItem label='Phone Number' value='+91 9876543210' />
        <SummeryItem label='Date of Birth' value='01 Jan 2000' />
        <SummeryItem label='Street Address' value='123, XYZ Street, ABC City, 123456' />
        <SummeryItem label='Current Role' />
      </div>
    </CardSection>
  )
}

export default ProfileSummary
