import * as React from 'react'
import type {
  ClearIndicatorProps,
  DropdownIndicatorProps,
  MenuListProps,
  MenuProps,
  MultiValueRemoveProps,
  OptionProps
} from 'react-select'
import { components } from 'react-select'
import { CaretSortIcon, CheckIcon, Cross2Icon as CloseIcon } from '@radix-ui/react-icons'
import { FixedSizeList as List } from 'react-window'

export const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretSortIcon className={'h-4 w-4 opacity-50'} />
    </components.DropdownIndicator>
  )
}

export const ClearIndicator = (props: ClearIndicatorProps) => {
  return (
    <components.ClearIndicator {...props}>
      <CloseIcon className={'h-3.5 w-3.5 opacity-50'} />
    </components.ClearIndicator>
  )
}

export const MultiValueRemove = (props: MultiValueRemoveProps) => {
  return (
    <components.MultiValueRemove {...props}>
      <CloseIcon className={'h-3 w-3 opacity-50'} />
    </components.MultiValueRemove>
  )
}

export const Option = (props: OptionProps) => {
  const option = props.data as { label: string; display?: React.ReactNode }

  console.log()
  return (
    <components.Option {...props} className=''>
      <div className='flex items-center justify-between w-full mr-2 truncate'>
        {/* TODO: Figure out the type */}
        {option.display ?? (
          <div className='overflow-hidden text-ellipsis whitespace-nowrap max-w-[90%]'>
            {(props.data as { label: string }).label}
          </div>
        )}
        {props.isSelected && <CheckIcon />}
      </div>
    </components.Option>
  )
}

// Using Menu and MenuList fixes the scrolling behavior
export const Menu = (props: MenuProps) => {
  return <components.Menu {...props}>{props.children}</components.Menu>
}

export const MenuList = (props: MenuListProps) => {
  const { children, maxHeight } = props

  const childrenArray = React.Children.toArray(children)

  const calculateHeight = () => {
    // When using children it resizes correctly
    const totalHeight = childrenArray.length * 35 // Adjust item height if different
    return totalHeight < maxHeight ? totalHeight : maxHeight
  }

  const height = calculateHeight()

  // Ensure childrenArray has length. Even when childrenArray is empty there is one element left
  if (!childrenArray || childrenArray.length - 1 === 0) {
    return <components.MenuList {...props} />
  }

  return (
    <List
      height={height}
      itemCount={childrenArray.length}
      itemSize={35} // Adjust item height if different
      width='100%'
    >
      {({ index, style }) => <div style={style}>{childrenArray[index]}</div>}
    </List>
  )
}
