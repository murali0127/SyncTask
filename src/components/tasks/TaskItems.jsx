import clsx from 'clsx';
import toast from 'react-hot-toast';

import { CircleX } from 'lucide-react';

const PRIORITY_CONFIG = {
      high: { bar: 'bg-red-500', dot: 'bg-red-500' },
      medium: { bar: 'bg-orange-500', dot: 'bg-orange-500' },
      low: { bar: 'bg-green-500', dot: 'bg-green-500' },
}

export default function TaskItems({ task, onToggle, onDelete }) {
      const config = PRIORITY_CONFIG[task.priority];

      const notify = () => {
            toast.error("Deleted a task.", {
                  duration: 2000,
                  position: 'top-center'
            })
      }

      return (
            <div
                  className={clsx(
                        'group relative flex items-center gap-3 h-15',
                        'bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-3 py-3',
                        'hover:bg-neutral-800 transition-all duration-150 cursor-pointer',
                        task.done && 'opacity-50'
                  )}
                  onClick={() => onToggle(task.id)}
            >
                  {/* Priority indicator bar */}
                  <div className={clsx(
                        'left-0  w-1 rounded-full opacity-60',
                        config.bar
                  )} />

                  {/* Checkbox */}
                  <div className={clsx(
                        'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                        task.done
                              ? 'bg-neutral-400 border-neutral-400'
                              : 'border-neutral-600 bg-transparent hover:border-neutral-500'
                  )
                  }>
                        {task.done && <span className="text-black text-xs font-medium">✓</span>}
                  </div>

                  {/* Task content */}
                  <div className='flex-1 min-w-0 gap-2'>
                        <p className={clsx(
                              'text-sm font-medium truncate',
                              task.done ? 'line-through text-neutral-500' : 'text-neutral-200'
                        )}>
                              {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                              <span className={clsx(
                                    'w-1.5 h-1.5 rounded-full',
                                    config.dot
                              )} />
                              {task.due && (
                                    <span className="text-xs text-neutral-500">{task.due}</span>
                              )}
                              <span className={clsx(
                                    'text-xs px-2 py-0.5 rounded',
                                    task.priority === 'high' && 'bg-red-500/20 text-red-400',
                                    task.priority === 'medium' && 'bg-orange-500/20 text-orange-400',
                                    task.priority === 'low' && 'bg-green-500/20 text-green-400'
                              )}>
                                    {task.priority}
                              </span>
                        </div>
                  </div >

                  {/* Delete button */}
                  < button
                        className={
                              clsx(
                                    'group-hover:opacity-100 transition-opacity',
                                    'w-6 h-6 rounded',
                                    'flex items-center justify-center flex-shrink-0 ',
                                    'text-neutral-500 hover:text-red-400 mr-4'
                              )
                        }
                        onClick={evt => { evt.stopPropagation(); onDelete(task.id); notify() }}
                        title="Delete task"
                  >
                        <CircleX />
                  </button >

            </div >
      )
}