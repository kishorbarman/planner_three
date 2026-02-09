import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { DaySummary } from '../types';

export function useHistory() {
  const { session } = useAuth();
  const [days, setDays] = useState<DaySummary[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMonth = useCallback(async (year: number, month: number) => {
    if (!session) return;
    setLoading(true);

    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

    const { data: dayRows } = await supabase
      .from('days')
      .select('*, tasks(*)')
      .eq('user_id', session.user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .order('position', { ascending: true, referencedTable: 'tasks' });

    const summaries: DaySummary[] = (dayRows ?? []).map(row => ({
      date: row.date,
      committed: row.committed,
      finalized: row.finalized,
      tasks: row.tasks ?? [],
      reflection: row.reflection,
      completedCount: (row.tasks ?? []).filter((t: { completed: boolean }) => t.completed).length,
    }));

    setDays(summaries);
    setLoading(false);
  }, [session]);

  return { days, loading, fetchMonth };
}
