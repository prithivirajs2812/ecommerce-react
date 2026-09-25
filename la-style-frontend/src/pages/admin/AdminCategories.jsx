// src/pages/admin/AdminCategories.jsx
import { useState, useEffect } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoryApi';
import AdminLayout from '../../components/admin/AdminLayout';
import CategoryForm from '../../components/admin/CategoryForm';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await getAllCategories();
        if (!ignore) setCategories(res.data);
      } catch {
        if (!ignore) setError('Failed to load categories.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingCategory) {
        const res = await updateCategory(editingCategory.id, data);
        setCategories((prev) => prev.map((c) => (c.id === res.data.id ? res.data : c)));
      } else {
        const res = await createCategory(data);
        setCategories((prev) => [...prev, res.data]);
      }
      setShowForm(false);
      setEditingCategory(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    setDeletingId(categoryId);
    setError('');
    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch (err) {
      // Backend rejects deletion of categories that still have products —
      // surface that message directly since it tells the admin exactly what to do.
      setError(err.response?.data?.message || 'Could not delete category.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading...</div>
      ) : (
        <>
          <div className="flex justify-end mb-6">
            {!showForm && (
              <button
                onClick={handleCreate}
                className="bg-brand-pink hover:bg-pink-600 transition-colors text-white font-semibold px-5 py-2.5 rounded-lg text-sm"
              >
                + New Category
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          {showForm && (
            <div className="mb-8">
              <CategoryForm
                initialValue={editingCategory}
                submitting={submitting}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                }}
              />
            </div>
          )}

          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No categories created yet.</p>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="py-3 px-6 font-medium">Name</th>
                    <th className="py-3 px-6 font-medium">Products</th>
                    <th className="py-3 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="py-3 px-6 font-medium text-gray-800">{category.name}</td>
                      <td className="py-3 px-6 text-gray-600">{category.productCount}</td>
                      <td className="py-3 px-6 text-right">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-brand-pink font-semibold hover:underline mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          disabled={deletingId === category.id}
                          className="text-gray-500 hover:text-red-500 disabled:opacity-50"
                        >
                          {deletingId === category.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
