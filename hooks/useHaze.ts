import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { HazeItem } from '../types';

export function useHaze() {
  const { session } = useAuth();
  const [items, setItems] = useState<HazeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!session) return;
    setLoading(true);

    const { data } = await supabase
      .from('haze_items')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    setItems(data ?? []);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(async (text: string) => {
    if (!session) return;

    const { data, error } = await supabase
      .from('haze_items')
      .insert({ user_id: session.user.id, text })
      .select()
      .single();

    if (!error && data) {
      setItems(prev => [data, ...prev]);
    }
  }, [session]);

  const archiveItem = useCallback(async (id: string) => {
    // Optimistic update
    setItems(prev => prev.filter(item => item.id !== id));

    const { error } = await supabase
      .from('haze_items')
      .update({ archived: true })
      .eq('id', id);

    if (error) {
      fetchItems();
    }
  }, [fetchItems]);

  return { items, loading, addItem, archiveItem, refetch: fetchItems };
}
