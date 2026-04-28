import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { MessageSquareDiff } from 'lucide-react';

const INITIAL_DATA = {
      title: "",
      description: "",
      priority: "medium",
      dueDate: ""
};

export default function AddTaskForm({ onAdd }) {

      // const [title, setTitle] = useState("");
      // const [priority, setPriority] = useState('medium');
      // const [dueDate, setDueDate] = useState('');
      // const [description, setDecription] = useState("");
      const [formData, setFormData] = useState(INITIAL_DATA);
      const [isPanelOpen, setIsPanelOpen] = useState(false);

      function handleChange(evt) {
            const name = evt.target.name;
            const value = evt.target.value;
            setFormData((prev) => {
                  return { ...prev, [name]: value }
            });
            // console.log(formData);

      }

      async function handleSubmit() {
            // evt.preventDefault();
            if (!formData.title.trim()) return

            const result = await onAdd(
                  formData.title.trim(),
                  {
                        priority: formData.priority,
                        due_date: formData.dueDate || null,
                        description: formData.description || null
                  }
            );

            if (result?.success === false) {
                  toast.error(result.error || 'Could not add task.');
                  return;
            }

            toast.success('Added a new Task.....', {
                  duration: 2000,
                  position: "top-center",
                  removeDelay: 1000
            });
            setFormData(INITIAL_DATA);
            // setIsPanelOpen(false);
      }

      return (
            <>
                  <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-full p-2 mb-2 flex items-center gap-3">

                        <Input
                              name='title'
                              value={formData.title}
                              onChange={handleChange}
                              onKeyDown={evt => evt.key === 'Enter' && handleSubmit}
                              placeholder="Add a new task..."
                              className='border-0 h-8 bg-transparent focus:ring-0 px-0 py-1'
                        />
                        <div className="flex items-center gap-3 flex-shrink-0">
                              <button
                                    title="Description"
                                    onClick={() => setIsPanelOpen(prev => !prev)}
                                    className={`rounded-xl font-semibold p-2 text-sm transition-colors
                                    ${isPanelOpen
                                                ? 'bg-rose-700/40 text-neutral-300 border border-rose-700/50'
                                                : 'bg-neutral-800 text-neutral-400'}`
                                    }
                              >

                                    <MessageSquareDiff size={16} />
                              </button>
                              <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1
                                     text-sm text-neutral-400 outline-none cursor-pointer
                                     focus:border-neutral-600"
                              >
                                    <option value="high" className="bg-neutral-800">🔴 High</option>
                                    <option value="medium" className="bg-neutral-800">🟠 Medium</option>
                                    <option value="low" className="bg-neutral-800">🟢 Low</option>
                              </select>
                              <div className="flex items-center gap-3">
                                    <select
                                          name="dueDate"
                                          value={formData.dueDate}
                                          onChange={handleChange}
                                          className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5
                                     text-sm text-neutral-400 outline-none cursor-pointer
                                     focus:border-neutral-600"
                                    >
                                          <option value="" className="bg-neutral-800">Due date</option>
                                          <option value="Today" className="bg-neutral-800">Today</option>
                                          <option value="Tomorrow" className="bg-neutral-800">Tomorrow</option>
                                          <option value="Day 2" className="bg-neutral-800">Day 2</option>
                                          <option value="Friday" className="bg-neutral-800">Friday</option>
                                          <option value="Sunday" className="bg-neutral-800">Sunday</option>
                                          <option value="This week" className="bg-neutral-800">This week</option>
                                          <option value="Next week" className="bg-neutral-800">Next week</option>
                                          <option value="This month" className="bg-neutral-800">This month</option>
                                          <option value="Next month" className="bg-neutral-800">Next month</option>
                                    </select>
                                    <Button
                                          title="Add Task"
                                          variant="default"
                                          size='md'
                                          onClick={() => handleSubmit}
                                          disabled={!formData.title.trim()
                                          }

                                    >
                                          Add
                                    </Button>
                              </div>
                        </div >
                  </div >
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out
            ${isPanelOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                        <div className="bg-neutral-900 border border-neutral-700/60 rounded-2xl p-4 shadow-xl ml-4 mr-4">
                              <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Add context, notes, or details..."
                                    className="w-full bg-transparent resize-none outline-none text-sm text-neutral-300 placeholder-neutral-600 h-24 leading-relaxed"
                              />
                              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                                    <span className="text-xs text-neutral-600">{formData.description.length} / 300</span>
                                    <div className="flex gap-2">
                                          <button onClick={() => setIsPanelOpen(false)} className="text-xs text-neutral-500 px-3 py-1 hover:bg-neutral-800 rounded-lg">
                                                Cancel
                                          </button>
                                          <button onClick={() => setIsPanelOpen(false)} className="text-xs bg-rose-700/50 text-white px-3 py-1 rounded-lg hover:bg-purple-600">
                                                Save note
                                          </button>
                                    </div>
                              </div>
                        </div>
                  </div>
            </>
      )
}