//Styles
import classes from "./Backdrop.module.scss";

interface Props
{
    show: boolean;
    closeModal: () => void;
}

const Backdrop = ( props: Props ) =>
{
    const cssClasses = [
        classes.Backdrop,
        props.show ? classes.BackdropOpen : classes.BackdropClosed,
    ];

    return (
        <div className={ cssClasses.join( " " ) } onClick={ props.closeModal }></div>
    );
};

export default Backdrop;