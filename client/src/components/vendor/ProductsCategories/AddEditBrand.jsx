import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, CircularProgress, Snackbar } from '@mui/material';
import { productService } from '../../../services/vendor/VendorProductService';
 
const AddEditBrand = () => {
  const [name, setName] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (categoryId) {
        setLoadingSubcategories(true);
        try {
          const data = await productService.getSubcategories(categoryId);
          setSubcategories(data);
        } catch (error) {
          console.error('Failed to fetch subcategories:', error);
        } finally {
          setLoadingSubcategories(false);
        }
      } else {
        setSubcategories([]);
      }
    };
    fetchSubcategories();
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !subcategoryId) {
      setErrorMessage('Brand name and subcategory are required.');
      return;
    }

    setIsSubmitting(true);
    const newBrand = { name, subcategory: subcategoryId };

    try {
      await productService.addBrand(newBrand);
      setSuccessMessage('Brand added successfully!');
      setName('');
      setSubcategoryId('');
    } catch (error) {
      console.error('Failed to add brand:', error);
      setErrorMessage('Failed to add brand. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Brand Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
      />
      {loadingCategories ? (
        <CircularProgress size={24} /> 
      ) : (
        <TextField
          select
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          fullWidth
          required
        >
          <MenuItem value="">
            <em>Select Category</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      )}
      <TextField
        select
        label="Subcategory"
        value={subcategoryId}
        onChange={(e) => setSubcategoryId(e.target.value)}
        fullWidth
        required
        disabled={!categoryId || loadingSubcategories}
      >
        <MenuItem value="">
          <em>Select Subcategory</em>
        </MenuItem>
        {loadingSubcategories ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          subcategories.map((subcategory) => (
            <MenuItem key={subcategory._id} value={subcategory._id}>
              {subcategory.name}
            </MenuItem>
          ))
        )}
      </TextField>
      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
        {isSubmitting ? <CircularProgress size={24} /> : 'Add Brand'}
      </Button>

      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage || errorMessage}
      />
    </form>
  );
};

export default AddEditBrand;
 