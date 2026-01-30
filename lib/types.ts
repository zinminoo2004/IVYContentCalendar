export interface ContentType {
  id: string
  name: string
  color: string
  created_at: string
}

export interface CalendarEvent {
  id: string
  title: string
  description: string | null
  event_date: string
  content_type_id: string | null
  content_type?: ContentType
  is_completed: boolean
  created_at: string
  updated_at: string
}

export type ViewMode = 'monthly' | 'yearly'
