import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { productService } from '../../../services/vendor/VendorProductService';

const AddEditCategory = () => {
  const [name, setName] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCategory = { name };
    
    try {
      await productService.addCategory(newCategory);
      setName(''); // Clear the input field after success
    } catch (error) {
      console.error("Error adding category:", error);
      // You can also show a user-friendly message here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Category Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Add Category
      </Button>
    </form>
  );
};

export default AddEditCategory;
 