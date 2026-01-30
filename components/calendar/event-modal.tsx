'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { CalendarEvent, ContentType } from '@/lib/types'
import { formatDate } from '@/lib/calendar-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event?: CalendarEvent | null
  selectedDate?: Date | null
  contentTypes: ContentType[]
  onSave: (data: {
    id?: string
    title: string
    description: string
    event_date: string
    content_type_id: string
    is_completed: boolean
  }) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export function EventModal({
  isOpen,
  onClose,
  event,
  selectedDate,
  contentTypes,
  onSave,
  onDelete
}: EventModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [contentTypeId, setContentTypeId] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description || '')
      setEventDate(event.event_date)
      setContentTypeId(event.content_type_id || '')
      setIsCompleted(event.is_completed || false)
    } else if (selectedDate) {
      setTitle('')
      setDescription('')
      setEventDate(formatDate(selectedDate))
      setContentTypeId(contentTypes[0]?.id || '')
      setIsCompleted(false)
    } else {
      setTitle('')
      setDescription('')
      setEventDate(formatDate(new Date()))
      setContentTypeId(contentTypes[0]?.id || '')
      setIsCompleted(false)
    }
  }, [event, selectedDate, contentTypes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !eventDate || !contentTypeId) return

    setIsLoading(true)
    try {
      await onSave({
        id: event?.id,
        title: title.trim(),
        description: description.trim(),
        event_date: eventDate,
        content_type_id: contentTypeId,
        is_completed: isCompleted
      })
      onClose()
    } catch (error) {
      console.error('Failed to save event:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!event?.id || !onDelete) return
    
    setIsLoading(true)
    try {
      await onDelete(event.id)
      onClose()
    } catch (error) {
      console.error('Failed to delete event:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select value={contentTypeId} onValueChange={setContentTypeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map(ct => (
                    <SelectItem key={ct.id} value={ct.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: ct.color }}
                        />
                        {ct.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="is-completed"
                checked={isCompleted}
                onCheckedChange={(checked) => setIsCompleted(checked === true)}
              />
              <Label 
                htmlFor="is-completed" 
                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mark as completed
              </Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            {event && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
