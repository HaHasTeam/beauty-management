import { Percent, TicketCheckIcon } from 'lucide-react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { StepItem } from '@/components/ui/stepper'
import { Step, Stepper, useStepper } from '@/components/ui/stepper'
import { Textarea } from '@/components/ui/textarea'
import { DiscountTypeEnum, VoucherApplyTypeEnum } from '@/types/enum'
import { generateMeaningfulCode } from '@/utils'
import { formatCurrency, formatNumber } from '@/utils/number'

import { formSchema } from './helper'

type formSchemaType = z.infer<typeof formSchema>
type VoucherThresholdsProps = {
  form: UseFormReturn<formSchemaType>
}

type StepButtonsProps = {
  removeThreshold: (index: number) => void
  addThreshold: () => void
  validateForm: () => Promise<boolean>
}
function StepButtons({ addThreshold, removeThreshold, validateForm }: StepButtonsProps) {
  const { nextStep, prevStep, isLastStep, isOptionalStep, isDisabledStep, activeStep } = useStepper()

  const handleCreateThreshold = async () => {
    const res = await validateForm()
    if (res) {
      addThreshold()
      nextStep()
    }
  }

  const handlePrevStep = async () => {
    const res = await validateForm()
    if (res) {
      prevStep()
    }
  }

  return (
    <div className='mb-4 flex w-full gap-2'>
      <Button disabled={isDisabledStep} onClick={handlePrevStep} size='sm' variant='secondary' type='button'>
        Prev
      </Button>
      <Button size='sm' onClick={isLastStep ? handleCreateThreshold : nextStep} type='button'>
        {isLastStep ? 'Add more' : isOptionalStep ? 'Skip' : 'Next'}
      </Button>

      <Button
        disabled={isDisabledStep}
        onClick={() => {
          removeThreshold(activeStep)
          prevStep()
        }}
        size='sm'
        variant='secondary'
      >
        Remove
      </Button>
    </div>
  )
}

function FinalStep() {
  const { hasCompletedAllSteps, resetSteps } = useStepper()

  if (!hasCompletedAllSteps) return null

  return (
    <>
      <div className='bg-secondary text-primary flex h-40 items-center justify-center rounded-md border'>
        <h1 className='text-xl'>Woohoo! All steps completed! 🎉</h1>
      </div>
      <div className='flex w-full justify-end gap-2'>
        <Button size='sm' onClick={resetSteps}>
          Reset
        </Button>
      </div>
    </>
  )
}

const VoucherThresholds = ({ form }: VoucherThresholdsProps) => {
  const { append, remove } = useFieldArray({
    control: form.control,
    name: 'criterias'
  })

  const criterias = form.watch('criterias')
  const steps = criterias.map<StepItem>((_, index) => {
    const type = form.watch(`criterias.${index}.voucher.discountType`)
    const value = form.watch(`criterias.${index}.voucher.discountValue`)
    const threshold = form.watch(`criterias.${index}.threshold`)

    return {
      label: `Stage ${index + 1}`,
      icon: TicketCheckIcon,
      description:
        !!threshold && !!value
          ? `Will discount ${type === DiscountTypeEnum.AMOUNT ? `${formatCurrency(value)}` : `${formatNumber(value * 100, '%')}`} if ${formatNumber(threshold, ' people')} buy this product together.`
          : undefined
    }
  })

  const addThreshold = async () => {
    const initialCode = generateMeaningfulCode('GROUP')
    append({
      voucher: {
        name: initialCode,
        code: initialCode,
        discountType: DiscountTypeEnum.PERCENTAGE,
        applyType: VoucherApplyTypeEnum.ALL
      }
    } as formSchemaType['criterias'][0])
  }

  const removeThreshold = (index: number) => {
    remove(index)
  }

  const validateForm = async () => {
    const res = await form.trigger('criterias')
    return res
  }

  return (
    <div className='flex w-full flex-col gap-4'>
      <Stepper orientation='vertical' initialStep={0} steps={steps}>
        {steps.map((stepProps, index) => {
          return (
            <Step key={stepProps.label} {...stepProps}>
              <div className='flex flex-col gap-4'>
                <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2 backdrop-blur-md p-1'>
                  <FormField
                    control={form.control}
                    name={`criterias.${index}.threshold`}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel required>Quantity Of Customer</FormLabel>
                          <Input {...field} placeholder={`e.g. 150`} type='quantity' symbol='People' />
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={form.control}
                    name={`criterias.${index}.voucher.discountValue`}
                    render={({ field: discountValueField }) => {
                      return (
                        <FormItem>
                          <FormLabel required>Discount Value</FormLabel>
                          <FormField
                            control={form.control}
                            name={`criterias.${index}.voucher.discountType`}
                            render={({ field: discountTypeField }) => {
                              const discountType = discountTypeField.value as DiscountTypeEnum
                              return (
                                <FormItem>
                                  <div className='space-y-2'>
                                    <div className='flex w-full'>
                                      <div className='relative'>
                                        <Select
                                          onValueChange={discountTypeField.onChange}
                                          value={discountTypeField.value}
                                          defaultValue={DiscountTypeEnum.PERCENTAGE}
                                        >
                                          <SelectTrigger className='inline-flex items-center rounded-none rounded-l-lg border border-input disabled:cursor-not-allowed disabled:opacity-50'>
                                            <SelectValue placeholder='Select discount type' />
                                          </SelectTrigger>
                                          <SelectContent
                                            style={{
                                              width: `var(--radix-dropdown-menu-trigger-width)`
                                            }}
                                          >
                                            <SelectItem
                                              value={DiscountTypeEnum.PERCENTAGE}
                                              className='flex items-center gap-1'
                                            >
                                              <div className='flex items-center gap-1'>
                                                <Percent />
                                              </div>
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <Input
                                        className='-ms-px rounded-s-none shadow-none flex-1'
                                        placeholder={`${discountType === DiscountTypeEnum.AMOUNT ? 'e.g. 100,000 VND' : 'e.g. 10%'}`}
                                        {...discountValueField}
                                        type={discountType === DiscountTypeEnum.AMOUNT ? 'currency' : 'percentage'}
                                      />
                                    </div>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={form.control}
                    name={`criterias.${index}.voucher.description`}
                    render={({ field }) => (
                      <FormItem className='col-span-1 sm:col-span-2'>
                        <FormLabel>Description Of Voucher</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='e.g. Get 10% off when 10 people buy this product together. '
                            {...field}
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <StepButtons
                  addThreshold={addThreshold}
                  removeThreshold={removeThreshold}
                  validateForm={validateForm}
                />
              </div>
            </Step>
          )
        })}
        <FinalStep />
      </Stepper>
    </div>
  )
}

export default VoucherThresholds
