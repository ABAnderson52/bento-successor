import React from 'react'

interface Option<T> {
  label: string
  value: T
  icon?: React.ReactNode
}

interface WidgetButtonGroupProps<T> {
  options: Option<T>[]
  activeValue: T
  onChange: (value: T) => void
  columns?: number
}

export function WidgetButtonGroup<T extends string | number | undefined>({ 
  options, 
  activeValue, 
  onChange, 
  columns = 3 
}: WidgetButtonGroupProps<T>) {
  return (
    <div 
      className="grid gap-2" 
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((option) => (
        <button
          key={String(option.value)}
          onClick={() => onChange(option.value)}
          className={`p-3 rounded-xl border-2 transition-all text-xs font-bold flex flex-col items-center gap-2 ${
            activeValue === option.value
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md'
              : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 text-zinc-500'
          }`}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  )
}