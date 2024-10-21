import React, { useState, useEffect } from 'react';

const ImageUpload = ({ onImagesSelected }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Use the passed in prop to notify Formik of the selected images
    onImagesSelected(files);
  };

  useEffect(() => {
    // Revoke object URLs to prevent memory leaks
    return () => {
      selectedImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [selectedImages]);

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
        {selectedImages.length > 0 &&
          selectedImages.map((image, index) => (
            <div key={index} style={{ marginRight: '10px' }}>
                <img
                 src={URL.createObjectURL(image)}
                   alt={`Selected ${index + 1}`} // Providing more specific alt text
                  style={{ width: '100px' }}
                 />
              </div> 

          ))}
      </div>
    </div>
  );
};
  

export default ImageUpload;
  