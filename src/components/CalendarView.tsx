import { useState, useMemo } from 'react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday
} from 'date-fns';

interface CalendarViewProps {
  tasks: Task[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export function CalendarView({ tasks, selectedDate, onSelectDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach(task => {
      const existing = map.get(task.date) || [];
      map.set(task.date, [...existing, task]);
    });
    return map;
  }, [tasks]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map(day => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {days.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayTasks = tasksByDate.get(dateStr) || [];
          const isSelected = selectedDate === dateStr;
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const incompleteTasks = dayTasks.filter(t => !t.completed).length;

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                "relative flex flex-col items-center p-1 border-r border-b border-border transition-colors",
                "hover:bg-surface-hover",
                !isCurrentMonth && "opacity-40",
                isSelected && "bg-primary/10"
              )}
            >
              <span
                className={cn(
                  "w-7 h-7 flex items-center justify-center rounded-full text-sm transition-colors",
                  isToday(day) && "bg-primary text-primary-foreground font-semibold",
                  isSelected && !isToday(day) && "bg-surface text-foreground"
                )}
              >
                {format(day, 'd')}
              </span>
              
              {incompleteTasks > 0 && (
                <div className="flex items-center gap-0.5 mt-1">
                  {incompleteTasks <= 3 ? (
                    Array.from({ length: incompleteTasks }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
                    ))
                  ) : (
                    <span className="text-[10px] font-medium text-primary">
                      {incompleteTasks}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
