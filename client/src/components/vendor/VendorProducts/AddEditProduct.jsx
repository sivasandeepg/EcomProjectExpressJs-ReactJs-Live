import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { productService as vendorProductService } from '../../../services/vendor/VendorProductService'; 
import ImageUpload from '../../imageupload/ImageUpload'; 
import '../../../styles/AddEditProduct.css';
import { toast } from 'react-toastify';

const AddEditProduct = () => {
  const { id } = useParams(); // For determining if adding or editing
  const navigate = useNavigate();


  const [vendorId, setVendorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    brand: '',
    model: '',
    size: '',
    price: '',
    description: '',
    stockQuantity: '',
    productFeatures: '',
    discount: '',
    sku: '',
    color: '#000000', // Default color
    availability: true,
    isNewArrival: false,
    isTrending: false,
    images: []
  });

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    category: Yup.string().required('Category is required'),
    subcategory: Yup.string().required('Subcategory is required'),
    brand: Yup.string().required('Brand is required'),
    model: Yup.string().required('Model is required'),
    size: Yup.string().required('Size is required'),
    price: Yup.number().positive('Price must be greater than 0').required('Price is required'),
    description: Yup.string(),
    stockQuantity: Yup.number().required('Stock Quantity is required'),
    productFeatures: Yup.string().required('Product Features are required'),
    sku: Yup.string().required('SKU is required'),
    discount: Yup.number().min(0, 'Discount cannot be negative'),
    availability: Yup.boolean(),
    isNewArrival: Yup.boolean(),
    isTrending: Yup.boolean(),
    color: Yup.string().required('Color is required')
  });

  // Fetch vendor ID
  useEffect(() => {
    const fetchVendorId = async () => {
      try {
        const vendorData = JSON.parse(localStorage.getItem('vendor'));
        setVendorId(vendorData.id); 
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch vendor ID');
        setLoading(false);
      }
    };
    fetchVendorId();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await vendorProductService.getCategories();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories based on category
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (categoryId) {
        try {
          const data = await vendorProductService.getSubcategories(categoryId);
          setSubcategories(data);
        } catch (error) {
          toast.error('Failed to fetch subcategories');
        }
      }
    };
    fetchSubcategories();
  }, [categoryId]);

  // Fetch brands based on subcategory
  useEffect(() => {
    const fetchBrands = async () => {
      if (subcategoryId) {
        try {
          const data = await vendorProductService.getBrands(subcategoryId);
          setBrands(data);
        } catch (error) {
          toast.error('Failed to fetch brands');
        }
      }
    };
    fetchBrands();
  }, [subcategoryId]);

  // Fetch product details if in edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const product = await vendorProductService.getProductById(id);
          setFormData({
            ...product,
            images: [], // Clear images for upload
            color: product.color || '#000000', // Default color if not set
            availability: product.availability || true,
            isNewArrival: product.isNewArrival || false,
            isTrending: product.isTrending || false
          });
          setCategoryId(product.category);
          setSubcategoryId(product.subcategory);
        } catch (error) {
          toast.error('Failed to fetch product details');
        }
      }
    };
    fetchProduct();
  }, [id]);
 
  // Handle form submission for add/edit product
  const handleSubmit = async (values) => {
    try {
      const formDataToSubmit = new FormData();
      Object.keys(values).forEach(key => {
        if (key !== 'images') {
          formDataToSubmit.append(key, values[key]);
        }
      });
  
      values.images.forEach(image => {
        formDataToSubmit.append('images', image);
      });
  
      formDataToSubmit.append('vendor', vendorId);
  
      if (id) {
        await vendorProductService.updateProduct(id, formDataToSubmit);
        toast.success('Product updated successfully');
      } else {
        await vendorProductService.addProduct(formDataToSubmit);
        toast.success('Product added successfully');
      }
  
      navigate('/vendor/manage-products');
    } catch (error) {
      // Display the error message from the backend
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to save product');
      }
    }
  };
    

  // Handle product deletion
  const handleDelete = async () => {
    try {
      if (window.confirm('Are you sure you want to delete this product?')) {
        await vendorProductService.deleteProduct(id);
        toast.success('Product deleted successfully');
        navigate('/vendor/manage-products');
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="form-container">
      <h2>{id ? 'Edit' : 'Add'} Product</h2>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize // Allows the form to update with new initialValues
      >
        {({ setFieldValue, values }) => (
          <Form>
            {/* Product Name */}
            <div className="form-group">
              <Field name="name" placeholder="Name" />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>

            {/* Category Dropdown */}
            <div className="form-group">
              <Field
                as="select"
                name="category"
                onChange={e => {
                  setCategoryId(e.target.value);
                  setFieldValue('category', e.target.value);
                }}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" className="error-message" />
            </div>

            {/* Subcategory Dropdown */}
            <div className="form-group">
              <Field
                as="select"
                name="subcategory"
                onChange={e => {
                  setSubcategoryId(e.target.value);
                  setFieldValue('subcategory', e.target.value);
                }}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map(subcategory => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="subcategory" component="div" className="error-message" />
            </div>

            {/* Brand Dropdown */}
            <div className="form-group">
              <Field
                as="select"
                name="brand"
                onChange={e => setFieldValue('brand', e.target.value)}
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="brand" component="div" className="error-message" />
            </div>

            {/* Model Input */}
            <div className="form-group">
              <Field name="model" placeholder="Model" />
              <ErrorMessage name="model" component="div" className="error-message" />
            </div>

            {/* Size Input */}
            <div className="form-group">
              <Field name="size" placeholder="Size" />
              <ErrorMessage name="size" component="div" className="error-message" />
            </div>

            {/* Color Picker */}
            <div className="form-group">
              <label htmlFor="color">Select Color:</label>
              <Field name="color" type="color" />
              <ErrorMessage name="color" component="div" className="error-message" />
            </div>

            {/* Availability Checkbox */}
            <div className="form-group">
              <label>
                <Field type="checkbox" name="availability" />
                Available
              </label>
            </div>

            {/* New Arrival Checkbox */}
            <div className="form-group">
              <label>
                <Field type="checkbox" name="isNewArrival" />
                New Arrival
              </label>
            </div>

            {/* Trending Checkbox */}
            <div className="form-group">
              <label>
                <Field type="checkbox" name="isTrending" />
                Trending
              </label>
            </div>

            {/* Description */}
            <div className="form-group">
              <Field name="description" as="textarea" placeholder="Description" />
              <ErrorMessage name="description" component="div" className="error-message" />
            </div>

            {/* Stock Quantity */}
            <div className="form-group">
              <Field name="stockQuantity" placeholder="Stock Quantity" />
              <ErrorMessage name="stockQuantity" component="div" className="error-message" />
            </div>

            {/* Discount */}
            <div className="form-group">
              <Field name="discount" placeholder="Discount" />
              <ErrorMessage name="discount" component="div" className="error-message" />
            </div>

            {/* SKU */}
            <div className="form-group">
              <Field name="sku" placeholder="SKU" />
              <ErrorMessage name="sku" component="div" className="error-message" />
            </div>

            {/* Price */}
            <div className="form-group">
              <Field name="price" placeholder="Price" />
              <ErrorMessage name="price" component="div" className="error-message" />
            </div>

            {/* Features */}
            <div className="form-group">
              <Field name="productFeatures" placeholder="Features" />
              <ErrorMessage name="productFeatures" component="div" className="error-message" />
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <ImageUpload
                onImagesSelected={files => setFieldValue('images', files)}
                currentImages={formData.images}
              />
            </div>

            {/* Submit Button */}
            <button type="submit">{id ? 'Update Product' : 'Add Product'}</button>

            {/* Delete Button (visible only in edit mode) */}
            {id && <button type="button" onClick={handleDelete}>Delete Product</button>}
          </Form>
        )}
      </Formik>
    </div>
  );
};
    
export default AddEditProduct;
 