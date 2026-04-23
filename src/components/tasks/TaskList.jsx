import { useState } from "react";
import TaskItems from "./TaskItems";
import AddTaskForm from "./AddTaskForm";

const FILTERS = ['All', 'Active', 'Done', 'High'];

export default function TaskList({ list, tasks, onAdd, onToggle, onDelete }) {
      const [filter, setFilter] = useState('All')

      const filtered = tasks.filter(task => {
            if (filter === 'Active') return !task.done
            if (filter === 'Done') return task.done
            if (filter === 'High') return task.priority === 'high'
            return true
      })

      const done = tasks.reduce((acc, task) => acc + (task.done ? 1 : 0), 0);
      const total = tasks.length;
      const pct = total ? Math.round((done / total) * 100) : 0

      return (
            <div className="flex flex-col flex-1 h-full overflow-hidden gap-2">
                  {/** Progress Section */}
                  <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                        <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                              <div
                                    className="h-full bg-red-400 rounded-full transition-all duration-300"
                                    style={{ width: `${pct}%` }}
                              />
                        </div>
                        <span className="text-xs text-neutral-500 whitespace-nowrap flex-shrink-0">
                              {done} of {total}
                        </span>
                  </div>

                  {/** ADD form */}
                  <div className="flex-shrink-0 mb-3">
                        <AddTaskForm
                              onAdd={onAdd}
                              curr_list={list} />
                  </div>

                  {/** Filter tabs */}
                  <div className="flex gap-2 mb-4 flex-shrink-0">
                        {FILTERS.map(filt => (
                              <button
                                    key={filt}
                                    onClick={() => setFilter(filt)}
                                    className={`px-3 py-1.5 w-18 rounded-lg text-sm font-medium transition-all
                                          ${filter === filt
                                                ? 'bg-neutral-700 border border-neutral-600 text-white'
                                                : 'bg-neutral-900 border border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'
                                          }`}
                              >
                                    {filt}
                              </button>
                        ))}
                  </div>

                  {/** Task Items - Scrollable Area */}
                  <div className="flex flex-col gap-2 overflow-y-auto min-h-0">
                        {filtered.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-12 gap-3">
                                    <p className="text-sm text-neutral-500">
                                          {filter === 'All' ? 'No tasks yet. Add one!' : `No tasks.`}
                                    </p>
                              </div>
                        ) : (
                              filtered.map(task => (
                                    <TaskItems
                                          key={task.id}
                                          task={task}
                                          onToggle={onToggle}
                                          onDelete={onDelete}
                                    />
                              ))
                        )}
                  </div>
            </div>
      )
}