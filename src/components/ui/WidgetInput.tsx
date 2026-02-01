import React from 'react'

interface WidgetInputProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (val: string) => void
  type?: 'text' | 'textarea' | 'url'
  className?: string
}

export function WidgetInput({ 
  placeholder, 
  value, 
  onChange, 
  type = 'text',
  className = ''
}: WidgetInputProps) {
  const baseStyles = "w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-500 outline-none transition-all font-medium text-sm shadow-sm"
  
  if (type === 'textarea') {
    return (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseStyles} h-32 resize-none leading-relaxed ${className}`}
      />
    )
  }

  return (
    <input
      type={type === 'url' ? 'text' : 'text'}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${baseStyles} ${type === 'url' ? 'font-mono text-xs' : ''} ${className}`}
    />
  )
}