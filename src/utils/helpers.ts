import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(ms: number): string {
  if (ms === 0) return '0.00'
  const seconds = ms / 1000
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (minutes > 0) {
    return `${minutes}:${secs.toFixed(2).padStart(5, '0')}`
  }
  return secs.toFixed(2)
}

export function average(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

export function ao5(arr: number[]): number | null {
  if (arr.length < 5) return null
  const recent = arr.slice(0, 5)
  const sorted = [...recent].sort((a, b) => a - b)
  return average(sorted.slice(1, 4))
}

export function ao12(arr: number[]): number | null {
  if (arr.length < 12) return null
  const recent = arr.slice(0, 12)
  const sorted = [...recent].sort((a, b) => a - b)
  return average(sorted.slice(1, 11))
}
