export type DayMode = 'am' | 'day' | 'pm' | 'done';

export type TimeOfDay = 'morning' | 'midday' | 'evening' | 'night';

export interface Day {
  id: string;
  user_id: string;
  date: string;
  committed: boolean;
  finalized: boolean;
  reflection: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  day_id: string;
  user_id: string;
  position: 1 | 2 | 3;
  title: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface HazeItem {
  id: string;
  user_id: string;
  text: string;
  archived: boolean;
  created_at: string;
}

export interface DaySummary {
  date: string;
  committed: boolean;
  finalized: boolean;
  tasks: Task[];
  reflection: string | null;
  completedCount: number;
}
