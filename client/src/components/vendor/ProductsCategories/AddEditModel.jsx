import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem } from '@mui/material';
import { productService } from '../../../services/vendor/VendorProductService'; 

const AddEditModel = () => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState('');
  const [brands, setBrands] = useState([]);
  const [brandId, setBrandId] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories(); // Fetch categories
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (categoryId) {
        try {
          const data = await productService.getSubcategories(categoryId);
          setSubcategories(data);
        } catch (error) {
          console.error('Failed to fetch subcategories:', error);
        }
      } else {
        setSubcategories([]); // Clear subcategories if no category is selected
      }
    };
    fetchSubcategories();
  }, [categoryId]);

  // Fetch brands when a subcategory is selected
  useEffect(() => {
    const fetchBrands = async () => {
      if (subcategoryId) {
        try {
          const data = await productService.getBrands(subcategoryId); // Fetch brands for the selected subcategory
          setBrands(data);
        } catch (error) {
          console.error('Failed to fetch brands:', error);
        }
      } else {
        setBrands([]); // Clear brands if no subcategory is selected
      }
    };
    fetchBrands();
  }, [subcategoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newModel = { name, brand: brandId };
    try {
      await productService.addModel(newModel); // API call for adding model
      setName('');
      setBrandId('');
      setCategoryId('');
      setSubcategoryId('');
    } catch (error) {
      console.error('Failed to add model:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Model Name"
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
      <TextField
        select
        label="Subcategory"
        value={subcategoryId}
        onChange={(e) => setSubcategoryId(e.target.value)}
        fullWidth
        required
        disabled={!categoryId}
      >
        <MenuItem value="">
          <em>Select Subcategory</em>
        </MenuItem>
        {subcategories.map((subcategory) => (
          <MenuItem key={subcategory._id} value={subcategory._id}>
            {subcategory.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Brand"
        value={brandId}
        onChange={(e) => setBrandId(e.target.value)}
        fullWidth
        required
        disabled={!subcategoryId}
      >
        <MenuItem value="">
          <em>Select Brand</em>
        </MenuItem>
        {brands.map((brand) => (
          <MenuItem key={brand._id} value={brand._id}>
            {brand.name}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Add Model
      </Button>
    </form>
  );
};

export default AddEditModel;
  