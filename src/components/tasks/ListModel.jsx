import AddNewList from "./AddNewList";
import ReactDOM from 'react-dom';

export default function ListModel({ isOpen, onClose }) {
      if (!isOpen) {
            return null;
      }
      return ReactDOM.createPortal(
            <div className="modal-overlay" onClick={onClose}>
                  <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                  >
                        <h2 className="ml-32 text-lg font-semibold mb-4 text-white">
                              Create New List
                        </h2>

                        <AddNewList onClose={onClose} />

                        <button
                              onClick={onClose}
                              className="ml-77 mt-3 p-2 font-semibold text-md text-neutral-400 rounded-2xl bg-neutral-700 hover:text-white"
                        >
                              Cancel
                        </button>
                  </div>
            </div>,
            document.body
      );
}