interface CircularProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  backgroundColor?: string
  progressColor?: string
  hidden?: boolean
}

interface ILoadingProgress {
  progress: number
  size?: number
  strokeWidth?: number
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 100,
  strokeWidth = 8,
  backgroundColor = '#d6d3d3',
  progressColor = '#3b82f6',
  hidden = false
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      <svg width={size} height={size} className='transform -rotate-90'>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={backgroundColor} strokeWidth={strokeWidth} fill='none' />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill='none'
          className={`transition-all duration-300 ease-in-out ${progressColor}`}
        />
      </svg>
      <div className={`${hidden ? 'hidden' : 'visible'} text-primary`}>{Math.round(progress)}%</div>
    </div>
  )
}

export default CircularProgress

export const LoadingCircle = ({ progress, size = 50, strokeWidth = 8 }: ILoadingProgress) => (
  <CircularProgress progress={progress} size={size} strokeWidth={strokeWidth} progressColor='#F16F90' />
)
