export async function createFile(url: string) {
  const response = await fetch(url)
  const data = await response.blob()
  const metadata = {
    type: 'image/jpeg',
    url: url
  }
  const file = new File([data], url, metadata)
  return file
}
