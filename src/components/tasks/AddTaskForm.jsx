import { useState, useRef, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { MessageSquareDiff, CalendarDays, X, Clock } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns'
import { REMINDERS } from "../../constants/reminderOption";
import WheelPicker from "./WheelPicker";
import { minutesInDay } from "date-fns/constants";


const REMINDER_OPTIONS = REMINDERS;
const INITIAL_DATA = {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      reminderMinutes: null
};


export default function AddTaskForm({ onAdd }) {

      const [formData, setFormData] = useState(INITIAL_DATA);
      const [isPanelOpen, setIsPanelOpen] = useState(false);
      const [isCalendarOpen, setIsCalendarOpen] = useState(false);

      const [dueTime, setDueTime] = useState('0:0')
      const [hour, setHour] = useState(5)
      const [minute, setMinute] = useState(30)
      const [period, setPeriod] = useState("PM")

      const calendarRef = useRef(null);

      const HOURS = Array.from(
            { length: 12 },
            (_, i) => i + 1
      )

      const MINUTES = Array.from(
            { length: 12 },
            (_, i) => i * 5
      )


      const PERIODS = ["AM", "PM"];
      useEffect(() => {
            function handleOutside(e) {
                  if (!calendarRef.current) return;
                  if (!calendarRef.current.contains(e.target)) {
                        setIsCalendarOpen(false);
                  }
            }

            if (isCalendarOpen) {
                  document.addEventListener("mousedown", handleOutside);
            }

            return () => {
                  document.removeEventListener("mousedown", handleOutside);
            };
      }, [isCalendarOpen]);


      function handleChange(evt) {
            const name = evt.target.name;
            const value = evt.target.value;
            setFormData((prev) => {
                  return { ...prev, [name]: value }
            });
            console.log(formData);

      }


      // function handleDateSelect(date) {
      //       setFormData((prev) => ({ ...prev, dueDate: date ?? null }));
      //       setIsCalendarOpen(false);
      // }

      //Handlde due_time
      function handleDateSelect(selectedDate) {
            if (!selectedDate) return;

            if (!selectedDate) return;

            const merged = new Date(selectedDate);

            // Preserve whatever hour/minute the wheels are showing

            let h24 = hour % 12 + (period === "PM" ? 12 : 0);

            if (period === "AM" && hour === 12) h24 = 0;
            merged.setHours(h24, minute, 0, 0);
            setFormData(prev => ({ ...prev, dueDate: merged }));
            setIsCalendarOpen(false);
      }

      function updateDueTime({
            newHour = hour,
            newMinute = minute,
            newPeriod = period,
      }) {
            const current = formData.dueDate
                  ? new Date(formData.dueDate)
                  : new Date();

            let h24 = newHour;

            if (newPeriod === "PM" && newHour !== 12) {
                  h24 += 12;
            }

            if (newPeriod === "AM" && newHour === 12) {
                  h24 = 0;
            }

            current.setHours(h24);
            current.setMinutes(newMinute);
            current.setSeconds(0);
            current.setMilliseconds(0);

            setFormData(prev => ({
                  ...prev,
                  dueDate: current
            }));
      }

      function clearDate(evt) {
            evt.stopPropagation();
            setFormData((prev) => ({ ...prev, dueDate: null }))
      }

      // IF NOT SET DUE_DATE TO TODAY
      function getTommorowDate() {
            const now = new Date();
            now.setDate(now.getDate() + 1)
            now.setHours(0, 0, 0, 0);
            // const date = now.toISOString();
            // .replace('T', ' ')
            // .split('.')[0]
            // + '+00';
            return now;
      }



      async function handleSubmit() {
            // console.log("Check : ", formData.dueDate);

            if (!formData.title.trim()) return;

            let finalDueDate = formData.dueDate instanceof Date
                  ? new Date(formData.dueDate)
                  : getTommorowDate();

            // Merge the wheel picker time onto the date
            let h24 = hour % 12 + (period === "PM" ? 12 : 0);
            if (period === "AM" && hour === 12) h24 = 0;
            finalDueDate.setHours(h24, minute, 0, 0);

            const result = await onAdd(formData.title.trim(), {
                  priority: formData.priority,
                  due_date: finalDueDate.toISOString(),
                  description: formData.description || null,
                  reminder_minutes_before: formData.reminderMinutes,
                  reminder_sent: false,
                  reminder_sent_at: null,
            });
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

      const dueDateLabel = formData.dueDate instanceof Date && !isNaN(formData.dueDate)
            ? format(formData.dueDate, "yyyy-MM-dd")
            : null;

      const timeOptions = []

      for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                  const h = hour.toString().padStart(2, "0")
                  const m = minute.toString().padStart(2, "0")

                  timeOptions.push(`${h}:${m}`)
            }
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
                              {/** REMINDER PICKER */}
                              <select
                                    value={formData.reminderMinutes ?? ''}
                                    onChange={(e) => {
                                          const val = e.target.value;
                                          setFormData(prev => ({
                                                ...prev,
                                                reminderMinutes: val === '' ? null : Number(val),
                                          }));
                                    }}
                                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1
             text-sm text-neutral-400 outline-none cursor-pointer
             focus:border-neutral-600"
                                    title="Set reminder"
                              >
                                    {REMINDER_OPTIONS.map((opt) => (
                                          <option
                                                key={String(opt.value)}
                                                value={opt.value ?? ''}
                                                className="bg-neutral-800"
                                          >
                                                {opt.label}
                                          </option>
                                    ))}
                              </select>

                              {/** DATE PICKER */}
                              <div ref={calendarRef} className="flex relative items-center gap-3">
                                    <button
                                          onClick={() => setIsCalendarOpen(prev => !prev)}
                                          title="Set due date"
                                          className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition-all duration-150 border ${dueDateLabel
                                                ? "bg-rose-700/40 border-rose-700/50 text-violet-300"
                                                : "bg-neutral-800 border-neutral-600/50 text-neutral-400  hover:border-neutral-500 hover:text-neutral-300"
                                                }`}
                                    >
                                          <CalendarDays size={13} />
                                          <span className="text-sm">{dueDateLabel ?? "Due date"}</span>
                                          {dueDateLabel && (
                                                <span
                                                      role="button"
                                                      onClick={clearDate}
                                                      className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                                                >
                                                      <X size={11} />
                                                </span>
                                          )}
                                    </button>
                                    {isCalendarOpen && (
                                          <div className="myCustomHeight absolute right-0 top-full mt-2 z-50 bg-neutral-800 border border-neutral-700 shadow-2xl rounded-2xl p-3 min-w-[280px]">
                                                <DayPicker
                                                      mode="single"
                                                      selected={formData.dueDate}
                                                      onSelect={handleDateSelect}
                                                      disabled={{ before: new Date() }}
                                                      classNames={{
                                                            root: "text-neutral-200 text-sm",
                                                            months: "relative",
                                                            month: "relative overflow-hidden",
                                                            month_caption: "flex justify-center items-center mb-2 font-semibold text-neutral-100 overflow-hidden",
                                                            nav: "flex items-center gap-1",
                                                            button_previous: "p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors",
                                                            button_next: "p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors",
                                                            weeks: "border-collapse",
                                                            weekdays: "text-neutral-500 text-xs",
                                                            weekday: "w-8 h-8 text-center font-medium",
                                                            week: "",
                                                            day: "w-8 h-8 text-center rounded-lg",
                                                            day_button: "w-8 h-8 rounded-lg hover:bg-neutral-700 transition-colors flex items-center justify-center text-sm",
                                                            selected: "bg-rose-700/40 text-white rounded-lg hover:bg-rose-700",
                                                            today: "font-bold text-rose-400",
                                                            disabled: "opacity-30 cursor-not-allowed",
                                                            outside: "opacity-30",
                                                      }}
                                                      footer={
                                                            <button
                                                                  onClick={() => setIsCalendarOpen(false)}
                                                                  className="mt-2 w-full text-xs bg-rose-700/40 text-white hover:text-neutral-300 py-1 hover:bg-rose-700/40 rounded-lg transition-colors"
                                                            >
                                                                  Cancel
                                                            </button>
                                                      }
                                                />
                                                {/** Due Time Picker */}
                                                <div className="mt-2 border-t border-neutral-700 pt-4">
                                                      <label className="text-xs font-semibold text-neutral-200 mb-1 block">
                                                            Due Time
                                                      </label>

                                                      <div className="flex items-center justify-center gap-3">

                                                            {/* HOURS */}
                                                            <WheelPicker
                                                                  items={HOURS}
                                                                  value={hour}
                                                                  onChange={(value) => setHour(value)}
                                                                  format={(v) => String(v).padStart(2, "0")}
                                                                  className="w-16"
                                                            />

                                                            <span className="text-xl text-neutral-500">:</span>

                                                            {/* MINUTES */}
                                                            <WheelPicker
                                                                  items={MINUTES}
                                                                  value={minute}
                                                                  onChange={(value) =>
                                                                        setMinute(value)
                                                                  }
                                                                  format={(v) => String(v).padStart(2, "0")}
                                                                  className="w-16"
                                                            />

                                                            {/* PERIOD */}
                                                            <WheelPicker
                                                                  items={PERIODS}
                                                                  value={period}
                                                                  onChange={(value) =>
                                                                        setPeriod(value)
                                                                  }
                                                                  className="w-20"
                                                            />

                                                      </div>

                                                      <div className="flex justify-center align-middle text-center text-sm font-semibold text-neutral-200">
                                                            <span className="px-2 mt-0.5"><Clock size={"17px"} /></span>{`${String(hour).padStart(2, '0')} : ${String(minute).padStart(2, '0')} ${period}`}
                                                      </div>
                                                </div>
                                          </div>
                                    )}


                                    <Button
                                          title="Add Task"
                                          variant="default"
                                          size='md'
                                          onClick={handleSubmit}
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