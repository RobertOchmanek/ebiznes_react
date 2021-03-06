import { useEffect, useState } from 'react';
import Cart from './components/Cart';
import Header from './components/Header';
import Main from './components/Main';
import { createOrder } from './api/createOrder';
import { getCartItems } from './api/getCartItems';
import { getProducts } from './api/getProducts';
import { updateCart } from './api/updateCart';

function App() {

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {

    let mounted = true;

    getProducts().then(products => {
      if (mounted) {
        setProducts(products)
      }
    });

    getCartItems().then(cartItems => {
      if (mounted) {
        setCartItems(cartItems)
      }
    });

    return () => mounted = false;
  }, []);

  const onAdd = (product) => {

    let cartItemsCopy = [...cartItems]
    const existingItem = cartItemsCopy.find(cartItem => cartItem.ID === product.ID)

    if (existingItem) {
      cartItemsCopy = cartItemsCopy.map((cartItem) => 
          cartItem.ID === product.ID ? {...existingItem, Quantity: existingItem.Quantity + 1} : cartItem
      );
    } else {
      cartItemsCopy.push({...product, Quantity: 1})
    }

    setCartItems(cartItemsCopy)
    updateCart(cartItemsCopy);
  };

  const onRemove = (product) => {

    let cartItemsCopy = [...cartItems]
    const existingItem = cartItemsCopy.find((cartItem) => cartItem.ID === product.ID);

    if (existingItem.Quantity === 1) {
      cartItemsCopy = cartItemsCopy.filter((cartItem) => cartItem.ID !== product.ID);
    } else {
        cartItemsCopy = cartItemsCopy.map((cartItem) => 
          cartItem.ID === product.ID ? {...existingItem, Quantity: existingItem.Quantity - 1} : cartItem
      );
    }

    setCartItems(cartItemsCopy)
    updateCart(cartItemsCopy);
  };

  const onOrderPlaced = (paymentType) => {

    createOrder(cartItems, paymentType);
    setCartItems([]);
    alert("Order successfully placed!")
  }

  return (
    <div className="App">
        <Header numCartItems={cartItems.length}></Header>
        <div className='row'>
          <Main onAdd={onAdd} products={products}></Main>
          <Cart onAdd={onAdd} onRemove={onRemove} onOrderPlaced={onOrderPlaced} cartItems={cartItems}></Cart>
        </div>
    </div>
  );
}

export default App;
