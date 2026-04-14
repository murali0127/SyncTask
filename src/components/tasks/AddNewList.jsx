// import { lists, setList } from '../../providers/AppProvider';
import Input from '../ui/Input';

export default function AddNewList() {
      function handleChange(evt) {
            evt.preventDefault();
      }

      return (
            <>{/** Add New List */}
                  < div className=" ml-1 mr-1 px-2 py-2 flex gap-2 border border-neutral-700/50 bg-neutral-700/20 rounded-3xl mb-2" >
                        <span><i className="bi bi-plus-circle text-neutral-500"></i></span>

                        <input

                              className='border-0 outline-none focus:outline-none focus:ring-0 
             h-fit w-full bg-transparent 
             focus:bg-neutral-700 rounded-3xl 
             px-2 text-neutral-300/30'
                              // onChange={handleChange}
                              placeholder="New List"

                        />
                  </div >

            </>
      )
}