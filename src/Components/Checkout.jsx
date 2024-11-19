export default function Checkout({cartTotal,handleCloseCheckout,handleSubmit}) {
    /*function handleSubmit(event) {
        event.preventDefault(); // Prevent the form from submitting and reloading the page
        const fd = new FormData(event.target);
        const data = Object.fromEntries(fd.entries());
        console.log(data); 
        handleCloseCheckout();
      }*/
 return(
    <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount {cartTotal}</p>
  
        
        <div className="control">
        <label htmlFor="name">Full Name</label>
        <input id="name" type="name" name="name" required/>
        
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" required/>
        
        <label htmlFor="street">Street</label>
        <input id="street" type="street" name="street" required/>
        
        {/* <div className="control-row">         */}
        <label htmlFor="postal-code">Postal Code</label>
        <input id="postal-code" type="postal-code" name="postal-code" required/>
              
        <label htmlFor="city">City</label>
        <input id="city" type="city" name="city" required/>
        {/* </div> */}
        </div>
        
        <div className="modal-actions" >
        <button className="text-button" type="button" onClick={handleCloseCheckout}>Close</button>
        <button className="button" type="submit">Submit Order</button>
        </div>
    </form>
 )   
}