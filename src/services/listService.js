import { supabase } from '../lib/supabase-client.jsx';

const LIST_TABLE_CANDIDATES = ['list', 'lists'];

async function runAgainstListTable(operation) {
      let lastError = null;

      for (const table of LIST_TABLE_CANDIDATES) {
            const { data, error } = await operation(table);
            if (!error) {
                  return { data, error: null, table };
            }

            lastError = error;
            // Try next candidate only when relation/table name is wrong.
            if (error?.code !== '42P01') {
                  break;
            }
      }

      return { data: null, error: lastError, table: null };
}

function formatSupabaseError(error, fallbackMessage) {
      if (!error) return fallbackMessage;
      return error.message || error.details || error.hint || fallbackMessage;
}

export const listService = {
      async fetchLists(userId) {
            const { data, error, table } = await runAgainstListTable((listTable) => {
                  let query = supabase
                        .from(listTable)
                        .select('*')
                        .eq('user_id', userId)
                        .order('created_at', { ascending: true });

                  if (userId) {
                        query = query.eq('user_id', userId);
                  }

                  return query;
            });
            if (error) {
                  throw error;
            }
            return { data: data || [], table };
      },

      async createList({ title, icon, color, user_id }) {
            const payload = { list_title: title, icon: icon || '📋', color, user_id };

            let lastError = null;
            const { data, error } = await runAgainstListTable((listTable) =>
                  supabase.from(listTable)
                        .insert(payload)
                        .select()
                        .single()
            );
            if (!error) return data;
            lastError = error;


            throw new Error(formatSupabaseError(lastError, 'Failed to create list.'));
      },
      async updateList(id, updates, user_id) {
            const { data, error } = await runAgainstListTable((listTable) =>
                  supabase
                        .from(listTable)
                        .update(updates)
                        .eq('id', id)
                        .eq('user_id', user_id)
                        .select()
                        .single()
            );
            if (error) {
                  throw error;
            }
            return data;
      },
      async deleteList(id) {
            const { error } = await runAgainstListTable((listTable) =>
                  supabase
                        .from(listTable)
                        .delete()
                        .eq('id', id)
            );
            if (error) {
                  throw error;
            }
            return { error: null };
      }
}