import { CSSProperties, PropsWithChildren, useMemo } from 'react'
import { Link, LinkProps } from 'react-router-dom'

export type NavLinkProps = LinkProps &
  PropsWithChildren & {
    styles?: CSSProperties
    borderRadius?: string
  }

function NavLink({ className, children, styles, borderRadius, ...props }: NavLinkProps) {
  const memoizedStyles = useMemo(
    () => ({
      borderRadius: borderRadius || 0,
      ...styles
    }),
    [borderRadius, styles]
  )

  return (
    <Link className={`${className}`} style={memoizedStyles} {...props}>
      {children}
    </Link>
  )
}

export default NavLink
