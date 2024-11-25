'use client'

import 'prismjs'

// Prism must be imported before all language files
import { cn } from '@udecode/cn'
import { useCodeBlockCombobox, useCodeBlockComboboxState } from '@udecode/plate-code-block/react'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as Prism from 'prismjs'
import { useState } from 'react'

import { Button } from './button'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export { Prism }

const languages: { label: string; value: string }[] = [
  { label: 'Plain Text', value: 'text' },
  { label: 'Bash', value: 'bash' },
  { label: 'CSS', value: 'css' },
  { label: 'Git', value: 'git' },
  { label: 'GraphQL', value: 'graphql' },
  { label: 'HTML', value: 'html' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'JSON', value: 'json' },
  { label: 'JSX', value: 'jsx' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'SQL', value: 'sql' },
  { label: 'SVG', value: 'svg' },
  { label: 'TSX', value: 'tsx' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'WebAssembly', value: 'wasm' },
  { label: 'ANTLR4', value: 'antlr4' },
  { label: 'C', value: 'c' },
  { label: 'CMake', value: 'cmake' },
  { label: 'CoffeeScript', value: 'coffeescript' },
  { label: 'C#', value: 'csharp' },
  { label: 'Dart', value: 'dart' },
  { label: 'Django', value: 'django' },
  { label: 'Docker', value: 'docker' },
  { label: 'EJS', value: 'ejs' },
  { label: 'Erlang', value: 'erlang' },
  { label: 'Go', value: 'go' },
  { label: 'Groovy', value: 'groovy' },
  { label: 'Java', value: 'java' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'LaTeX', value: 'latex' },
  { label: 'Less', value: 'less' },
  { label: 'Lua', value: 'lua' },
  { label: 'Makefile', value: 'makefile' },
  { label: 'Markup', value: 'markup' },
  { label: 'MATLAB', value: 'matlab' },
  { label: 'Mermaid', value: 'mermaid' },
  { label: 'Objective-C', value: 'objectivec' },
  { label: 'Perl', value: 'perl' },
  { label: 'PHP', value: 'php' },
  { label: 'PowerShell', value: 'powershell' },
  { label: '.properties', value: 'properties' },
  { label: 'Protocol Buffers', value: 'protobuf' },
  { label: 'Python', value: 'python' },
  { label: 'R', value: 'r' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Sass (Sass)', value: 'sass' },
  // FIXME: Error with current scala grammar
  { label: 'Scala', value: 'scala' },
  { label: 'Scheme', value: 'scheme' },
  { label: 'Sass (Scss)', value: 'scss' },
  { label: 'Shell', value: 'shell' },
  { label: 'Swift', value: 'swift' },
  { label: 'XML', value: 'xml' },
  { label: 'YAML', value: 'yaml' }
]

export function CodeBlockCombobox() {
  const state = useCodeBlockComboboxState()
  const { commandItemProps } = useCodeBlockCombobox(state)

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  if (state.readOnly) return null

  const items = languages.filter(
    (language) =>
      !value ||
      language.label.toLowerCase().includes(value.toLowerCase()) ||
      language.value.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size='xs'
          variant='ghost'
          className='h-5 justify-between px-1 text-xs'
          aria-expanded={open}
          role='combobox'
        >
          {state.value ? languages.find((language) => language.value === state.value)?.label : 'Plain Text'}
          <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command shouldFilter={false}>
          <CommandInput value={value} onValueChange={(value) => setValue(value)} placeholder='Search language...' />
          <CommandEmpty>No language found.</CommandEmpty>

          <CommandList>
            {items.map((language) => (
              <CommandItem
                key={language.value}
                className='cursor-pointer'
                value={language.value}
                onSelect={(_value) => {
                  commandItemProps.onSelect(_value)
                  setOpen(false)
                }}
              >
                <Check className={cn(state.value === language.value ? 'opacity-100' : 'opacity-0')} />
                {language.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
