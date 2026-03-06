'use client'

import React, { HTMLAttributes, InputHTMLAttributes, useState } from 'react'
import { Label } from '../../label'
import { cn } from '../../../lib/utils'
import { Input, InputWrapper } from '../../input'
import { Small } from '../../typography'

interface TextInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string
  placeholder?: string
  defaultValue?: string
  value?: string
  disable?: boolean
  onChange?: (value: string) => void
  prefix?: string
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue'>
}

export const TextInput = React.forwardRef<HTMLDivElement, TextInputProps>(
  (
    {
      label,
      placeholder,
      defaultValue,
      value: controlledValue,
      onChange,
      disable,
      inputProps,
      className,
      prefix,
      ...rest
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string>(defaultValue ?? '')

    const value = controlledValue ?? internalValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value)
      onChange?.(e.target.value)
    }

    return (
      <div ref={ref} className={cn('flex flex-col gap-2.5 mx-0.5', className)} {...rest}>
        {label && (
          <Label>
            {label}
          </Label>
        )}

        <InputWrapper
          className={cn(
            'min-h-11 w-full focus-visible:outline-0 border-border-input text-sm has-focus-visible:border-blue-300 has-focus-visible:ring has-focus-visible:ring-blue-300',
          )}
          
        >
          {prefix && <Small>{prefix}</Small>}
          <Input
            {...inputProps}
            value={value}
            placeholder={placeholder}
            disabled={ disable}
            onChange={handleChange}
            className='font-medium'
          />
        </InputWrapper>
      </div>
    )
  }
)

TextInput.displayName = 'TextInput'

export default TextInput