import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSearchResults } from '../../services/customer/ProductServices'; 
import Loader from '../../components/shared/Loader';
import BackToTopButton from '../../components/shared/BackToTopButton';
import ProductSearch from '../../components/customer/Products/ProductSearch';
import useDebounce from '../../hooks/useDebounce'; // Import the debounce hook
 
const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    color: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10
  });

  // Debounced filters
  const debouncedFilters = useDebounce(filters, 500); // 500ms debounce delay

  // Wrap fetchProducts in useCallback to memoize it
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSearchResults(query, debouncedFilters, pagination.currentPage, pagination.limit);
      setProducts(data.products);
      setPagination((prev) => ({ ...prev, totalPages: data.totalPages }));
    } catch (error) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [query, debouncedFilters, pagination.currentPage, pagination.limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Adding fetchProducts as dependency

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div>
  
      {loading ? (
        <Loader />
      ) : (
        <ProductSearch 
          products={products}
          filters={filters}
          handleFilterChange={handleFilterChange}
          pagination={pagination}
          handlePageChange={handlePageChange}
          handleProductClick={handleProductClick}
          error={error}
        />
      )}
      <BackToTopButton /> 
    </div>
  );
};

export default Products;
 