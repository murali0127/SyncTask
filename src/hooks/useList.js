import { useState, useEffect, useCallback } from "react";
import { supabase } from '../lib/supabase-client.jsx';
import { listService } from "../services/listService";


export function useList() {
      const [lists, setLists] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const fetchLists = useCallback(async () => {
            try {
                  setLoading(true);
                  setError(null);
                  const data = await listService.fetchLists();
                  setLists(data);
            } catch (err) {
                  setError(err.message);
            } finally {
                  setLoading(false);
            }
      }, []);

      // Realtime subscription — mirrors the pattern from your TodoContext
      useEffect(() => {
            fetchLists();

            const channel = supabase
                  .channel('list-changes')
                  .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'list' },
                        () => fetchLists() // re-fetch on any change
                  )
                  .subscribe();

            return () => supabase.removeChannel(channel);
      }, [fetchLists]);

      const createList = async (payload) => {
            const newList = await listService.createList(payload);
            setLists((prev) => [...prev, newList]); // optimistic update
            return newList;
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