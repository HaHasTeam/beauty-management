import { HtmlHTMLAttributes } from 'react'

type DivProps = HtmlHTMLAttributes<HTMLDivElement>

export const renderTrack = ({ style, ...props }: DivProps) => {
  const trackStyle = {
    position: 'absolute',
    maxWidth: '100%',
    transition: 'opacity 200ms ease 0s',
    opacity: 0,
    background: 'transparent',
    bottom: 2,
    top: 2,
    borderRadius: 3,
    right: 0
  }
  return <div style={{ ...style, ...trackStyle } as DivProps} className='xl:pr-3.5' {...props} />
}
export const renderThumb = ({ style, ...props }: DivProps) => {
  const thumbStyle = {
    borderRadius: 15
  }
  return <div style={{ ...style, ...thumbStyle }} {...props} />
}
export const renderView = ({ style, ...props }: DivProps) => {
  const viewStyle = {
    width: '100%',
    marginBottom: -22
  }
  return (
    <div
      style={{ ...style, ...viewStyle }}
      className='!translate-x-[5.5%] pr-4 xl:!-mr-8 xl:w-[calc(100%_+_20px)]'
      {...props}
    />
  )
}
