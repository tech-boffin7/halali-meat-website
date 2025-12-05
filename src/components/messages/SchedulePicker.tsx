'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { addDays, addHours, format, setHours, setMinutes } from 'date-fns';
import { Clock } from 'lucide-react';
import { useState } from 'react';

interface SchedulePickerProps {
  onSchedule: (date: Date) => void;
  children?: React.ReactNode;
}

export function SchedulePicker({ onSchedule, children }: SchedulePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(addHours(new Date(), 1));

  const quickOptions = [
    { label: 'In 1 hour', getValue: () => addHours(new Date(), 1) },
    { label: 'In 3 hours', getValue: () => addHours(new Date(), 3) },
    { label: 'Tomorrow at 9 AM', getValue: () => setHours(setMinutes(addDays(new Date(), 1), 0), 9) },
    { label: 'Tomorrow at 2 PM', getValue: () => setHours(setMinutes(addDays(new Date(), 1), 0), 14) },
    { label: 'Next Monday at 9 AM', getValue: () => {
      const nextMonday = new Date();
      nextMonday.setDate(nextMonday.getDate() + (((1 + 7 - nextMonday.getDay()) % 7) || 7));
      return setHours(setMinutes(nextMonday, 0), 9);
    }},
  ];

  const handleSchedule = () => {
    if (selectedDate > new Date()) {
      onSchedule(selectedDate);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" type="button">
            <Clock className="h-4 w-4 mr-2" />
            Schedule Send
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-20px)] sm:w-full sm:max-w-md rounded-[10px]">
        <DialogHeader>
          <DialogTitle>Schedule Message</DialogTitle>
          <DialogDescription>
            Choose when to send this message
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Options */}
          <div>
            <label className="text-sm font-medium mb-2 block">Quick Options</label>
            <div className="grid grid-cols-2 gap-2">
              {quickOptions.map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(option.getValue())}
                  className={selectedDate.getTime() === option.getValue().getTime() ? 'border-primary' : ''}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Date/Time */}
          <div>
            <label className="text-sm font-medium mb-2 block">Custom Date & Time</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-md"
              value={format(selectedDate, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            />
          </div>

          {/* Preview */}
          <div className="p-3 bg-muted rounded-md">
            <div className="text-sm font-medium mb-1">Scheduled for:</div>
            <div className="text-sm text-muted-foreground">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {format(selectedDate, 'h:mm a')}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSchedule}>
              Schedule Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
