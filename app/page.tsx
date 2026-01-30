'use client'

import { useState, useEffect, useCallback } from 'react'
import useSWR, { mutate } from 'swr'
import { createClient } from '@/lib/supabase/client'
import { CalendarEvent, ContentType, ViewMode } from '@/lib/types'
import { CalendarHeader } from '@/components/calendar/calendar-header'
import { MonthlyCalendar } from '@/components/calendar/monthly-calendar'
import { YearlyCalendar } from '@/components/calendar/yearly-calendar'
import { CalendarLegend } from '@/components/calendar/calendar-legend'
import { EventModal } from '@/components/calendar/event-modal'
import { NoteModal } from '@/components/calendar/note-modal'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const supabase = createClient()

async function fetchContentTypes(): Promise<ContentType[]> {
  const { data, error } = await supabase
    .from('content_types')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

async function fetchEvents(year: number): Promise<CalendarEvent[]> {
  const startDate = `${year}-01-01`
  const endDate = `${year}-12-31`

  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .gte('event_date', startDate)
    .lte('event_date', endDate)
    .order('event_date', { ascending: true })

  if (error) throw error
  return data || []
}

export default function ContentCalendarPage() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [viewMode, setViewMode] = useState<ViewMode>('monthly')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<ContentType | null>(null)
  const [noteToDelete, setNoteToDelete] = useState<ContentType | null>(null)
  const [isDeletingNote, setIsDeletingNote] = useState(false)

  const { data: contentTypes = [], error: contentTypesError } = useSWR(
    'content_types',
    fetchContentTypes
  )

  const { data: events = [], error: eventsError } = useSWR(
    ['events', currentYear],
    () => fetchEvents(currentYear)
  )

  const handlePrevious = useCallback(() => {
    if (viewMode === 'monthly') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(prev => prev - 1)
      } else {
        setCurrentMonth(prev => prev - 1)
      }
    } else {
      setCurrentYear(prev => prev - 1)
    }
  }, [viewMode, currentMonth])

  const handleNext = useCallback(() => {
    if (viewMode === 'monthly') {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(prev => prev + 1)
      } else {
        setCurrentMonth(prev => prev + 1)
      }
    } else {
      setCurrentYear(prev => prev + 1)
    }
  }, [viewMode, currentMonth])

  const handleToday = useCallback(() => {
    const now = new Date()
    setCurrentYear(now.getFullYear())
    setCurrentMonth(now.getMonth())
  }, [])

  const handleYearChange = useCallback((year: number) => {
    setCurrentYear(year)
  }, [])

  const handleDateClick = useCallback((date: Date) => {
    setSelectedEvent(null)
    setSelectedDate(date)
    setIsModalOpen(true)
  }, [])

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedDate(null)
    setSelectedEvent(event)
    setIsModalOpen(true)
  }, [])

  const handleMonthClick = useCallback((month: number) => {
    setCurrentMonth(month)
    setViewMode('monthly')
  }, [])

  const handleSaveEvent = async (data: {
    id?: string
    title: string
    description: string
    event_date: string
    content_type_id: string
    is_completed: boolean
  }) => {
    if (data.id) {
      // Update existing event
      const { error } = await supabase
        .from('calendar_events')
        .update({
          title: data.title,
          description: data.description || null,
          event_date: data.event_date,
          content_type_id: data.content_type_id,
          is_completed: data.is_completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id)

      if (error) throw error
    } else {
      // Create new event
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          title: data.title,
          description: data.description || null,
          event_date: data.event_date,
          content_type_id: data.content_type_id,
          is_completed: data.is_completed
        })

      if (error) throw error
    }

    // Refresh events
    mutate(['events', currentYear])
  }

  const handleDeleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Refresh events
    mutate(['events', currentYear])
  }

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setSelectedDate(new Date())
    setIsModalOpen(true)
  }

  const handleAddNote = useCallback(() => {
    setSelectedNote(null)
    setIsNoteModalOpen(true)
  }, [])

  const handleEditNote = useCallback((note: ContentType) => {
    setSelectedNote(note)
    setIsNoteModalOpen(true)
  }, [])

  const handleSaveNote = async (data: {
    id?: string
    name: string
    color: string
  }) => {
    if (data.id) {
      const { error } = await supabase
        .from('content_types')
        .update({ name: data.name, color: data.color })
        .eq('id', data.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('content_types')
        .insert({ name: data.name, color: data.color })
      if (error) throw error
    }
    mutate('content_types')
    setIsNoteModalOpen(false)
    setSelectedNote(null)
  }

  const handleDeleteNote = useCallback((id: string) => {
    setNoteToDelete(contentTypes.find((ct) => ct.id === id) ?? null)
  }, [contentTypes])

  const handleConfirmDeleteNote = async () => {
    if (!noteToDelete) return
    setIsDeletingNote(true)
    try {
      const { error } = await supabase
        .from('content_types')
        .delete()
        .eq('id', noteToDelete.id)
      if (error) throw error
      mutate('content_types')
      setNoteToDelete(null)
    } finally {
      setIsDeletingNote(false)
    }
  }

  if (contentTypesError || eventsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Error loading calendar data. Please try again.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <CalendarHeader
            year={currentYear}
            month={currentMonth}
            viewMode={viewMode}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onViewModeChange={setViewMode}
            onToday={handleToday}
            onYearChange={handleYearChange}
          />
        </div>

        <div className="flex justify-end mb-4">
          <Button onClick={handleAddEvent} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {viewMode === 'monthly' ? (
            <MonthlyCalendar
              year={currentYear}
              month={currentMonth}
              events={events}
              contentTypes={contentTypes}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          ) : (
            <div className="p-6">
              <YearlyCalendar
                year={currentYear}
                events={events}
                contentTypes={contentTypes}
                onMonthClick={handleMonthClick}
              />
            </div>
          )}
        </div>

        <CalendarLegend
          contentTypes={contentTypes}
          onAddNote={handleAddNote}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />

        <NoteModal
          isOpen={isNoteModalOpen}
          onClose={() => {
            setIsNoteModalOpen(false)
            setSelectedNote(null)
          }}
          note={selectedNote}
          onSave={handleSaveNote}
          onDelete={async (id) => {
            const { error } = await supabase
              .from('content_types')
              .delete()
              .eq('id', id)
            if (error) throw error
            mutate('content_types')
            setIsNoteModalOpen(false)
            setSelectedNote(null)
          }}
        />

        <AlertDialog open={!!noteToDelete} onOpenChange={(open) => !open && setNoteToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete note?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove &quot;{noteToDelete?.name}&quot; from the legend. Events
                using this type will keep their date but will no longer show a type.
                This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                type="button"
                variant="destructive"
                onClick={() => void handleConfirmDeleteNote()}
                disabled={isDeletingNote}
              >
                {isDeletingNote ? 'Deleting...' : 'Delete'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
          selectedDate={selectedDate}
          contentTypes={contentTypes}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      </div>
    </main>
  )
}
