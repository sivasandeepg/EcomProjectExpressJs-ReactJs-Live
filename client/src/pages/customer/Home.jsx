import React, { useEffect, useState } from 'react';
import '../../styles/Home.css';
import ImageCarousel from '../../components/carousel/ImageCarousel';
import FeaturedProduct from '../../components/customer/Home/FeaturedProduct';
import { getProducts } from '../../services/customer/ProductServices';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products when the component loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts(); // Fetch products from the service
        setFeaturedProducts(response.products); // Assuming products are returned in the response
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <ImageCarousel />
      <div className="home-card">
        {/* Pass the fetched products as props to FeaturedProduct */}
        <FeaturedProduct products={featuredProducts} />
      </div>
    </div>
  );
};

export default Home;
 