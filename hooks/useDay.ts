import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { getTodayString } from '../lib/date';
import { Day, Task, DayMode } from '../types';
import { MAX_TASKS } from '../constants/config';

export function useDay() {
  const { session } = useAuth();
  const [day, setDay] = useState<Day | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReflecting, setIsReflecting] = useState(false);

  const today = getTodayString();

  const mode: DayMode = (() => {
    if (!day || !day.committed) return 'am';
    if (day.finalized) return 'done';
    if (isReflecting) return 'pm';
    return 'day';
  })();

  const nonEmptyTasks = tasks.filter(t => t.title !== '');
  const allCompleted = nonEmptyTasks.length > 0 && nonEmptyTasks.every(t => t.completed);

  const fetchDay = useCallback(async () => {
    if (!session) return;
    setLoading(true);

    const { data: dayData } = await supabase
      .from('days')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('date', today)
      .single();

    if (dayData) {
      setDay(dayData);
      if (dayData.finalized) setIsReflecting(false);

      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .eq('day_id', dayData.id)
        .order('position', { ascending: true });

      setTasks(taskData ?? []);
    } else {
      setDay(null);
      setTasks([]);
    }

    setLoading(false);
  }, [session, today]);

  useEffect(() => {
    fetchDay();
  }, [fetchDay]);

  const commitTasks = useCallback(async (titles: string[]) => {
    if (!session || titles.length !== MAX_TASKS) return;

    const { data: newDay, error: dayError } = await supabase
      .from('days')
      .insert({
        user_id: session.user.id,
        date: today,
        committed: true,
      })
      .select()
      .single();

    if (dayError || !newDay) throw dayError;

    const taskRows = titles.map((title, i) => ({
      day_id: newDay.id,
      user_id: session.user.id,
      position: (i + 1) as 1 | 2 | 3,
      title,
    }));

    const { data: newTasks, error: taskError } = await supabase
      .from('tasks')
      .insert(taskRows)
      .select();

    if (taskError) throw taskError;

    setDay(newDay);
    setTasks(newTasks ?? []);
  }, [session, today]);

  const toggleTaskComplete = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;
    const completedAt = newCompleted ? new Date().toISOString() : null;

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, completed: newCompleted, completed_at: completedAt } : t
      )
    );

    const { error } = await supabase
      .from('tasks')
      .update({ completed: newCompleted, completed_at: completedAt })
      .eq('id', taskId);

    if (error) {
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId ? { ...t, completed: task.completed, completed_at: task.completed_at } : t
        )
      );
    }
  }, [tasks]);

  const editTask = useCallback(async (taskId: string, newTitle: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, title: newTitle } : t));

    const { error } = await supabase
      .from('tasks')
      .update({ title: newTitle })
      .eq('id', taskId);

    if (error) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, title: task.title } : t));
    }
  }, [tasks]);

  const resetTask = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const oldTasks = tasks;

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, title: '', completed: false, completed_at: null } : t
      )
    );

    const { error } = await supabase
      .from('tasks')
      .update({ title: '', completed: false, completed_at: null })
      .eq('id', taskId);

    if (error) {
      setTasks(oldTasks);
    }
  }, [tasks]);

  const beginReflection = useCallback(() => {
    setIsReflecting(true);
  }, []);

  const saveReflection = useCallback(async (text: string) => {
    if (!day) return;

    const { error } = await supabase
      .from('days')
      .update({ reflection: text })
      .eq('id', day.id);

    if (!error) {
      setDay(prev => prev ? { ...prev, reflection: text } : null);
    }
  }, [day]);

  const finalizeDay = useCallback(async (reflection: string) => {
    if (!day) return;

    const { data, error } = await supabase
      .from('days')
      .update({ reflection, finalized: true })
      .eq('id', day.id)
      .select()
      .single();

    if (!error && data) {
      setDay(data);
      setIsReflecting(false);
    }
  }, [day]);

  return {
    day,
    tasks,
    mode,
    loading,
    allCompleted,
    commitTasks,
    toggleTaskComplete,
    editTask,
    resetTask,
    beginReflection,
    saveReflection,
    finalizeDay,
    refetch: fetchDay,
  };
}
