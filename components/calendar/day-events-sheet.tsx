'use client'

import { Check } from 'lucide-react'
import { CalendarEvent, ContentType } from '@/lib/types'
import { formatDate } from '@/lib/calendar-utils'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface DayEventsSheetProps {
  isOpen: boolean
  onClose: () => void
  date: Date | null
  events: CalendarEvent[]
  contentTypes: ContentType[]
  onEventClick: (event: CalendarEvent) => void
  onAddEvent: () => void
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function DayEventsSheet({
  isOpen,
  onClose,
  date,
  events,
  contentTypes,
  onEventClick,
  onAddEvent,
}: DayEventsSheetProps) {
  const getContentTypeColor = (contentTypeId: string | null) => {
    if (!contentTypeId) return '#1a1a1a'
    const ct = contentTypes.find((c) => c.id === contentTypeId)
    return ct?.color || '#1a1a1a'
  }

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick(event)
    onClose()
  }

  const handleAddClick = () => {
    onAddEvent()
    onClose()
  }

  if (!date) return null

  const dateStr = formatDate(date)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[70vh] flex flex-col rounded-t-xl"
      >
        <SheetHeader>
          <SheetTitle>{formatDisplayDate(date)}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 -mt-2">
          <div className="space-y-2">
            {events
              .filter((e) => e.event_date === dateStr)
              .map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => handleEventClick(event)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg border border-border text-left hover:bg-muted/50 transition-colors',
                    event.is_completed && 'opacity-70'
                  )}
                >
                  {event.is_completed ? (
                    <div className="w-5 h-5 rounded-full shrink-0 bg-green-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        backgroundColor: getContentTypeColor(event.content_type_id),
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'font-medium truncate',
                        event.is_completed && 'line-through'
                      )}
                    >
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                        {event.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <Button onClick={handleAddClick} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
