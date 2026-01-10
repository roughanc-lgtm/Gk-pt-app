
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  videoUrl?: string;
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface SetResult {
  weight: string;
  reps: string;
  completed: boolean;
}

export interface ExerciseResult {
  exerciseId: string;
  exerciseName: string;
  sets: SetResult[];
  videoUrl?: string;
}

export interface WorkoutSession {
  id: string;
  routineId: string;
  routineName: string;
  date: number;
  results: ExerciseResult[];
}

export type View = 'dashboard' | 'workout' | 'history' | 'import';
