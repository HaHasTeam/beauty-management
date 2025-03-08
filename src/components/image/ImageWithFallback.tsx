// ImageWithFallback.tsx
import { ImgHTMLAttributes, useState } from 'react'

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  fallback: string
}

const ImageWithFallback: React.FC<Props> = ({ fallback, src, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src)
  const onError = () => setImgSrc(fallback)

  return <img src={imgSrc || fallback} onError={onError} {...props} />
}

export default ImageWithFallback
