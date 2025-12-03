import { ViewMode } from '@/types/task';
import { cn } from '@/lib/utils';
import { Calendar, List, LayoutGrid } from 'lucide-react';

interface ViewToggleProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

const views: { value: ViewMode; icon: typeof Calendar; label: string }[] = [
  { value: 'calendar', icon: Calendar, label: 'Calendar' },
  { value: 'list', icon: List, label: 'List' },
  { value: 'split', icon: LayoutGrid, label: 'Split' },
];

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-surface rounded-lg">
      {views.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
            view === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
          )}
          title={label}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
