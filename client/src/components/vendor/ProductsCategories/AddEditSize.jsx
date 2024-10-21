import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Snackbar, List, ListItem, Chip } from '@mui/material';
import { productService } from '../../../services/vendor/VendorProductService';

const AddEditSize = () => {
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New success message state
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setErrorMessage('Failed to fetch categories. Please try again.');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (categoryId) {
        try {
          const data = await productService.getSubcategories(categoryId);
          setSubcategories(data);
        } catch (error) {
          console.error('Failed to fetch subcategories:', error);
          setErrorMessage('Failed to fetch subcategories. Please try again.');
        }
      } else {
        setSubcategories([]);
      }
    };
    fetchSubcategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchBrands = async () => {
      if (subcategoryId) {
        try {
          const data = await productService.getBrands(subcategoryId);
          setBrands(data);
        } catch (error) {
          console.error('Failed to fetch brands:', error);
          setErrorMessage('Failed to fetch brands. Please try again.');
        }
      } else {
        setBrands([]);
      }
    };
    fetchBrands();
  }, [subcategoryId]);

  useEffect(() => {
    const fetchModels = async () => {
      if (brandId) {
        try {
          const data = await productService.getModels(brandId);
          setModels(data);
        } catch (error) {
          console.error('Failed to fetch models:', error);
          setErrorMessage('Failed to fetch models. Please try again.');
        }
      } else {
        setModels([]);
      }
    };
    fetchModels();
  }, [brandId]);

  const handleSizeInputChange = (e) => {
    setSizeInput(e.target.value);
  };

  const handleAddSizes = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newSizes = sizeInput.split(/[, ]+/).map(size => size.trim()).filter(size => size);
      setSizes(prevSizes => [...new Set([...prevSizes, ...newSizes])]);
      setSizeInput('');
    }
  };

  const handleSaveAllSizes = async () => {
    if (!modelId) {
      setErrorMessage('Please select a model before saving sizes.');
      return;
    }
    setLoading(true);
    try {
      await productService.addSize({ sizes: sizes.map(size => ({ name: size, model: modelId })) });
      setSizes([]);
      setSuccessMessage('Sizes saved successfully!'); // Set success message
    } catch (error) {
      console.error('Failed to save sizes:', error);
      setErrorMessage('Failed to save sizes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setErrorMessage('');
    setSuccessMessage(''); // Clear success message
  };

  return (
    <form>
      <TextField
        select
        label="Category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        fullWidth
        required
      >
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
      >
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
      >
        {brands.map((brand) => (
          <MenuItem key={brand._id} value={brand._id}>
            {brand.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Model"
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
        fullWidth
        required
      >
        {models.map((model) => (
          <MenuItem key={model._id} value={model._id}>
            {model.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Size (press Enter or use comma to add)"
        variant="outlined"
        value={sizeInput}
        onChange={handleSizeInputChange}
        onKeyDown={handleAddSizes}
        fullWidth
        required
      />

      <List>
        {sizes.map((size, index) => (
          <ListItem key={index}>
            <Chip label={size} onDelete={() => setSizes(sizes.filter((s) => s !== size))} />
          </ListItem>
        ))}
      </List>

      <Button variant="contained" color="secondary" onClick={handleSaveAllSizes} disabled={loading}>
        {loading ? 'Saving...' : 'Save Sizes'}
      </Button>

      <Snackbar
        open={Boolean(errorMessage) || Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={errorMessage || successMessage}
      />
    </form>
  );
};

export default AddEditSize;
 