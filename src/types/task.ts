export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string YYYY-MM-DD
  time?: string; // HH:MM format
  completed: boolean;
  createdAt: string;
}

export type ViewMode = 'calendar' | 'list' | 'split';
