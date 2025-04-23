export const url = import.meta.env.VITE_SITE_URL
export const handleRoomIdGenerate = () => {
  const randomId = Math.random().toString(36).substring(2, 9)
  const timestamp = Date.now().toString().substring(-4)
  return `${url}/room/${randomId + timestamp}?type=one-on-one`
}
