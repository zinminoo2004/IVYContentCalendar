'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getMonthName } from '@/lib/calendar-utils'
import { ViewMode } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CalendarHeaderProps {
  year: number
  month: number
  viewMode: ViewMode
  onPrevious: () => void
  onNext: () => void
  onViewModeChange: (mode: ViewMode) => void
  onToday: () => void
  onYearChange: (year: number) => void
}

// Generate year options (10 years before and after current year)
function getYearOptions(currentYear: number): number[] {
  const years: number[] = []
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push(i)
  }
  return years
}

export function CalendarHeader({
  year,
  month,
  viewMode,
  onPrevious,
  onNext,
  onViewModeChange,
  onToday,
  onYearChange,
}: CalendarHeaderProps) {
  const monthName = getMonthName(month).toUpperCase()
  const yearOptions = getYearOptions(new Date().getFullYear())

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Image
          src="/images/company-logo.jpg"
          alt="IVY Skincare & Cosmetics"
          width={56}
          height={56}
          className="rounded-full object-cover border-2 border-pink-200 shadow-sm"
        />
        <div className="flex items-center gap-2">
          {viewMode === 'monthly' && (
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {monthName}
            </h1>
          )}
          <Select
            value={year.toString()}
            onValueChange={(value) => onYearChange(Number(value))}
          >
            <SelectTrigger className="w-[120px] text-2xl sm:text-3xl font-bold border-none shadow-none h-auto p-0 focus:ring-0">
              <SelectValue>{year}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
        >
          Today
        </Button>
        
        <div className="flex items-center border border-border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            className="rounded-r-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            className="rounded-l-none"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center border border-border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange('monthly')}
            className={cn(
              'rounded-r-none',
              viewMode === 'monthly' && 'bg-muted'
            )}
          >
            Month
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange('yearly')}
            className={cn(
              'rounded-l-none',
              viewMode === 'yearly' && 'bg-muted'
            )}
          >
            Year
          </Button>
        </div>
      </div>
    </div>
  )
}
