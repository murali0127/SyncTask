// EXECUTES TOOL CALL
{/** PerForms Tool function- Returns structred results */ }


export default async function executeTools(toolName, input, supabase, userId) {
      switch (toolName) {
            case "get_todos": {
                  let query = supabase
                        .from("todos")
                        .select("id, title, description, priority, completed, due_date, list_id, reminder_minutes_before, created_at")
                        .eq("user_id", userId)
                        .order("created_at", { ascending: false });

                  if (input.list_id !== undefined) query = query.eq("list_id", input.list_id);
                  if (input.completed !== undefined) query = query.eq("completed", input.completed);

                  const { data, error } = await query;
                  return error ? { error: error.message } : { todos: data };
            }

            case "get_lists": {
                  const { data, error } = await supabase
                        .from("list")
                        .select("id, list_title, color, icon, list_description")
                        .eq("user_id", userId)
                        .order("created_at", { ascending: true });

                  return error ? { error: error.message } : { lists: data };
            }

            case "create_todo": {
                  const payload = {
                        user_id: userId,
                        title: input.title,
                        description: input.description ?? null,
                        list_id: input.list_id,
                        priority: input.priority ?? "medium",
                        due_date: input.due_date ?? null,
                        completed: false,
                        reminder_minutes_before: input.reminder_minutes_before ?? null,
                        reminder_sent: false,
                  };

                  const { data, error } = await supabase
                        .from("todos")
                        .insert(payload)
                        .select()
                  // .single();

                  return error ? { error: error.message } : { created: data };
            }

            case "update_todo": {
                  const { id, ...updates } = input;

                  // If due_date or reminder changes, reset reminder_sent
                  const reminderChanged = "due_date" in updates || "reminder_minutes_before" in updates;
                  if (reminderChanged) {
                        updates.reminder_sent = false;
                        updates.reminder_sent_at = null;
                  }

                  updates.updated_at = new Date().toISOString();

                  const { data, error } = await supabase
                        .from("todos")
                        .update(updates)
                        .eq("id", id)
                        .eq("user_id", userId)   // ownership enforced at query level too
                        .select()
                  // .single();

                  return error ? { error: error.message } : { updated: data };
            }

            case "delete_todo": {
                  const { error } = await supabase
                        .from("todos")
                        .delete()
                        .eq("id", input.id)
                        .eq("user_id", userId);

                  return error ? { error: error.message } : { deleted: true, id: input.id };
            }

            case "create_list": {
                  const { data, error } = await supabase
                        .from("list")
                        .insert({
                              list_title: input.list_title,
                              color: input.color ?? "#6366f1",
                              icon: input.icon ?? "📋",
                              list_description: input.list_description ?? null,
                              user_id: userId,
                        })
                        .select()
                  // .single();

                  return error ? { error: error.message } : { created: data };
            }

            case "delete_list": {
                  // Delete all todos in list first (in case FK cascade isn't set)
                  await supabase
                        .from("todos")
                        .delete()
                        .eq("list_id", input.id)
                        .eq("user_id", userId);

                  const { error } = await supabase
                        .from("list")
                        .delete()
                        .eq("id", input.id)
                        .eq("user_id", userId);

                  return error ? { error: error.message } : { deleted: true, id: input.id };
            }



            default:
                  return { error: `Unknown Tool : ${toolName}` }
      }
}