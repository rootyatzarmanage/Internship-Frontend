import type { SelectHTMLAttributes } from 'react'

type DropdownSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  containerClassName?: string
  iconClassName?: string
  selectPaddingClassName?: string
}

export default function DropdownSelect({
  className = '',
  containerClassName = '',
  iconClassName = 'right-6 h-5 w-5',
  selectPaddingClassName = 'pr-12',
  children,
  ...props
}: DropdownSelectProps) {
  return (
    <div className={`relative min-w-0 ${containerClassName}`}>
      <select {...props} className={`${className} appearance-none ${selectPaddingClassName}`}>
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-white ${iconClassName}`}
      >
        <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
