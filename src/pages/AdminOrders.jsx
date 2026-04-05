import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ChevronLeft, 
  Search, 
  Eye, 
  X, 
  CheckCircle, 
  Truck, 
  Loader2,
  Package,
  Calendar,
  User,
  CreditCard
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import './Admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdateLoading(true);
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      
      // Update local state
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar subtitle="Order Tracking" />

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-breadcrumbs">
            <Link to="/admin" className="back-link"><ChevronLeft size={16} /> Dashboard</Link>
            <h1>Global Order History</h1>
          </div>
        </header>

        {loading ? (
          <div className="admin-loading-centered">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : (
          <div className="orders-section">
            <div className="orders-table-wrapper glass">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? orders.map(order => (
                    <tr key={order.id}>
                      <td className="order-id-cell">#MTC-{order.id}</td>
                      <td>{order.full_name}</td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>₹{order.total_amount?.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge-refined ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleOpenOrder(order)} className="action-view-btn">
                          <Eye size={16} /> View Details
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="no-data">No orders recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="order-modal glass admin-modal">
            <div className="modal-header">
              <h2>Order Details #MTC-{selectedOrder.id}</h2>
              <button className="close-modal" onClick={handleCloseModal}><X size={24} /></button>
            </div>

            <div className="order-modal-content">
              <div className="order-details-grid">
                {/* Details Side */}
                <div className="details-col">
                  <div className="detail-section">
                    <h4><User size={16} /> Customer Information</h4>
                    <p><strong>Name:</strong> {selectedOrder.full_name}</p>
                    <p><strong>Email:</strong> {selectedOrder.email}</p>
                    <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                  </div>
                  <div className="detail-section">
                    <h4><Truck size={16} /> Delivery Address</h4>
                    <p>{selectedOrder.address}</p>
                    <p><strong>Pincode:</strong> {selectedOrder.pincode}</p>
                  </div>
                  <div className="detail-section">
                    <h4><CheckCircle size={16} /> Manage Status</h4>
                    <div className="status-actions">
                      <button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                        className={`status-btn-refined processing ${selectedOrder.status === 'processing' ? 'active' : ''}`}
                      >
                        Processing
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                        className={`status-btn-refined shipped ${selectedOrder.status === 'shipped' ? 'active' : ''}`}
                      >
                        Shipped
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                        className={`status-btn-refined delivered ${selectedOrder.status === 'delivered' ? 'active' : ''}`}
                      >
                        Delivered
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items Side */}
                <div className="items-col glass">
                  <h4><Package size={16} /> Items Ordered</h4>
                  <div className="order-items-scroll">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="order-item-mini">
                        <div className="item-name">{item.name}</div>
                        <div className="item-qty">x{item.quantity}</div>
                        <div className="item-price">₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>
                  <div className="order-total-bar">
                    <span>Grand Total:</span>
                    <span className="total-val">₹{selectedOrder.total_amount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseModal} className="save-btn">Close Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
