export default function CartItem({items,onUpdateQuantity,formattedTotalPrice}) {
    return(
        <div className="cart">
        <h2>Your Cart</h2>
        <ul>
            {items.map((mealItem)=> 
            <li key={mealItem.id} className="cart-item" >
                <p>{mealItem.name} - {mealItem.quantity} x ${mealItem.price}</p>
                <div className="cart-item-actions">
                <button onClick={()=>onUpdateQuantity(mealItem.id, -1)}>-</button>
                <p>{mealItem.quantity}</p>
                <button onClick={()=>onUpdateQuantity(mealItem.id, +1)}>+</button>
                </div>
            </li>)}</ul>
        <span className="cart-total">{formattedTotalPrice}</span>
        </div>
    )
}
