import { ChevronDown } from 'lucide-react'

export default function Field({ label, value, icon, onChange, type = 'text' }) {
  return (
    <label className="block text-[9px] uppercase tracking-wide text-[#b6b6b6]">
      {label}
      <span className="mt-1.5 flex h-10 items-center gap-2 rounded-lg border border-[#e3e3e3] bg-[#fafafa] px-3 text-[12px] normal-case tracking-normal text-[#6c6c6c] transition-colors focus-within:border-[#8a8a8a]">
        {icon}
        {onChange ? (
          <input
            className="min-w-0 w-full bg-transparent outline-none"
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <span className="min-w-0 truncate">{value}</span>
        )}
        {label === 'Project type' ? <ChevronDown className="ml-auto shrink-0" size={14} /> : null}
      </span>
    </label>
  )
}
