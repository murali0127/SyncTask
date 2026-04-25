// import { lists, setList } from '../../providers/AppProvider';
import { useEffect, useState } from 'react';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

const randomColor = () => {
      const r = Math.floor(Math.random() * 255) + 1;
      const g = Math.floor(Math.random() * 255) + 1;
      const b = Math.floor(Math.random() * 255) + 1;
      return `rgb(${r},${g},${b})`;

}
export default function AddNewList({ newList, onClose }) {
      const [emoji, setEmoji] = useState('🎉');
      const [list, setList] = useState({ title: "", icon: "" })

      useEffect(() => {
            console.log(list)
      }, [])

      function handleSubmit(evt) {
            evt.preventDefault();
            const color = randomColor();
            if (!list.title || list.title.trim().length <= 2) {
                  toast.error('Invalid List Name.');
                  return;
            }
            newList(
                  list.title,
                  list.icon,
                  color
            )
            notify();

            onClose();
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
                  <form onSubmit={handleSubmit}>
                        < div className=" ml-1 mr-1 px-2 py-2 flex gap-2 border border-neutral-700/50 bg-neutral-700/20 rounded-3xl mb-2" >

                              <select name="color"
                                    className='rounded-2xl text-xs text-neutral-300 bg-neutral-700  py-1 outline-none cursor-pointer hover:bg-neutral-600 transition-colors'
                                    id="default"
                                    // value={icon}
                                    onChange={(e) => setList((prev) => {
                                          return {
                                                ...prev,
                                                icon: e.target.value
                                          }
                                    })}
                              >
                                    <option value=""></option>
                                    <option value="🧑‍💻" >🧑‍💻</option>
                                    <option value="💼">💼</option>
                                    <option value="🎉">🎉</option>
                                    <option value="💪">💪</option>
                                    <option value="📝">📝</option>
                                    <option value="🔥">🔥</option>
                                    <option value="😀">😀</option>
                              </select>

                              <input

                                    className='text-neutral-600 border-0 outline-none focus:outline-none focus:ring-0 
                         w-full bg-transparent 
             focus:bg-neutral-700 rounded-3xl 
             px-2 focus:text-neutral-50'
                                    // onChange={handleChange}
                                    placeholder="New List"
                                    value={list.title}
                                    onChange={(e) => setList((prev) => {
                                          return {
                                                ...prev,
                                                title: e.target.value
                                          }
                                    })}
                              // value={listCategory}
                              />
                              <span>
                                    <button type='submit' className='text-2xl mx-2 my-1 hover:text-neutral-400'>
                                          {/* <i className="bi bi-plus-circle text-lg font-bold text-neutral-500"></i> */}
                                          &#43;
                                    </button>
                              </span>
                        </div >
                  </form>

            </>
      )
}

