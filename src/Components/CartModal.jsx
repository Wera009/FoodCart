import { useImperativeHandle,forwardRef,useRef } from "react";
const CartModal= forwardRef(function Modal({children},ref) {
    const dialog =useRef();
    /*useImperativeHandle(ref,()=>{
        return{
            open: () => {
                dialog.current.showModal();
              },
              close: () => {
                dialog.current.close();
              }
        }
    })*/
        useImperativeHandle(ref, () => ({
          open: () => {
            dialog.current.showModal();
          },
          close: () => {
            dialog.current.close();
          },
        }));
    return(
        <>
    <dialog ref={dialog} className="modal">
      {children}
      
      {/*<form method="dialog" className="modal-actions">
        {actions}
      </form>*/}
     
    
    </dialog>
        </>
    )
})
export default CartModal;