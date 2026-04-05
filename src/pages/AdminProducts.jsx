import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit, 
  ChevronLeft, 
  X, 
  Save, 
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { getProductImage } from '../services/imageMap';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const initialFormState = {
    name: '',
    price: '',
    category: 'tamarind',
    image: 'tamarind.png',
    rating: 5,
    description: '',
    isB2B: false
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
      setImagePreview(getProductImage(product.image));
    } else {
      setEditingProduct(null);
      setFormData(initialFormState);
      setImagePreview(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      let finalImageUrl = formData.image;

      // Handle File Upload if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${formData.category}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;
      }

      const submissionData = { ...formData, image: finalImageUrl };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(submissionData)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([submissionData]);
        if (error) throw error;
      }
      
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Delete failed');
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar (Abstract later if needed) */}
      <AdminSidebar subtitle="Store Inventory" />

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-breadcrumbs">
            <Link to="/admin" className="back-link"><ChevronLeft size={16} /> Dashboard</Link>
            <h1>Global Inventory Management</h1>
          </div>
          <button className="save-btn" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Add Product
          </button>
        </header>

        {loading ? (
          <div className="admin-loading-centered">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : (
          <div className="inventory-section">
            <div className="inventory-grid">
              {products.map(product => (
                <div key={product.id} className="inventory-card glass">
                  <div className="inventory-card-image">
                    <img src={getProductImage(product.image)} alt={product.name} />
                  </div>
                  <div className="inventory-card-details">
                    <h3>{product.name}</h3>
                    <div className="inventory-card-meta">
                      <span className="price-tag">₹{product.price}</span>
                      <span className={`type-badge ${product.isB2B ? 'b2b' : 'retail'}`}>
                        {product.isB2B ? 'B2B/Bulk' : 'Retail'}
                      </span>
                    </div>
                    <div className="inventory-card-actions">
                      <button onClick={() => handleOpenModal(product)} className="edit-btn">
                        <Edit size={16} /> Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="delete-btn">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass">
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Heritage Product' : 'Add New Heritage Product'}</h2>
              <button className="close-modal" onClick={handleCloseModal}><X size={24} /></button>
            </div>
            
            <form className="admin-form-refined" onSubmit={handleSubmit}>
              <div className="form-group-admin">
                <label>Product Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="admin-form-row">
                <div className="form-group-admin">
                  <label>Price (₹)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="form-group-admin">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="tamarind">Tamarind</option>
                    <option value="chillies">Chillies</option>
                    <option value="pulses">Pulses</option>
                    <option value="grains">Grains</option>
                  </select>
                </div>
              </div>

              <div className="form-group-admin">
                <label>Product Image</label>
                <div className="image-upload-dropzone" onClick={() => document.getElementById('fileInput').click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="upload-preview-img" />
                  ) : (
                    <div className="upload-placeholder">
                      <ImageIcon size={32} />
                      <span>Click to upload heritage photo</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  id="fileInput" 
                  accept="image/*" 
                  onChange={handleFileSelect} 
                  style={{ display: 'none' }} 
                />
                <p className="input-hint">Square format (1:1) recommended. PNG or JPEG preferred.</p>
              </div>

              <div className="form-group-admin">
                <label>Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group-admin">
                <label>Sales Channel</label>
                <select 
                  name="isB2B" 
                  value={formData.isB2B} 
                  onChange={(e) => setFormData({...formData, isB2B: e.target.value === 'true'})}
                >
                  <option value="false">Retail (Public)</option>
                  <option value="true">Wholesale (B2B Only)</option>
                </select>
                <span className="input-hint">Select the primary audience for this heritage product.</span>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn" disabled={formLoading}>
                  {formLoading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
