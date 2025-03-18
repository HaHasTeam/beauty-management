import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

type APIPaginationProps = {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

const APIPagination = ({ totalPages, currentPage, onPageChange }: APIPaginationProps) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  // Array for pagination links (will show up to 5 items)
  const generatePageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    const halfVisiblePages = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, currentPage - halfVisiblePages)
    let endPage = Math.min(totalPages, currentPage + halfVisiblePages)

    // Adjust start and end to ensure at least `maxVisiblePages` pages are visible
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push(page)
    }

    return pageNumbers
  }

  const pageNumbers = generatePageNumbers()

  return (
    totalPages > 0 && (
      <Pagination>
        <PaginationContent>
          <PaginationItem
            className={`${currentPage <= 1 ? 'text-accent hover:cursor-default' : 'text-black hover:cursor-pointer'} rounded-md`}
          >
            <PaginationPrevious
              className={`${currentPage <= 1 ? 'hover:cursor-default hover:text-accent hover:bg-white' : 'hover:cursor-pointer hover:bg-accent hover:text-accent-foreground '} rounded-md `}
              onClick={() => currentPage !== 1 && handlePageChange(currentPage - 1)}
            />
          </PaginationItem>

          {/* Render page number buttons */}
          {pageNumbers.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                className='hover:cursor-pointer'
                onClick={() => handlePageChange(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Show ellipses if totalPages > 5 */}
          {totalPages > 5 && pageNumbers[pageNumbers.length - 1] < totalPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem
            className={`${currentPage === totalPages ? 'text-accent hover:cursor-default' : 'text-black hover:cursor-pointer'} rounded-md`}
          >
            <PaginationNext
              className={`${currentPage === totalPages ? 'hover:cursor-default hover:text-accent hover:bg-white' : 'hover:cursor-pointer hover:bg-accent hover:text-accent-foreground '} rounded-md `}
              onClick={() => currentPage !== totalPages && handlePageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  )
}

export default APIPagination
