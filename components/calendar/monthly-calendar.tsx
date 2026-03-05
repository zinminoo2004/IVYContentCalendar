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
      {/* Calendar: 1 col on mobile, 7 cols on desktop. Only this month's days (1 to end), no empty cells. */}
      <div className="grid grid-cols-1 md:grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.date)
          const weekDay = DAYS[day.date.getDay()]
          return (
            <div
              key={index}
              onClick={() => onDateClick(day.date)}
              className={cn(
                'min-h-[100px] md:min-h-[160px] border-b border-border p-3 md:p-3 cursor-pointer transition-colors hover:bg-muted/50',
                'md:border-r',
                index % 7 === 0 && 'md:border-l'
              )}
            >
              {/* Date with weekday: e.g. "SUN 01" */}
              <div
                className={cn(
                  'text-sm font-medium mb-2 md:mb-1',
                  day.isToday && 'text-primary font-bold'
                )}
              >
                {weekDay} {day.date.getDate().toString().padStart(2, '0')}
              </div>
              <div className="space-y-2 md:space-y-2">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                    className={cn(
                      'flex items-start gap-2 md:gap-2 text-sm cursor-pointer hover:opacity-70 transition-opacity min-h-[44px] md:min-h-0',
                      event.is_completed && 'opacity-60'
                    )}
                  >
                    {event.is_completed ? (
                      <div className="w-5 h-5 md:w-3.5 md:h-3.5 rounded-full shrink-0 bg-green-500 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 md:w-2.5 md:h-2.5 text-white" />
                      </div>
                    ) : (
                      <div
                        className="w-3 h-3 md:w-2.5 md:h-2.5 rounded-full shrink-0 mt-1 md:mt-1.5"
                        style={{ backgroundColor: getContentTypeColor(event.content_type_id) }}
                      />
                    )}
                    <span className={cn(
                      'flex-1 min-w-0 break-words text-foreground leading-snug',
                      event.is_completed && 'line-through'
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
                    className="w-full min-h-[48px] md:min-h-[44px] py-2.5 md:py-2 -mx-1 mt-1 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded cursor-pointer touch-manipulation transition-colors text-left"
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
