import { ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

type Props = {
  children: React.ReactNode
  title: ReactNode
  description?: ReactNode
  rightComponent?: ReactNode
}

const index = ({ children, title, description, rightComponent }: Props) => {
  return (
    <Card className='overflow-hidden'>
      <CardHeader className='max-sm:flex-wrap bg-primary/30 overflow-hidden dark:bg-accent/30 mb-6 border-b-2 border-primary/50 dark:border-accent/50 flex flex-row justify-between items-center gap-8'>
        <div>
          <CardTitle className='text-xl font-extrabold md:text-2xl'>{title}</CardTitle>
          {description && <CardDescription className='mt-2'>{description}</CardDescription>}
        </div>
        {rightComponent}
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>{children}</CardContent>
    </Card>
  )
}

export default index
