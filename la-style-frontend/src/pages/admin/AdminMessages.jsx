// src/pages/admin/AdminMessages.jsx
import { useState, useEffect } from 'react';
import { getAllContactMessages, markContactMessageAsRead } from '../../api/contactApi';
import AdminLayout from '../../components/admin/AdminLayout';
import Pagination from '../../components/product/Pagination';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingId, setMarkingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await getAllContactMessages(page, 20);
        if (!ignore) {
          setMessages(res.data.content);
          setTotalPages(res.data.totalPages);
        }
      } catch {
        if (!ignore) setError('Failed to load messages.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [page]);

  const handleMarkRead = async (id) => {
    setMarkingId(id);
    try {
      const res = await markContactMessageAsRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? res.data : m)));
    } catch {
      setError('Could not update message.');
    } finally {
      setMarkingId(null);
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

          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No messages yet.</p>
          ) : (
            <>
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-white rounded-2xl shadow-sm p-5 ${!msg.read ? 'border-l-4 border-brand-pink' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{msg.name}</p>
                        <p className="text-sm text-gray-500">{msg.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </p>
                        {!msg.read && (
                          <button
                            onClick={() => handleMarkRead(msg.id)}
                            disabled={markingId === msg.id}
                            className="text-xs text-brand-pink font-semibold hover:underline mt-1 disabled:opacity-50"
                          >
                            {markingId === msg.id ? 'Marking...' : 'Mark as read'}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
                  </div>
                ))}
              </div>

              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}
    </AdminLayout>
  );
}