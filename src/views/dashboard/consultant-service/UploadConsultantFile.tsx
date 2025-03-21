import { RowValues, Workbook } from 'exceljs'
import { useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import Button from '@/components/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { FormLabel } from '@/components/ui/form'

import { QuestionType, SchemaType } from './helper'

type Props = {
  form: UseFormReturn<SchemaType>
}
const UploadConsultantFile: React.FC<Props> = ({ form }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [transformedData, setTransformedData] = useState<QuestionType[]>([])
  const [open, setOpen] = useState(false)

  const handleButtonClick = () => {
    fileInputRef.current?.click() // Programmatically trigger file input
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    const workbook = new Workbook()
    await workbook.xlsx.load(await file.arrayBuffer())
    const worksheet = workbook.worksheets[0]

    // Read rows starting from the second row (skip headers)
    const parsedData = worksheet
      .getSheetValues()
      .slice(2)
      .map((row: RowValues) => {
        const castRow = row as unknown as [string, string, string, string, string, string, string, string]
        return {
          id: castRow[1] ? String(castRow[1]) : undefined,
          question: castRow[2] || '',
          orderIndex: castRow[3] ? Number(castRow[3]) : undefined,
          mandatory: castRow[4] === 'Yes',
          type: castRow[5] || '',
          answers: castRow[6]
            ? Object.fromEntries(
                castRow[6].split(',').map((answer: string, index: number) => [
                  String.fromCharCode(65 + index), // A, B, C, ...
                  answer.trim()
                ])
              )
            : {},
          images: castRow[7]
            ? castRow[7].split(',').map((image: string) => ({
                name: image.trim(),
                fileUrl: `/uploads/${image.trim()}`
              }))
            : []
        }
      })
    const transformedData = parsedData.map((item) => {
      return {
        ...item,
        answers: Object.entries(item.answers).map(([key, value]) => ({
          label: value,
          value: key
        }))
      }
    })
    setTransformedData(transformedData as unknown as QuestionType[])
    setOpen(true)
  }

  const handleContinue = () => {
    form.setValue('serviceBookingFormData.questions', transformedData as unknown as QuestionType[])
    setOpen(false)
  }

  return (
    <div>
      <FormLabel>
        <input
          type='file'
          accept='.xlsx, .xls .csv'
          onChange={handleFileUpload}
          ref={fileInputRef}
          className='
        hidden
      '
          id='file-upload'
        />
        <Button type='button' onClick={handleButtonClick}>
          Upload File
        </Button>
      </FormLabel>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>When you continue, you will overwrite the existing data.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={handleContinue}>Continue</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UploadConsultantFile
