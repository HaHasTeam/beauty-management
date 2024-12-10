export default function Separator(props: { text?: string }) {
  const { text } = props
  return (
    <div className='relative  w-10 h-10'>
      <div className='relative flex items-center py-1'>
        <div className='grow border-t border-zinc-200 dark:border-zinc-700'></div>
        {text && <span className='mx-3 shrink text-sm leading-8 text-zinc-500'>{text}</span>}
        <div className='grow border-t border-zinc-200 dark:border-zinc-700'></div>
      </div>
    </div>
  )
}
