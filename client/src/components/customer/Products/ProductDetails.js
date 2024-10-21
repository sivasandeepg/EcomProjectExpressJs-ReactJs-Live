// Existing imports...
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../../../services/customer/ProductServices';
import { addToCart } from '../../../services/customer/CartService'; 
import '../../../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
  });

  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [vendorId, setVendorId] = useState(0);  
   
  const hasImages = data && Array.isArray(data.imageUrls) && data.imageUrls.length > 0;

  useEffect(() => {
    if (data && data.vendor) {
      setVendorId(data.vendor._id); // Set vendor ID from the product data
    }
  }, [data]);

  const handleNext = useCallback(() => {
    if (hasImages) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.imageUrls.length);
    }
  }, [hasImages, data]);

  const handlePrev = () => {
    if (hasImages) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? data.imageUrls.length - 1 : prevIndex - 1
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 3000);
    return () => clearInterval(interval);
  }, [handleNext]);
  
  const handleAddToCart = async () => {
    try {
      console.log('Adding to cart with:', { id, vendorId, quantity });
      const updatedCart = await addToCart(id, vendorId, quantity); // Pass vendorId to addToCart
      console.log('Cart updated:', updatedCart);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      alert('Failed to add product to cart - product details page.');
    }
  };
   
 
  if (isLoading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">Error loading product: {error.message}</div>;
  if (!data) return <div className="error">Product not found.</div>;

  return (
    <div className="product-details-container">
      <div className="product-images">
        {hasImages && (
          <>
            <div className="main-image-container">
              <button className="arrow left" onClick={handlePrev}>
                &#9664;
              </button>
              <img src={data.imageUrls[currentIndex]} alt={data.name} />
              <button className="arrow right" onClick={handleNext}>
                &#9654;
              </button>
            </div>

            <div className="additional-images">
              {data.imageUrls.map((url, index) => (
                <div
                  key={index}
                  className={`additional-image-card ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img src={url} alt={`${data.name} - ${index}`} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="product-info">
        <h1>{data.name}</h1>
        <p>{data.description}</p>
        <p className="price">Price: ₹{data.price}</p>

        {/* New Information */}
        {data.brand && <p>Brand: {data.brand.name}</p>} 
        {data.subcategory && <p>Subcategory: {data.subcategory.name}</p>} 
        {data.model && <p>Model: {data.model}</p>}
        {data.vendor && <p>Vendor: {data.vendor.storeName}</p>}

        <div className="quantity-selection">
          <h4>Quantity:</h4>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <button className="add-to-cart" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
 