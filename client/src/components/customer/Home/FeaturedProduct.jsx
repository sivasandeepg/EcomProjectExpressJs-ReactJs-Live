import React from 'react';
import '../../../styles/FeaturedProduct.css'; // Import your styles

const FeaturedProduct = ({ products }) => {
  const handleCardClick = (id) => {
    // Redirect to product details page
    window.location.href = `/product/${id}`; // Update the path according to your routing
  };

  return (
    <div className="featured-product-container">
      <h2>Featured Products</h2>
      <div className="scroll-wrapper">
        <button className="scroll-arrow left" onClick={() => document.querySelector('.product-list').scrollBy({ left: -200, behavior: 'smooth' })}>
          &#10094; {/* Left Arrow */}
        </button>
        <div className="product-list">
          {products.map(product => (
            <div key={product._id} className="product-card" onClick={() => handleCardClick(product._id)}>
              <img src={product.imageUrls[0]} alt={product.name} className="product-image" />
              <div className="product-details">
                <h3>{product.name}</h3>
                <div className="product-price">${product.price}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="scroll-arrow right" onClick={() => document.querySelector('.product-list').scrollBy({ left: 200, behavior: 'smooth' })}>
          &#10095; {/* Right Arrow */}
        </button>
      </div>
    </div>
  );
};

export default FeaturedProduct;
 