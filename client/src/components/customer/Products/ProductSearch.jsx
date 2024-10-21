import React from 'react';
import '../../../styles/ProductSearch.css'; // Custom styles for the product search

const ProductSearch = ({
  products,
  filters,
  handleFilterChange,
  pagination,
  handlePageChange,
  handleProductClick,
  error,
  loading // Add loading prop if you implement loading state
}) => {
  return (
    <div className="search-results-container">
      <h3>Product Listing Page</h3> 

      {/* Error message */}
      {error && <p className="error-message">{error}</p>}

      <div className="content-wrapper">
        <div className="filter-section">
          <h2>Filters</h2>
          <label>
            Brand:
            <input
              type="text"
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
              placeholder="Enter brand"
            />
          </label>
          <label>
            Min Price:
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Enter min price"
            />
          </label>
          <label>
            Max Price:
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Enter max price"
            />
          </label>
          {/* Uncomment if you want to include color filtering */}
          {/* <label>
            Color:
            <input
              type="text"
              name="color"
              value={filters.color}
              onChange={handleFilterChange}
              placeholder="Enter color"
            />
          </label> */} 
        </div>

        <div className="product-grid">
          {/* Optional Loading State */}
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found. Try adjusting your search or filters.</p>
          ) : (
            products.map(product => (
              <div
                key={product._id}
                className="product-item"
                onClick={() => handleProductClick(product._id)}
              >
                <img src={product.imageUrls[0]} alt={product.name} />
                <h4>{product.name}</h4>
                <p>Price: ${product.price.toFixed(2)}</p> {/* Format price to two decimal places */}
                <p>Brand: {product.brand ? product.brand.name : 'N/A'}</p> {/* Accessing the brand name */}
              </div>
            ))
          )}
        </div>

        {/* Enhanced Pagination */}
        <div className="pagination">
          {pagination.currentPage > 1 && (
            <button onClick={() => handlePageChange(pagination.currentPage - 1)}>
              Previous
            </button>
          )}
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          {pagination.currentPage < pagination.totalPages && (
            <button onClick={() => handlePageChange(pagination.currentPage + 1)}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
 