import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem } from '@mui/material';
import { productService } from '../../../services/vendor/VendorProductService';

const AddEditSubcategory = () => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        console.log('API response:', data); // Log the full response to verify
        setCategories(data || []); // Set categories directly from the response
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);
   

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSubcategory = { name, category: categoryId };
    await productService.addSubcategory(newSubcategory); // API call for adding subcategory
    setName('');
    setCategoryId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Subcategory Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
      />
      <TextField
        select
        label="Category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}  // Ensure category ID updates correctly
        fullWidth
        required
      >
        {categories.length > 0 ? (
          categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No categories available</MenuItem>
        )}
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Add Subcategory
      </Button>
    </form>
  );
};

export default AddEditSubcategory;
 