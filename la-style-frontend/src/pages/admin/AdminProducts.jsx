// src/pages/admin/AdminProducts.jsx
import { useState, useEffect } from 'react';
import { getAllProducts, searchProducts, updateProduct, deleteProduct } from '../../api/productApi';
import { getAllCategories } from '../../api/categoryApi';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductForm from '../../components/seller/ProductForm';
import Pagination from '../../components/product/Pagination';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [keyword, setKeyword] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');

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
          activeKeyword ? searchProducts(activeKeyword, page, 20) : getAllProducts(page, 20),
          getAllCategories(),
        ]);
        if (!ignore) {
          setProducts(productsRes.data.content);
          setTotalPages(productsRes.data.totalPages);
          setCategories(categoriesRes.data);
        }
      } catch {
        if (!ignore) setError('Failed to load products.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [page, activeKeyword]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setActiveKeyword(keyword.trim());
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await updateProduct(editingProduct.id, data);
      setProducts((prev) => prev.map((p) => (p.id === res.data.id ? res.data : p)));
      setEditingProduct(null);
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

  return (
    <AdminLayout>
      <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-6">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search products by title..."
          className="flex-1 max-w-sm border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
        <button
          type="submit"
          className="bg-brand-deep text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-deep/90 transition-colors"
        >
          Search
        </button>
        {activeKeyword && (
          <button
            type="button"
            onClick={() => {
              setKeyword('');
              setActiveKeyword('');
              setPage(0);
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        )}
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
      )}

      {editingProduct && (
        <div className="mb-8">
          <ProductForm
            initialValue={editingProduct}
            categories={categories}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading...</div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No products found.</p>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="py-3 px-6 font-medium">Product</th>
                  <th className="py-3 px-6 font-medium">Seller</th>
                  <th className="py-3 px-6 font-medium">Category</th>
                  <th className="py-3 px-6 font-medium text-right">Price</th>
                  <th className="py-3 px-6 font-medium text-right">Stock</th>
                  <th className="py-3 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="py-3 px-6 font-medium text-gray-800">{product.title}</td>
                    <td className="py-3 px-6 text-gray-500">{product.sellerName}</td>
                    <td className="py-3 px-6 text-gray-500">{product.categoryName}</td>
                    <td className="py-3 px-6 text-right text-gray-800">₹{product.price}</td>
                    <td className="py-3 px-6 text-right">
                      <span className={product.stock === 0 ? 'text-red-500 font-medium' : 'text-gray-600'}>
                        {product.stock}
                      </span>
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
    </AdminLayout>
  );
}
