import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { Check, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  showDate?: boolean;
}

export function TaskItem({ task, onToggle, onDelete, showDate = false }: TaskItemProps) {
  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
        "bg-surface hover:bg-surface-hover",
        "animate-fade-in"
      )}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 transition-all duration-200",
          "flex items-center justify-center",
          task.completed
            ? "bg-task-complete border-task-complete"
            : "border-muted-foreground/50 hover:border-primary"
        )}
      >
        {task.completed && (
          <Check className="w-3 h-3 text-background animate-check-bounce" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium transition-all duration-200",
            task.completed && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </p>
        
        {task.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2">
          {showDate && (
            <span className="text-xs text-muted-foreground">
              {format(new Date(task.date), 'MMM d')}
            </span>
          )}
          {task.time && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {task.time}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className={cn(
          "flex-shrink-0 p-1.5 rounded-md transition-all duration-200",
          "opacity-0 group-hover:opacity-100",
          "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        )}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
