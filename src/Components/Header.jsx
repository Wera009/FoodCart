import logo from "../assets/logo.jpg";

export default function Header({handleOpenCart,cartQuantity}) {
  
  return (
    <>
  
    <div id="main-header">
      <header id="title">
        <img src={logo} alt="ReactFood Logo" />
        <h1>ReactFood</h1>
      </header>
      <button className="text-button" onClick={handleOpenCart}>Cart ({cartQuantity})</button>
    </div>
    </>
  );
}