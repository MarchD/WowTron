import { createPortal } from 'react-dom';
import { FC, PropsWithChildren } from 'react';

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Modal: FC<PropsWithChildren<ModalProps>> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="absolute top-12 bottom-0 inset-x-0 flex justify-center items-center bg-black/50">
      <div className="absolute inset-0" onClick={onClose}/>
      <div className="relative w-[369px] h-[264px] p-8 bg-white rounded-lg shadow-md">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
