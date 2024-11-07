import { PropsWithChildren } from 'react'

type Props = PropsWithChildren & {
  extra: string
}

export default function InnerContent(props: Props) {
  const { children, extra, ...rest } = props
  return (
    <div className={`itemx-center mx-auto flex flex-col xl:max-w-[1170px] ${extra}`} {...rest}>
      {children}
    </div>
  )
}
