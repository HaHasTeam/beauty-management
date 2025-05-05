import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

function CallVideo() {
  const { roomId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const zpRef = useRef<ZegoUIKitPrebuilt | null>(null)
  const videoContainerRef = useRef(null)
  const [joined, setJoined] = useState(false)
  const [callType, setCallType] = useState('') // State to store the call type

  // Store the previous path from location state or fallback to '/'
  const previousPath = '/dashboard/home'

  // Initialize ZegoUIKit and join room on component mount
  const myMeeting = (type: string) => {
    const appID = 2000324559
    const serverSecret = 'bc8f5d7a673d63254a04a78165b4160e'
    const roomValid = roomId || ''
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomValid,
      Date.now().toString(),
      'Your Name'
    )

    const zp = ZegoUIKitPrebuilt.create(kitToken)
    zpRef.current = zp

    zp.joinRoom({
      container: videoContainerRef.current,
      sharedLinks: [
        {
          name: 'Video Call Link',
          url:
            window.location.protocol +
            '//' +
            window.location.host +
            window.location.pathname +
            '?type=' +
            encodeURIComponent(type)
        }
      ],
      scenario: {
        mode: type === 'one-on-one' ? ZegoUIKitPrebuilt.OneONoneCall : ZegoUIKitPrebuilt.GroupCall
      },
      maxUsers: type === 'one-on-one' ? 2 : 10,
      onJoinRoom: () => {
        setJoined(true)
      },
      onLeaveRoom: () => {
        // Navigate to previous path instead of root
        navigate(previousPath)
      }
    })
  }

  // Handle exit from the room
  const handleExit = () => {
    if (zpRef.current) {
      zpRef.current.destroy()
    }
    // Navigate to previous path instead of root
    navigate(previousPath)
  }

  // On component mount, extract call type from location and initialize meeting
  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const type = query.get('type')

    setCallType(type || '') // Update state with call type
  }, [location.search])

  // Initialize meeting after callType state is set
  useEffect(() => {
    if (callType) {
      myMeeting(callType)
    }

    // Cleanup function for component unmount
    return () => {
      if (zpRef.current) {
        zpRef.current.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callType, roomId, navigate])

  return (
    <div className=' h-screen p-10 bg-slate-900/10'>
      {!joined && (
        <>
          <header className='room-header'>
            {callType === 'one-on-one' ? 'One-on-One Video Call' : 'Group Video Call'}
          </header>
          <button className='exit-button' onClick={handleExit}>
            Exit
          </button>
        </>
      )}
      <div ref={videoContainerRef} className='video-container' />
    </div>
  )
}

export default CallVideo
