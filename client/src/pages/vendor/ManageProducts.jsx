import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService as vendorProductService } from '../../services/vendor/VendorProductService'; 
import ProductTable from '../../components/vendor/VendorProducts/ProductTable'; 
import Loader from '../../components/shared/Loader';
import useDebounce from '../../hooks/useDebounce'; // Custom debounce hook
 
const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms debounce
  const navigate = useNavigate();

  const fetchProducts = async (page = 1, search = '') => {
    setLoading(true);
    setError('');
    try {
      const { products } = await vendorProductService.getProducts(page, search);
      setProducts(products);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, debouncedSearchQuery); // Fetch based on debounced search query
  }, [currentPage, debouncedSearchQuery]);

  const handleAddProduct = () => navigate('/vendor/add-product');
  
  const handleEditProduct = (product) => navigate(`/vendor/edit-product/${product._id}`);

  const handleDeleteProduct = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (confirm) {
      setLoading(true);
      try {
        await vendorProductService.deleteProduct(id);
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        setError('Failed to delete product. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  return (
    <div>
      <h1>Manage Products</h1>
      <button onClick={handleAddProduct} disabled={loading}>Add Product</button>

      <input 
        type="text" 
        placeholder="Search products..." 
        value={searchQuery} 
        onChange={handleSearchChange} 
        disabled={loading}
      />

      {loading && <Loader />}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          <ProductTable 
            products={products} 
            onEdit={handleEditProduct} 
            onDelete={handleDeleteProduct} 
          />
          {/* Pagination */}
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1 || loading}
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={loading || products.length === 0}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProducts;
 