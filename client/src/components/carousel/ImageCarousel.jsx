// src/components/carousel/ImageCarousel.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Slider from 'react-slick';
import '../../styles/ImageCarousel.css'; // Importing the CSS file
  
const ImageCarousel = () => {  
 
  const categoryimage = [
    {
        src: 'https://images-eu.ssl-images-amazon.com/images/G/31/Events/img24/Jupiter24/HERO1/J24_GW_PC_non-prime_RNP--unrec_end-frame_Shop-now_2X_R1._CB562558129_.jpg', 
        alt: 'Books',
        path: '/product/search?query=Books',
      },
      {
        src: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Softlines_JWL_SH_GW_Assets/2024/Jupiter24/Event/Shoes/1/3000_u._CB562459793_.jpg', 
        alt: 'Clothing',
        path: '/product/search?query=Clothing',
      },
    
      {
        src: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/Meghana/V3/D156384865_WLD-Jupiter24_Central-Inputs_Design-SIM-PC_Hero_3000x1200._CB562511220_.jpg', 
        alt: 'Electronics',
        path: '/product/search?query=Electronics',
      },
      {
        src: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG20/Home/2024/Jupiter24/Hero/Event/Comfort-bedsheets-TAG_v1._CB562522425_.jpg', 
        alt: 'Furniture',
        path: '/product/search?query=Furniture',
      },
      {
        src: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/OnePlus/Jupiter24/Event/GW/CE4/1stOct/D161993266_WLD_Jup24_OnePlus_NordCE4_PC_Hero_3000x1200._CB562998229_.jpg940', 
        alt: 'Toys',
        path: '/product/search?query=Toys',
      },
      {
        src: 'https://images-eu.ssl-images-amazon.com/images/G/31/img24/Consumables/Jupiter/GW/Phase1/Cons_Unrec_event_PC_Hero_3000x1200_V2._CB562554030_.jpg', 
        alt: 'Sports',
        path: '/product/search?query=Sports',
      },
        // Add more images as needed
      ];


  const images = [
{
    src: 'https://images.unsplash.com/photo-1616330682546-2468b2d8dd17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJvb2tzfGVufDB8fDB8fHww', 
    alt: 'Books',
    path: '/product/search?query=Books',
  },
  {
    src: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Clothing',
    path: '/product/search?query=Clothing',
  },

  {
    src: 'https://images.unsplash.com/photo-1492140260770-41aec2341f6f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Electronics',
    path: '/product/search?query=Electronics',
  },
  {
    src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Furniture',
    path: '/product/search?query=Furniture',
  },
  {
    src: 'https://images.unsplash.com/photo-1595550903979-1969e5adeb92?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Toys',
    path: '/product/search?query=Toys',
  },
  {
    src: 'https://images.unsplash.com/photo-1510766528597-60f9f1c154b6?q=80&w=2046&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Sports',
    path: '/product/search?query=Sports',
  },
    // Add more images as needed
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Show 1 slide at a time
    slidesToScroll: 1,
    autoplay: true, // Optional: Enable autoplay
    autoplaySpeed: 3000, // Optional: Duration for autoplay
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {categoryimage.map((image, index) => (
          <div key={index} className="carousel-slide">
            <img src={image.src} alt={`Slide ${index}`} className="carousel-image" />
          </div>
        ))}
      </Slider>
      
      <div className="card-container">
        {images.map((image, index) => (
          <div key={index} className="card">
            <Link to={image.path} className="card-link">
              <img src={image.src} alt={image.alt} className="card-image" />
              <h3>{image.alt}</h3> {/* Optional: Add a title or description */}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
