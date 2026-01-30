'use client'

import { ContentType } from '@/lib/types'

interface CalendarLegendProps {
  contentTypes: ContentType[]
}

export function CalendarLegend({ contentTypes }: CalendarLegendProps) {
  return (
    <div className="border-t border-border pt-6 mt-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
        Notes
      </h3>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {contentTypes.map(ct => (
          <div key={ct.id} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: ct.color }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: ct.color }}
            >
              {ct.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
