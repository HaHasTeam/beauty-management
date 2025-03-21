import { Workbook } from 'exceljs'
import { saveAs } from 'file-saver'

import Button from '@/components/button'
import { ConsultantServiceTypeEnum } from '@/types/consultant-service'

const DownloadSample = () => {
  const handleDownload = async () => {
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Consultant Services')

    // Define columns
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Question', key: 'question', width: 30 },
      { header: 'Order Index', key: 'orderIndex', width: 15 },
      { header: 'Mandatory', key: 'mandatory', width: 15 },
      { header: 'Type', key: 'type', width: 20 },
      { header: 'Answers', key: 'answers', width: 30 }
    ]

    // Sample data
    const data = [
      {
        id: '1',
        question: 'What is your preferred language?',
        orderIndex: 1,
        mandatory: true,
        type: ConsultantServiceTypeEnum.SingleChoice,
        answers: ['English', 'Spanish', 'French']
      },
      {
        id: '2',
        question: 'What is your current issue?',
        orderIndex: 2,
        mandatory: false,
        type: ConsultantServiceTypeEnum.Text,
        answers: []
      }
    ]

    // Add rows to worksheet
    data.forEach((item) => {
      worksheet.addRow({
        id: item.id,
        question: item.question,
        orderIndex: item.orderIndex,
        mandatory: item.mandatory ? 'Yes' : 'No',
        type: item.type,
        answers: item.answers.join(', ')
      })
    })

    // Generate and save the file
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, 'consultant_services.xlsx')
  }

  return (
    <Button onClick={handleDownload} type='button' variant={'secondary'}>
      Download sample
    </Button>
  )
}

export default DownloadSample
