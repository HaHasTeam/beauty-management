import { PlayCircle, Video } from 'lucide-react'
import { useEffect, useState } from 'react'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import { cn } from '@/lib/utils'
import { IImage } from '@/types/image'

import ImageWithFallback from '../image/ImageWithFallback'

interface VideoThumbnailProps {
  file: File
  className?: string
  onClick?: () => void
}

export function VideoThumbnail({ file, className, onClick }: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)

  useEffect(() => {
    if (!file) return

    // Create object URL from the File object
    const fileUrl = URL.createObjectURL(file)

    // Create video element to generate thumbnail
    const video = document.createElement('video')
    video.src = fileUrl
    video.crossOrigin = 'anonymous'
    video.muted = true

    // Listen for metadata loaded to know when video is ready
    video.addEventListener('loadedmetadata', () => {
      // Seek to the 1 second mark or 25% of video, whatever is smaller
      video.currentTime = Math.min(1, video.duration * 0.25)
    })

    // Create thumbnail once we've seeked to the right spot
    video.addEventListener('seeked', () => {
      // Create a canvas to draw the video frame
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the video frame to the canvas
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        // Convert canvas to data URL and set as thumbnail
        setThumbnail(canvas.toDataURL('image/jpeg'))
      }

      // Clean up
      video.pause()
      video.src = ''
      video.load()
      URL.revokeObjectURL(fileUrl) // Clean up the object URL
    })

    // Handle errors
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    video.addEventListener('error', (_e) => {
      URL.revokeObjectURL(fileUrl) // Clean up the object URL on error too
    })

    // Start loading the video
    video.load()

    // Cleanup function
    return () => {
      URL.revokeObjectURL(fileUrl)
    }
  }, [file])
  return (
    <div
      className={cn('relative w-full h-full cursor-pointer overflow-hidden rounded-lg', className)}
      onClick={onClick}
    >
      {thumbnail ? (
        // Show the actual thumbnail with play button overlay
        <div className='relative w-full h-full'>
          <ImageWithFallback
            fallback={fallBackImage}
            src={thumbnail}
            alt='Video thumbnail'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
            <PlayCircle className='text-white w-10 h-10' />
          </div>
        </div>
      ) : (
        // Fallback while thumbnail is generating
        <div className='bg-black/10 w-full h-full flex items-center justify-center'>
          <PlayCircle className='text-primary w-10 h-10' />
        </div>
      )}
      <div className='absolute bottom-1 right-1 bg-black/50 text-white rounded-full p-1'>
        <Video className='w-4 h-4' />
      </div>
    </div>
  )
}

export function VideoThumbnailServer({
  file,
  className,
  onClick
}: {
  file: IImage
  className?: string
  onClick?: () => void
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!file || !file.fileUrl) {
      setIsLoading(false)
      return
    }

    // Create video element to generate thumbnail
    const video = document.createElement('video')
    video.src = file.fileUrl
    video.crossOrigin = 'anonymous'
    video.muted = true

    // Listen for metadata loaded to know when video is ready
    video.addEventListener('loadedmetadata', () => {
      // Seek to the 1 second mark or 25% of video, whatever is smaller
      video.currentTime = Math.min(1, video.duration * 0.25)
    })

    // Create thumbnail once we've seeked to the right spot
    video.addEventListener('seeked', () => {
      // Create a canvas to draw the video frame
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the video frame to the canvas
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        // Convert canvas to data URL and set as thumbnail
        setThumbnail(canvas.toDataURL('image/jpeg'))
      }

      // Clean up
      video.pause()
      video.src = ''
      video.load()
      setIsLoading(false)
    })

    // Handle errors
    video.addEventListener('error', () => {
      setIsLoading(false)
    })

    // Start loading the video
    video.load()

    // Cleanup function
    return () => {
      video.src = ''
      video.load()
    }
  }, [file])

  return (
    <div
      className={cn('relative w-full h-full cursor-pointer overflow-hidden rounded-lg', className)}
      onClick={onClick}
    >
      {thumbnail ? (
        // Show the actual thumbnail with play button overlay
        <div className='relative w-full h-full'>
          <ImageWithFallback
            fallback={fallBackImage}
            src={thumbnail}
            alt='Video thumbnail'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
            <PlayCircle className='text-white w-10 h-10' />
          </div>
        </div>
      ) : (
        // Fallback while thumbnail is generating
        <div className='bg-black/10 w-full h-full flex items-center justify-center'>
          {isLoading ? (
            <div className='animate-pulse'>
              <PlayCircle className='text-primary/60 w-10 h-10' />
            </div>
          ) : (
            // Video poster fallback if thumbnail generation failed
            <>
              <video className='object-cover w-full h-full' poster={`${file.fileUrl}#t=0.1`}>
                <source src={file.fileUrl} />
              </video>
              <div className='absolute inset-0 flex items-center justify-center'>
                <PlayCircle className='text-white w-10 h-10' />
              </div>
            </>
          )}
        </div>
      )}
      <div className='absolute bottom-1 right-1 bg-black/50 text-white rounded-full p-1'>
        <Video className='w-4 h-4' />
      </div>
    </div>
  )
}
