'use client'

import { ContentType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'

interface CalendarLegendProps {
  contentTypes: ContentType[]
  onAddNote?: () => void
  onEditNote?: (note: ContentType) => void
  onDeleteNote?: (id: string) => void
}

export function CalendarLegend({
  contentTypes,
  onAddNote,
  onEditNote,
  onDeleteNote,
}: CalendarLegendProps) {
  const canManage = onAddNote ?? onEditNote ?? onDeleteNote

  return (
    <div className="border-t border-border pt-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Notes
        </h3>
        {onAddNote && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddNote}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add note
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {contentTypes.map((ct) => (
          <div
            key={ct.id}
            className="flex items-center gap-2 group"
          >
            <div
              className="w-4 h-4 rounded shrink-0"
              style={{ backgroundColor: ct.color }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: ct.color }}
            >
              {ct.name}
            </span>
            {canManage && (onEditNote || onDeleteNote) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Note actions"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {onEditNote && (
                    <DropdownMenuItem onClick={() => onEditNote(ct)}>
                      <Pencil className="h-3.5 w-3.5 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDeleteNote && (
                    <DropdownMenuItem
                      onClick={() => onDeleteNote(ct.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
