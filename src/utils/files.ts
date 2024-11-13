export async function createFiles(urls: string[]): Promise<File[]> {
  const files = await Promise.all(
    urls.map(async (url) => {
      const response = await fetch(url)
      const data = await response.blob()
      const metadata = {
        type: data.type
      }
      return new File([data], url, metadata)
    })
  )
  return files
}
