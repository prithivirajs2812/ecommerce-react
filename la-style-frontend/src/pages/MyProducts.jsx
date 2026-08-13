// src/pages/MyProducts.jsx
import { useState, useEffect } from 'react';
import { getMyProducts, createProduct, updateProduct, deleteProduct } from '../api/productApi';
import { getAllCategories } from '../api/categoryApi';
import ProductForm from '../components/seller/ProductForm';
import Pagination from '../components/product/Pagination';

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getMyProducts(page, 20),
          getAllCategories(),
        ]);
        if (!ignore) {
          setProducts(productsRes.data.content);
          setTotalPages(productsRes.data.totalPages);
          setCategories(categoriesRes.data);
        }
      } catch {
        if (!ignore) setError('Failed to load your products. Please try again.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [page]);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await createProduct(data);
      }
      setShowForm(false);
      setEditingProduct(null);

      const res = await getMyProducts(page, 20);
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    setDeletingId(productId);
    setError('');
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center text-gray-400">
        Loading your products...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-[800] text-3xl text-brand-deep">My Products</h1>
        {!showForm && (
          <button
            onClick={handleCreate}
            className="bg-brand-pink hover:bg-pink-600 transition-colors text-white font-semibold px-5 py-2.5 rounded-lg text-sm"
          >
            + Add Product
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8">
          <ProductForm
            initialValue={editingProduct}
            categories={categories}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-20">
          You haven't listed any products yet.
        </p>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="py-3 px-6 font-medium">Product</th>
                  <th className="py-3 px-6 font-medium">Category</th>
                  <th className="py-3 px-6 font-medium text-right">Price</th>
                  <th className="py-3 px-6 font-medium text-right">Stock</th>
                  <th className="py-3 px-6 font-medium text-right">Discount</th>
                  <th className="py-3 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="py-3 px-6 font-medium text-gray-800">{product.title}</td>
                    <td className="py-3 px-6 text-gray-500">{product.categoryName}</td>
                    <td className="py-3 px-6 text-right text-gray-800">₹{product.price}</td>
                    <td className="py-3 px-6 text-right">
                      <span className={product.stock === 0 ? 'text-red-500 font-medium' : 'text-gray-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      {product.discountPercent > 0 ? (
                        <span className="text-brand-pink font-semibold">
                          {product.discountPercent}% OFF
                        </span>
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-brand-pink font-semibold hover:underline mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="text-gray-500 hover:text-red-500 disabled:opacity-50"
                      >
                        {deletingId === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}