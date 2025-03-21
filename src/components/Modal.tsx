import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import Button from '@/components/button'
import UploadFiles, { TriggerUploadRef } from '@/components/file-input/UploadFiles'
import FormLabel from '@/components/form-label'
import SelectBooking from '@/components/select-booking'
import SelectOrder from '@/components/select-order'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { defaultRequiredRegex } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createReport, getFilteredReports } from '@/network/apis/report'
import { TCreateReportRequestParams } from '@/network/apis/report/type'
import { FileStatusEnum } from '@/types/file'
import { ReportTypeEnum } from '@/types/report'

const formSchema = z.object({
  type: z.string({
    message: defaultRequiredRegex.message,
  }),
  reason: z.string({
    message: defaultRequiredRegex.message,
  }),
  files: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        fileUrl: z.string(),
        status: z.nativeEnum(FileStatusEnum).optional(),
      }),
    )
    .min(1, {
      message: defaultRequiredRegex.message,
    }),
  orderId: z.string().optional(),
  bookingId: z.string().optional(),
}).superRefine((data,ctx) => {
  if (data.type === ReportTypeEnum.ORDER && !data.orderId) {
    return ctx.addIssue({
      code:"custom",
      path: ["orderId"],
      message:defaultRequiredRegex.message
    })
  }
  if (data.type === ReportTypeEnum.BOOKING && !data.bookingId) {
    return ctx.addIssue({
      code:"custom",
      path: ["bookingId"],
      message:defaultRequiredRegex.message
    })
  }
})

type formType = z.infer<typeof formSchema>

type Props={
setOpen:(value:boolean)=>void
}

export default function Modal({
  setOpen
}:Props) {
  const handleServerError=useHandleServerError()
  const {successToast}=useToast()
  const triggerRef = useRef<TriggerUploadRef>(null)
  const queryClient = useQueryClient()
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  })

  const {mutateAsync:createReportFn}=useMutation({
    mutationKey:[createReport.mutationKey],
    mutationFn:createReport.fn,
    onSuccess:()=>{
      successToast({
        message:"Report created successfully"
      })
      setOpen(false)
    }
  })

  const onSubmit: SubmitHandler<formType> = async () => {
    try {
     const triggerFns = triggerRef.current?.triggers
    if (triggerFns) {
      await Promise.all(triggerFns.map((trigger) => trigger()))
    }
    const images= form.getValues().files.map((file)=>file.fileUrl)
    const value={...form.getValues(),files:images}
    await createReportFn(value as TCreateReportRequestParams)
    queryClient.invalidateQueries({
       queryKey: [getFilteredReports.queryKey,{}],
    })
    } catch (error) {
      handleServerError({ error, form })
    }
  }

  return (
    <div className="w-full mx-auto space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex-col gap-8 flex">
          <div className="gap-4 flex w-full flex-col">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel required>Type Of Report</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select type of report
                        "
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ReportTypeEnum).map((item) => (
                        <SelectItem key={item} value={ReportTypeEnum[item]}>
                          {item.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('type') === ReportTypeEnum.ORDER && (
              <FormField
                control={form.control}
                shouldUnregister
                name="orderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Report For Order</FormLabel>
                    <SelectOrder {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
             {form.watch('type') === ReportTypeEnum.BOOKING && (
              <FormField
                control={form.control}
                shouldUnregister
                name="bookingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Report For Booking</FormLabel>
                    <SelectBooking {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name={`reason`}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel required>Reason Of Report</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Explain your reason for reporting...
                  "
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-col sm:col-span-2 col-span-1">
                    <FormLabel required>Evidence For Report</FormLabel>
                    <UploadFiles
                      triggerRef={triggerRef}
                      form={form}
                      field={field}
                      dropZoneConfigOptions={{
                        maxFiles: 6,
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/70 text-white" loading={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}
