import * as React from 'react'
import AsyncSelectComponent from 'react-select/async'
import type { Props } from 'react-select'
import { defaultClassNames, defaultStyles } from './helper'
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
  Option,
  Menu,
  MenuList
} from './ReactSelectCustomComponents'

const AsyncSelect = React.forwardRef<
  React.ElementRef<typeof AsyncSelectComponent>,
  React.ComponentPropsWithoutRef<typeof AsyncSelectComponent>
>((props: Props, ref) => {
  const {
    value,
    onChange,
    options = [],
    styles = defaultStyles,
    classNames = defaultClassNames,
    components = {},
    ...rest
  } = props

  const id = React.useId()

  return (
    <AsyncSelectComponent
      className={props.className}
      instanceId={id}
      ref={ref}
      value={value}
      onChange={onChange}
      options={options}
      unstyled
      components={{
        DropdownIndicator,
        ClearIndicator,
        MultiValueRemove,
        Option,
        Menu,
        MenuList,
        ...components
      }}
      styles={styles}
      classNames={classNames}
      {...rest}
    />
  )
})
AsyncSelect.displayName = 'Async Select'
export default AsyncSelect
