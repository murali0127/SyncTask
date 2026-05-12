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


                  </div>
            </div>,
            document.body
      );
}