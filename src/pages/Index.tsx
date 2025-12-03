import { useState } from 'react';
import { ViewMode } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { CalendarView } from '@/components/CalendarView';
import { ListView } from '@/components/ListView';
import { ViewToggle } from '@/components/ViewToggle';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const Index = () => {
  const [view, setView] = useState<ViewMode>('split');
  const [selectedDate, setSelectedDate] = useState<string | null>(format(new Date(), 'yyyy-MM-dd'));
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  const { tasks, toggleComplete, deleteTask, addTask, isLoaded } = useTasks();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">
          Unify
        </h1>
        <ViewToggle view={view} onChange={setView} />
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Calendar panel */}
        {(view === 'calendar' || view === 'split') && (
          <div
            className={cn(
              "flex-1 border-r border-border",
              view === 'split' && "hidden md:flex md:flex-col md:max-w-md lg:max-w-lg"
            )}
          >
            <CalendarView
              tasks={tasks}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        )}

        {/* List panel */}
        {(view === 'list' || view === 'split') && (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Selected date header for split view */}
            {view === 'split' && selectedDate && (
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                  {format(new Date(selectedDate), 'EEEE, MMMM d')}
                </h2>
              </div>
            )}
            
            <ListView
              tasks={tasks}
              onToggle={toggleComplete}
              onDelete={deleteTask}
              selectedDate={view === 'split' ? selectedDate : null}
            />
          </div>
        )}
      </main>

      {/* Floating add button */}
      <button
        onClick={() => setAddDialogOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full",
          "bg-primary text-primary-foreground shadow-lg",
          "flex items-center justify-center",
          "hover:bg-primary/90 hover:scale-105",
          "active:scale-95 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        )}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add task dialog */}
      <AddTaskDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={addTask}
        defaultDate={selectedDate || undefined}
      />
    </div>
  );
};

export default Index;
