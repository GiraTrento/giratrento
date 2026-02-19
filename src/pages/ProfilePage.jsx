import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../api/orderService';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const myOrders = await getMyOrders();
      const sortedOrders = myOrders.sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate));
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Errore durante il recupero degli ordini:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  // Badge testuali per lo stato, senza icone
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className='status-badge status-pending'>In attesa di conferma</span>;
      case 'confirmed':
        return <span className='status-badge status-confirmed'>Confermato / Pronto</span>;
      case 'completed':
        return <span className='status-badge status-completed'>Ritirato</span>;
      default:
        return <span className='status-badge'>{status}</span>;
    }
  };

  if (!user) return null;

  return (
    <div className='profile-page-wrapper'>
      <div className='profile-sidebar'>
        <div className='profile-card'>
          <div className='profile-avatar'>{user.name.charAt(0).toUpperCase()}</div>

          <h1 className='profile-name'>{user.name}</h1>
          <p className='profile-role'>
            Ruolo: <strong>{user.role}</strong>
          </p>

          <div className='profile-info'>
            {user.role === 'admin' && (
              <button className='secondary-btn' onClick={() => navigate('/admin-dashboard')}>
                Pannello Admin
              </button>
            )}
            {user.role === 'merchant' && (
              <button className='secondary-btn' onClick={() => navigate('/merchant-dashboard')}>
                Area Commercianti
              </button>
            )}
          </div>

          <div className='profile-actions'>
            <button className='back-home-btn' onClick={() => navigate('/')}>
              Torna alla Home
            </button>
            <button className='logout-btn' onClick={handleLogout}>
              Esci dall'Account
            </button>
          </div>
        </div>
      </div>

      {/* SEZIONE PRINCIPALE: ORDINI */}
      <div className='profile-content'>
        <div className='orders-panel'>
          <h2>I Miei Ordini</h2>

          {isLoading ? (
            <p className='loading-msg'>Caricamento ordini in corso...</p>
          ) : orders.length === 0 ? (
            <p className='empty-orders-msg'>
              Non hai ancora effettuato nessun ordine. Cerca un'attività sulla mappa e fai il tuo
              primo acquisto.
            </p>
          ) : (
            <div className='orders-list'>
              {orders.map((order) => {
                const activityName = order.activity?.name || 'Negozio non specificato';
                const pickupDate = new Date(order.pickupDate);

                return (
                  <div key={order._id} className='order-card'>
                    <div className='order-header'>
                      <h3>{activityName}</h3>
                      {getStatusBadge(order.status || 'pending')}
                    </div>

                    <div className='order-details'>
                      <p>
                        <strong>Data Ritiro:</strong> {pickupDate.toLocaleDateString('it-IT')} alle{' '}
                        {pickupDate.toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p>
                        <strong>ID Ordine:</strong>{' '}
                        <span>{order._id.substring(order._id.length - 6).toUpperCase()}</span>
                      </p>
                    </div>

                    <div className='order-items'>
                      <h4>Prodotti</h4>
                      <ul>
                        {order.items?.map((item, idx) => (
                          <li key={idx}>
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span className='item-price'>
                              €{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className='order-total'>
                      <span>Totale pagato:</span>
                      <strong>€ {order.totalAmount?.toFixed(2) || '0.00'}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
