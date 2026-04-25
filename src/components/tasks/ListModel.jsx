import AddNewList from "./AddNewList";
import ReactDOM from 'react-dom';

export default function ListModel({ isOpen, onClose, newList }) {
      if (!isOpen) {
            return null;
      }
      return ReactDOM.createPortal(
            <div className="modal-overlay" onClick={onClose}>
                  <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                  >
                        <h2 className="text-lg font-semibold mb-4 text-white">
                              Create New List
                        </h2>

                        <AddNewList newList={newList} onClose={onClose} />

                        <button
                              onClick={onClose}
                              className="mt-3 text-sm text-neutral-400 hover:text-white"
                        >
                              Cancel
                        </button>
                  </div>
            </div>,
            document.body
      );
}