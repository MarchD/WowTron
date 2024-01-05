import React, { useState, createContext,  useContext, useCallback, ReactNode, FC, PropsWithChildren } from 'react';
import Modal from '../../components/Modal';
import styles from './ErrorModalProvider.module.css';
import { CloseIcon } from '../../components/icons';
import Button from '../../components/Button';

const { onError } = window.electron;


const ModalErrorContext = createContext<{
  showModal: (content?: ReactNode) => void;
  hideModal: () => void;
}>({
  showModal: () => {},
  hideModal: () => {},
});

export const useErrorModal = () => useContext(ModalErrorContext);

const ErrorModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const showModal = useCallback((content: ReactNode) => {
    setModalContent(content);
  }, []);

  const hideModal = useCallback(() => {
    setModalContent(null);
  }, []);

  onError(showModal);

  return (
    <ModalErrorContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalContent && (
        <Modal isOpen={Boolean(modalContent)} onClose={hideModal}>
          <div className="flex flex-col justify-center h-full">

            <div className="flex items-center justify-center gap-3 pb-3">
              <CloseIcon className={styles.close}/>
              <h2 className="text-xl font-bold ">Error</h2>
            </div>

            <div className="flex justify-center pb-6 text-[13px]">
              {modalContent}
            </div>

            <Button className="w-full" onClick={hideModal}>OK</Button>
          </div>
        </Modal>
      )}
    </ModalErrorContext.Provider>
  );
};

export default ErrorModalProvider;
