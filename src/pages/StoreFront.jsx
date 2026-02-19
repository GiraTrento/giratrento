import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addProduct, updateProduct, deleteProduct } from '../api/activityService';
import { createOrder } from '../api/orderService';
import './StoreFront.css';

const StoreFront = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const initialStore = state?.store;

  const [store, setStore] = useState(initialStore);
  const [products, setProducts] = useState(initialStore?.products || []);
  const [currentUser, setCurrentUser] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', available: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);

  const [cart, setCart] = useState([]);
  const [pickupDate, setPickupDate] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  if (!store) {
    return (
      <div className='storefront-error'>
        <h2>Ops! Negozio non trovato.</h2>
        <button onClick={() => navigate('/')}>Torna alla Mappa</button>
      </div>
    );
  }

  const userId = currentUser?.id || currentUser?._id;
  const isOwner = currentUser?.role === 'merchant' && userId === store.owner;
  const isAdmin = currentUser?.role === 'admin';
  const canEditProducts = isAdmin || isOwner;

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const productData = { ...newProduct, price: parseFloat(newProduct.price) };

      if (editingIndex !== null) {
        const productId = products[editingIndex]._id || products[editingIndex].name;
        const response = await updateProduct(store._id, productId, productData);

        if (response && response.products) {
          setProducts(response.products);
        } else {
          const updatedProducts = [...products];
          updatedProducts[editingIndex] = { ...products[editingIndex], ...productData };
          setProducts(updatedProducts);
        }
      } else {
        const response = await addProduct(store._id, productData);

        if (response && response.products) {
          setProducts(response.products);
        } else if (response && response._id) {
          setProducts([...products, response]);
        } else {
          setProducts([...products, productData]);
        }
      }

      setNewProduct({ name: '', price: '', available: true });
      setEditingIndex(null);
      setShowForm(false);
    } catch (error) {
      console.error('Errore salvataggio prodotto:', error);
      alert(error.response?.data?.message || 'Impossibile salvare il prodotto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (index, product) => {
    setNewProduct({ name: product.name, price: product.price, available: product.available });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDeleteClick = async (index, product) => {
    if (window.confirm(`Sei sicuro di voler eliminare "${product.name}"?`)) {
      try {
        const productId = product._id || product.name;
        await deleteProduct(store._id, productId);

        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Errore eliminazione:', error);
        alert('Impossibile eliminare il prodotto.');
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingIndex(null);
    setNewProduct({ name: '', price: '', available: true });
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === product.name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productName) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== productName));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmitOrder = async () => {
    if (!currentUser) {
      alert("Devi effettuare l'accesso per poter ordinare!");
      return;
    }
    if (!pickupDate) {
      alert('Seleziona una data e ora per il ritiro.');
      return;
    }

    setIsOrdering(true);
    try {
      const orderData = {
        activityId: store._id,
        items: cart,
        totalAmount: totalAmount,
        pickupDate: new Date(pickupDate).toISOString(),
      };

      await createOrder(orderData);

      alert('Ordine inviato con successo!');
      setCart([]);
      setPickupDate('');
    } catch (error) {
      console.error('Errore invio ordine:', error);
      alert(error.response?.data?.message || "Impossibile completare l'ordine.");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className='storefront-container'>
      <header className='storefront-header'>
        <button className='back-btn' onClick={() => navigate(-1)}>
          <svg
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M19 12H5M12 19l-7-7 7-7' />
          </svg>
        </button>
        <div className='storefront-title-area'>
          <h1>Vetrina: {store.name}</h1>
          <p>{store.address}</p>
        </div>
      </header>

      <main className='storefront-main layout-with-cart'>
        <div className='products-section'>
          <div className='products-header'>
            <h2>I Nostri Prodotti</h2>
            {canEditProducts && (
              <button
                className='btn-add-product'
                onClick={() => (showForm ? handleCancelForm() : setShowForm(true))}
              >
                {showForm ? 'Annulla' : '+ Aggiungi Prodotto'}
              </button>
            )}
          </div>

          {showForm && (
            <form className='add-product-form' onSubmit={handleAddProduct}>
              <h3 style={{ margin: '0 0 10px 0' }}>
                {editingIndex !== null ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
              </h3>
              <div className='form-row'>
                <input
                  type='text'
                  placeholder='Nome Prodotto (es. Mele Bio)'
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
                <input
                  type='number'
                  step='0.01'
                  placeholder='Prezzo (€)'
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                />
              </div>
              <div className='form-row options-row'>
                <label>
                  <input
                    type='checkbox'
                    checked={newProduct.available}
                    onChange={(e) => setNewProduct({ ...newProduct, available: e.target.checked })}
                  />{' '}
                  Disponibile
                </label>
                <button type='submit' className='btn-submit-product' disabled={isSubmitting}>
                  {isSubmitting ? 'Salvataggio...' : 'Salva Prodotto'}
                </button>
              </div>
            </form>
          )}

          {!products || products.length === 0 ? (
            <p className='no-products'>
              Questo negozio non ha ancora aggiunto prodotti alla sua vetrina.
            </p>
          ) : (
            <div className='products-grid'>
              {products.map((product, index) => (
                <div
                  key={index}
                  className={`product-card ${!product.available ? 'unavailable' : ''}`}
                >
                  <div className='product-info'>
                    <h3>{product.name}</h3>
                    <p className='product-price'>€ {product.price.toFixed(2)}</p>
                    {!product.available && <span className='badge-unavailable'>Esaurito</span>}
                  </div>

                  <div className='product-actions'>
                    <button
                      className='btn-add-cart'
                      disabled={!product.available}
                      onClick={() => handleAddToCart(product)}
                    >
                      {product.available ? '+ Aggiungi al Carrello' : 'Esaurito'}
                    </button>

                    {canEditProducts && (
                      <div className='admin-product-actions'>
                        <button
                          className='btn-edit-icon'
                          title='Modifica'
                          onClick={() => handleEditClick(index, product)}
                        >
                          Modifica
                        </button>
                        <button
                          className='btn-delete-icon'
                          title='Elimina'
                          onClick={() => handleDeleteClick(index, product)}
                        >
                          Elimina
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='cart-sidebar'>
          <h2>Il Tuo Carrello</h2>

          {cart.length === 0 ? (
            <p className='empty-cart'>Il carrello è vuoto. Aggiungi qualche prodotto!</p>
          ) : (
            <div className='cart-content'>
              <ul className='cart-items-list'>
                {cart.map((item, idx) => (
                  <li key={idx} className='cart-item'>
                    <div className='cart-item-details'>
                      <strong>
                        {item.quantity}x {item.name}
                      </strong>
                      <span>€ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <button
                      className='btn-remove-item'
                      onClick={() => handleRemoveFromCart(item.name)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>

              <div className='cart-summary'>
                <div className='cart-total'>
                  <span>Totale:</span>
                  <strong>€ {totalAmount.toFixed(2)}</strong>
                </div>

                <div className='pickup-date-section'>
                  <label>Data e Ora di ritiro prevista:</label>
                  <input
                    type='datetime-local'
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>

                <button className='btn-checkout' onClick={handleSubmitOrder} disabled={isOrdering}>
                  {isOrdering ? 'Invio ordine...' : 'Conferma Ordine'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StoreFront;
