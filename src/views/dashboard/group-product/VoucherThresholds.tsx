import { DollarSign, Percent, TicketCheckIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { StepItem } from '@/components/ui/stepper'
import { Step, Stepper, useStepper } from '@/components/ui/stepper'
import { Textarea } from '@/components/ui/textarea'
import { DiscountTypeEnum, VoucherApplyTypeEnum } from '@/types/enum'
import { generateCouponCode } from '@/utils'
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
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'criterias'
  })

  const steps = useMemo(() => {
    return fields.map<StepItem>((_, index) => ({
      label: `Stage ${index + 1}`,
      icon: TicketCheckIcon,
      description:
        !!_.threshold && !!_.voucher.discountValue
          ? `Will discount ${_.voucher.discountType === DiscountTypeEnum.AMOUNT ? `${formatCurrency(_.voucher.discountValue)}` : `${formatNumber(_.voucher.discountValue, '%')}`} if ${formatNumber(_.threshold, ' people')} buy this product together.`
          : undefined
    }))
  }, [fields])

  const addThreshold = async () => {
    const code = generateCouponCode()

    append({
      voucher: {
        name: 'Group voucher' + code,
        code: 'group-voucher-' + code,
        discountType: DiscountTypeEnum.AMOUNT,
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
                <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2 backdrop-blur-md'>
                  <FormField
                    control={form.control}
                    name={`criterias.${index}.threshold`}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel required>Quantity Of Customer</FormLabel>
                          <Input {...field} placeholder={`e.g. 10`} type='quantity' />
                          <FormDescription>
                            The minimum number of people that must purchase the group product to activate the voucher.
                          </FormDescription>
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
                                    <div className='flex'>
                                      <div className='relative'>
                                        <Select
                                          onValueChange={discountTypeField.onChange}
                                          value={discountTypeField.value}
                                          defaultValue={DiscountTypeEnum.AMOUNT}
                                        >
                                          <SelectTrigger className='min-w-48 h-9 peer inline-flex appearance-none items-center rounded-none rounded-s-lg border border-input bg-background pe-8 ps-3 text-sm text-muted-foreground transition-shadow hover:bg-accent hover:text-accent-foreground focus:z-10 focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'>
                                            <SelectValue placeholder='Select discount type' />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value={DiscountTypeEnum.AMOUNT}>
                                              <div className='flex items-center gap-1'>
                                                <DollarSign />
                                                <span>By Price</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem
                                              value={DiscountTypeEnum.PERCENTAGE}
                                              className='flex items-center gap-1'
                                            >
                                              <div className='flex items-center gap-1'>
                                                <Percent />
                                                <span>By Percentage</span>
                                              </div>
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <Input
                                        className='-ms-px rounded-s-none shadow-none focus-visible:z-10'
                                        placeholder={`${discountType === DiscountTypeEnum.AMOUNT ? 'e.g. 10,000' : 'e.g. 10%'}`}
                                        {...discountValueField}
                                        type={discountType === DiscountTypeEnum.AMOUNT ? 'currency' : 'percentage'}
                                      />
                                    </div>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                          <FormDescription>
                            The discount value that will be applied to the group product.
                          </FormDescription>
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
                        <FormDescription>
                          The description of the voucher that will be shown to customers.
                        </FormDescription>
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
