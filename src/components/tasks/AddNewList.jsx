// import { lists, setList } from '../../providers/AppProvider';
import { useEffect, useRef, useState, useCallback } from 'react';
import Input from '../ui/Input';
import toast from 'react-hot-toast';
import { useAppState } from '../../providers/AppProvider';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const randomColor = () => {
      const r = Math.floor(Math.random() * 255) + 1;
      const g = Math.floor(Math.random() * 255) + 1;
      const b = Math.floor(Math.random() * 255) + 1;
      return `rgb(${r},${g},${b})`;

}

// const DEFAULT_ICON = ''
export default function AddNewList({ onClose }) {
      const { createList, user } = useAppState();

      const [emoji, setEmoji] = useState('📋');
      const [list, setList] = useState({ title: "", icon: "" })

      const [showPicker, setShowPicker] = useState(false);
      const [submitting, setSubmitting] = useState(false);

      //userRef for Emoji Picker
      const pickerRef = useRef(null);
      const triggerRef = useRef(null);

      // Close Picker on putside click.
      useEffect(() => {
            if (!showPicker) return;
            function handleOutsideClick() {
                  if (
                        pickerRef.current && !pickerRef.current.contains(e.target) &&
                        triggerRef.current && !triggerRef.current.contains(e.target)
                  ) {
                        setShowPicker(false);
                  }

                  // Delay one tick so the triggering click doesn't immediately close the picker
                  const id = setTimeout(() =>
                        document.addEventListener('mousedown', handleOutside), 0
                  );

                  return () => {
                        clearTimeout(id);
                        document.removeEventListener('mousedown', handleOutside);
                  };
            }
      }, [showPicker]);

      const handleEmojiSelect = useCallback((emojiObj) => {
            const selectedEmoji = emojiObj.native;
            setEmoji(selectedEmoji);   // native is the actual Unicode emoji

            setList((prev) => {
                  return {
                        ...prev, icon: selectedEmoji
                  }
            });
            setShowPicker(false);
      }, []);
      function handleChange(evt) {
            const name = evt.target.name;
            const value = evt.target.value;

            setList((prev) => {
                  return {
                        ...prev,
                        [name]: value
                  }
            })
      }
      async function handleSubmit(evt) {
            evt.preventDefault();
            const color = randomColor();
            if (!list.title || list.title.trim().length <= 2) {
                  toast.error('Invalid List Name.');
                  return;
            }

            setSubmitting(true);

            const result = await createList(
                  list.title,
                  list.icon || '📋',
                  color,
                  user.id
            );
            if (result?.success === false || result?.error) {
                  toast.error(result?.error || 'Could not create list.');
                  return;
            }
            notify();
            onClose();
            setSubmitting(false);
      }

      const notify = () => {
            toast.success(
                  'Added a new List, Go ahead.', {
                  duration: 1500,
                  icon: '👏',
                  removeDelay: 900
            })
      }


      return (
            <>{/** Add New List */}
                  <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        {/* ── Icon picker trigger + input row ─────────────────────── */}
                        <div className="flex items-center gap-3 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-2xl">

                              {/* Emoji button */}
                              <div className="relative">
                                    <button
                                          ref={triggerRef}
                                          type="button"
                                          title="Choose icon"
                                          onClick={() => setShowPicker(prev => !prev)}
                                          className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl
                       bg-neutral-700 hover:bg-neutral-600 transition-colors
                       border border-neutral-600 hover:border-neutral-500
                       select-none"
                                    >
                                          {list.icon}
                                    </button>

                                    {/* Picker — portal-free, positioned absolutely */}
                                    {showPicker && (
                                          <div
                                                ref={pickerRef}
                                                className="absolute left-0 top-full mt-2 z-[9999]
                         rounded-2xl overflow-hidden shadow-2xl
                         border border-neutral-700"
                                                // Prevent the modal's own click-outside from swallowing picker clicks
                                                onClick={e => e.stopPropagation()}
                                          >
                                                <Picker
                                                      set="Apple"
                                                      onEmojiSelect={handleEmojiSelect}
                                                      theme="dark"
                                                      previewPosition="none"
                                                      skinTonePosition="none"
                                                      perLine={8}
                                                      maxFrequentRows={2}
                                                />
                                          </div>
                                    )}
                              </div>

                              {/* Title input */}
                              <input
                                    name="title"
                                    value={list.title}
                                    onChange={e => handleChange(e)}
                                    placeholder="List name…"
                                    autoFocus
                                    className="flex-1 bg-transparent outline-none text-sm text-white
                     placeholder-neutral-500 py-1"
                              />
                        </div>

                        {/* ── Actions ─────────────────────────────────────────────── */}
                        <div className="flex gap-2 justify-end">
                              <button
                                    type="button"
                                    onClick={onClose}
                                    className="mr-auto font-semibold px-4 py-2 text-sm text-neutral-400 rounded-xl
                     bg-neutral-800 hover:bg-neutral-700 hover:text-white
                     transition-colors"
                              >
                                    Cancel
                              </button>

                              <button
                                    type="submit"
                                    disabled={submitting || !list.title.trim()}
                                    className="px-4 py-2 text-sm font-semibold text-black rounded-xl
                     bg-rose-300 hover:bg-rose-200 disabled:opacity-40
                     disabled:cursor-not-allowed transition-colors"
                              >
                                    {submitting ? 'Creating…' : 'Create List'}
                              </button>
                        </div>
                  </form>

            </>
      )
}

