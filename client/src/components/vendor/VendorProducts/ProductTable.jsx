import React from 'react';
import '../../../styles/ProductTable.css'; // Import your CSS file

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div>
      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>New Arrival</th>
            <th>Trending</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stockQuantity}</td>
                <td>{product.isNewArrival ? 'Yes' : 'No'}</td>
                <td>{product.isTrending ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => onEdit(product)}>Edit</button>
                  <button onClick={() => onDelete(product._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No products available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
 