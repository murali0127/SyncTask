import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import toast, { Toaster } from "react-hot-toast";

export default function AddTaskForm({ onAdd }) {
      const [title, setTitle] = useState("");
      const [priority, setPriority] = useState('medium');

      function handleChange(evt) {
            setTitle(evt.target.value);
            console.log(title)

      }

      function handleSubmit() {
            if (!title.trim()) return
            onAdd(
                  title.trim(),
                  priority
            )

            setTitle("")
      }

      const notify = () => {
            toast.success('Added a new Task.....', {
                  duration: 2000,
                  position: "top-center",
                  // icon: '🎉',
                  removeDelay: 1000
            })
      }

      return (
            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-full p-2 mb-2 flex items-center gap-3">
                  <Input
                        value={title}
                        onChange={handleChange}
                        onKeyDown={evt => evt.key === 'Enter' && handleSubmit()}
                        placeholder="Add a new task..."
                        className='border-0 h-8 bg-transparent focus:ring-0 px-0 py-1'
                  />
                  <div className="flex items-center gap-3 flex-shrink-0">
                        <select
                              value={priority}
                              onChange={evt => setPriority(evt.target.value)}
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
                                    value={priority}
                                    onChange={evt => setPriority(evt.target.value)}
                                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5
                                     text-sm text-neutral-400 outline-none cursor-pointer
                                     focus:border-neutral-600"
                              >
                                    <option value="Done" className="bg-neutral-800">Due date</option>
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
                                    variant="default"
                                    size='md'
                                    onClick={() => { handleSubmit(); notify() }}
                                    disabled={!title.trim()
                                    }

                              >
                                    Add
                              </Button>
                        </div>
                  </div >
            </div >
      )
}