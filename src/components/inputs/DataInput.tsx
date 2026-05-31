import type { InputHTMLAttributes } from 'react'
import { mascaraData } from '../../utils/formatoBr'

interface DataInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: string
  onValueChange: (value: string) => void
}

export function DataInput({ value, onValueChange, ...rest }: DataInputProps) {
  return (
    <input
      type="text"
      inputMode="numeric"
      placeholder="dd/mm/aaaa"
      maxLength={10}
      value={value}
      onChange={(e) => onValueChange(mascaraData(e.target.value))}
      {...rest}
    />
  )
}
