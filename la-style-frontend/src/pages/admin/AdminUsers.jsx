// src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from 'react';
import { getAllUsers, banUser, unbanUser } from '../../api/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import Pagination from '../../components/product/Pagination';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await getAllUsers(page, 20);
        if (!ignore) {
          setUsers(res.data.content);
          setTotalPages(res.data.totalPages);
        }
      } catch {
        if (!ignore) setError('Failed to load users.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [page]);

  const handleToggleBan = async (user) => {
    setActingId(user.id);
    setError('');
    try {
      const res = user.enabled ? await banUser(user.id) : await unbanUser(user.id);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update user status.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <AdminLayout>
      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading...</div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="py-3 px-6 font-medium">Name</th>
                  <th className="py-3 px-6 font-medium">Email</th>
                  <th className="py-3 px-6 font-medium">Roles</th>
                  <th className="py-3 px-6 font-medium">Status</th>
                  <th className="py-3 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 px-6 font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="py-3 px-6 text-gray-600">{user.email}</td>
                    <td className="py-3 px-6 text-gray-500 text-xs">
                      {user.roles.map((r) => r.replace('ROLE_', '')).join(', ')}
                    </td>
                    <td className="py-3 px-6">
                      <span className={user.enabled ? 'text-green-600' : 'text-red-500'}>
                        {user.enabled ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      {!user.roles.includes('ROLE_ADMIN') && (
                        <button
                          onClick={() => handleToggleBan(user)}
                          disabled={actingId === user.id}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            user.enabled ? 'text-red-500' : 'text-green-600'
                          }`}
                        >
                          {actingId === user.id ? 'Updating...' : user.enabled ? 'Ban' : 'Unban'}
                        </button>
                      )}
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