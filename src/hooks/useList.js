import { useState, useEffect, useCallback } from "react";
import { supabase } from '../lib/supabase-client.jsx';
import { listService } from "../services/listService";
import { useAuth } from "../lib/context/AuthContext";


export function useList() {
      const [lists, setLists] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [listTable, setListTable] = useState('list');
      const { user } = useAuth();

      const fetchLists = useCallback(async () => {
            if (!user?.id) {
                  setLists([]);
                  setLoading(false);
                  setError(null);
                  return;
            }
            try {
                  setLoading(true);
                  setError(null);
                  const { data, table } = await listService.fetchLists(user.id);
                  setLists(data || []);
                  if (table) setListTable(table);
            } catch (err) {
                  setError(err.message);
            } finally {
                  setLoading(false);
            }
      }, [user?.id]);

      // Realtime subscription — mirrors the pattern from your TodoContext
      useEffect(() => {
            if (!user?.id) {
                  setLists([]);
                  setLoading(false);
                  setError(null);
                  return;
            }
            fetchLists();

            const channel = supabase
                  .channel('list-changes')
                  .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: listTable, filter: `user_id=eq.${user.id}` },
                        () => fetchLists() // re-fetch on any change
                  )
                  .subscribe();

            return () => supabase.removeChannel(channel);
      }, [fetchLists, user?.id, listTable]);

      const createList = async (title, icon, color, user_id) => {
            try {
                  const newList = await listService.createList(title, icon, color, user_id);
                  setLists((prev) => [...prev, newList]); // optimistic update
                  return newList;
            } catch (err) {
                  const message = err?.message || err?.details || 'Failed to create list.';
                  setError(message);
                  return { error: message };
            }
      };

      const updateList = async (id, updates) => {
            const updated = await listService.updateList(id, updates);
            setLists((prev) => prev.map((l) => (l.id === id ? updated : l)));
            return updated;
      };

      const deleteList = async (id) => {
            await listService.deleteList(id);
            setLists((prev) => prev.filter((l) => l.id !== id));
            return { success: true };
      };

      return { lists, loading, error, createList, updateList, deleteList, refetch: fetchLists };

}