import { useMemo } from 'react';
import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface ListViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  selectedDate: string | null;
}

interface GroupedTasks {
  label: string;
  date: string;
  tasks: Task[];
}

export function ListView({ tasks, onToggle, onDelete, selectedDate }: ListViewProps) {
  const groupedTasks = useMemo(() => {
    // If a date is selected, only show tasks for that date
    const filteredTasks = selectedDate
      ? tasks.filter(t => t.date === selectedDate)
      : tasks;

    // Sort by date, then by time
    const sorted = [...filteredTasks].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      if (b.time) return 1;
      return 0;
    });

    // Group by date
    const groups: GroupedTasks[] = [];
    let currentGroup: GroupedTasks | null = null;

    sorted.forEach(task => {
      if (!currentGroup || currentGroup.date !== task.date) {
        const taskDate = parseISO(task.date);
        let label = format(taskDate, 'EEEE, MMMM d');
        
        if (isToday(taskDate)) label = 'Today';
        else if (isTomorrow(taskDate)) label = 'Tomorrow';
        else if (isPast(taskDate)) label = `${format(taskDate, 'MMM d')} (Overdue)`;

        currentGroup = { label, date: task.date, tasks: [] };
        groups.push(currentGroup);
      }
      currentGroup.tasks.push(task);
    });

    return groups;
  }, [tasks, selectedDate]);

  const completedTasks = useMemo(() => {
    const filtered = selectedDate
      ? tasks.filter(t => t.date === selectedDate && t.completed)
      : tasks.filter(t => t.completed);
    return filtered;
  }, [tasks, selectedDate]);

  const incompleteTasks = groupedTasks.filter(g => g.tasks.some(t => !t.completed));

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">No tasks yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Click the + button to add your first task
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
      {/* Active tasks */}
      {incompleteTasks.map(group => (
        <div key={group.date} className="space-y-2">
          <h3 className={cn(
            "text-sm font-medium px-1",
            group.label.includes('Overdue') ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {group.label}
          </h3>
          <div className="space-y-2">
            {group.tasks.filter(t => !t.completed).map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground px-1">
            Completed ({completedTasks.length})
          </h3>
          <div className="space-y-2 opacity-60">
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                showDate={!selectedDate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
