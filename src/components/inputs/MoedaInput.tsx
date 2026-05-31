import type { InputHTMLAttributes } from 'react'
import { mascaraMoeda } from '../../utils/formatoBr'

interface MoedaInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: string
  onValueChange: (value: string) => void
}

export function MoedaInput({ value, onValueChange, ...rest }: MoedaInputProps) {
  return (
    <input
      type="text"
      inputMode="decimal"
      placeholder="R$0,00"
      value={value}
      onChange={(e) => onValueChange(mascaraMoeda(e.target.value))}
      {...rest}
    />
  )
}
