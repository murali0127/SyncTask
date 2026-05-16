import ReactDOM from 'react-dom';
// import ;

export default function DeleteListModel({ isOpen, onClose, onDelete }) {
      if (!isOpen) return null;
      return ReactDOM.createPortal(
            <div className="modal-overlay"
                  onClick={onClose}
            >
                  <div
                        className="modal-content"
                        onClick={(evt) => evt.stopPropagation()}
                  >
                        <h2 className="flex justify-center text-lg font-semibold mb-4 text-white">
                              Confirm Deleting List
                        </h2>
                        <p className='flex justify-center text-neutral-400 text-sm font-mono '>Deleting list cannot be retrieved.</p>
                        <div className='mt-3 flex mt-2 gap-3'>
                              <button
                                    onClick={onClose}
                                    className="p-2 font-semibold text-md text-neutral-400 rounded-2xl bg-neutral-700 hover:text-white"
                              >
                                    Cancel
                              </button>

                              <button
                                    onClick={onDelete}
                                    onClick={onDelete}
                                    className='ml-auto text-md font-semibold text-white bg-red-500 rounded-2xl p-2 hover:bg-neutral-500'
                              >
                                    Delete
                              </button>
                        </div>
                  </div>
            </div >,
            document.body

      )

}
