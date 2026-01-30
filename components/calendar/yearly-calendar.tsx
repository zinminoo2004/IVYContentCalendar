'use client'

import { CalendarEvent, ContentType } from '@/lib/types'
import { getCalendarDays, formatDate, getShortMonthName } from '@/lib/calendar-utils'
import { cn } from '@/lib/utils'

interface YearlyCalendarProps {
  year: number
  events: CalendarEvent[]
  contentTypes: ContentType[]
  onMonthClick: (month: number) => void
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function YearlyCalendar({
  year,
  events,
  contentTypes,
  onMonthClick
}: YearlyCalendarProps) {
  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return events.filter(event => event.event_date === dateStr)
  }

  const getContentTypeColor = (contentTypeId: string | null) => {
    if (!contentTypeId) return '#1a1a1a'
    const contentType = contentTypes.find(ct => ct.id === contentTypeId)
    return contentType?.color || '#1a1a1a'
  }

  const months = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {months.map(month => {
        const days = getCalendarDays(year, month)
        return (
          <div
            key={month}
            className="border border-border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onMonthClick(month)}
          >
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              {getShortMonthName(month)}
            </h3>
            
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((day, i) => (
                <div
                  key={i}
                  className="text-center text-xs text-muted-foreground font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar mini grid */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {days.slice(0, 42).map((day, index) => {
                const dayEvents = getEventsForDate(day.date)
                const hasEvents = dayEvents.length > 0
                const firstEventColor = hasEvents 
                  ? getContentTypeColor(dayEvents[0].content_type_id)
                  : undefined

                return (
                  <div
                    key={index}
                    className={cn(
                      'relative text-center text-xs py-0.5',
                      !day.isCurrentMonth && 'text-muted-foreground/50',
                      day.isToday && 'font-bold text-primary'
                    )}
                  >
                    <span>{day.date.getDate()}</span>
                    {hasEvents && (
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ backgroundColor: firstEventColor }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
