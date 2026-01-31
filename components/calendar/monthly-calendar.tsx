'use client'

import { Check } from 'lucide-react'
import { CalendarEvent, ContentType } from '@/lib/types'
import { getCalendarDays, formatDate } from '@/lib/calendar-utils'
import { cn } from '@/lib/utils'

interface MonthlyCalendarProps {
  year: number
  month: number
  events: CalendarEvent[]
  contentTypes: ContentType[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  onShowMoreClick?: (date: Date) => void
}

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export function MonthlyCalendar({
  year,
  month,
  events,
  contentTypes,
  onDateClick,
  onEventClick,
  onShowMoreClick,
}: MonthlyCalendarProps) {
  const days = getCalendarDays(year, month)

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return events.filter(event => event.event_date === dateStr)
  }

  const getContentTypeColor = (contentTypeId: string | null) => {
    if (!contentTypeId) return '#1a1a1a'
    const contentType = contentTypes.find(ct => ct.id === contentTypeId)
    return contentType?.color || '#1a1a1a'
  }

  return (
    <div className="w-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS.map(day => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.date)
          return (
            <div
              key={index}
              onClick={() => onDateClick(day.date)}
              className={cn(
                'min-h-[120px] border-b border-r border-border p-2 cursor-pointer transition-colors hover:bg-muted/50',
                !day.isCurrentMonth && 'bg-muted/30',
                index % 7 === 0 && 'border-l'
              )}
            >
              <div
                className={cn(
                  'text-sm font-medium mb-1',
                  !day.isCurrentMonth && 'text-muted-foreground',
                  day.isToday && 'text-primary font-bold'
                )}
              >
                {day.date.getDate().toString().padStart(2, '0')}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                    className={cn(
                      "flex items-center gap-1.5 text-xs cursor-pointer hover:opacity-70 transition-opacity",
                      event.is_completed && "opacity-60"
                    )}
                  >
                    {event.is_completed ? (
                      <div className="w-4 h-4 rounded-full shrink-0 bg-green-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    ) : (
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: getContentTypeColor(event.content_type_id) }}
                      />
                    )}
                    <span className={cn(
                      "truncate text-foreground",
                      event.is_completed && "line-through"
                    )}>{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onShowMoreClick
                        ? onShowMoreClick(day.date)
                        : onDateClick(day.date)
                    }}
                    className="w-full min-h-[44px] py-2 -mx-1 mt-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded cursor-pointer touch-manipulation transition-colors text-left"
                  >
                    +{dayEvents.length - 3} more
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
