// Components
import Backdrop from "./Backdrop";
// Styles
import classes from "./Modal.module.scss";

interface Props
{
    show: boolean;
    closeModal: () => void;
    className?: string;
    children?: React.ReactNode;
}

const Modal = ( { show, closeModal, className, children }: Props ) =>
{
    const cssClasses = [
        classes.Modal,
        show ? classes.ModalOpen : classes.ModalClosed,
        className
    ];

    return (
        <>
            <Backdrop show={ show } closeModal={ closeModal } />
            <div className={ cssClasses.join( " " ) }>
                { children }
                <div className={ classes.closeModal } onClick={ closeModal }>
                    <p>Click here to close...</p>
                </div>
            </div>
        </>
    );
};

export default Modal;
