// src/components/layout/NotificationBell.jsx
import { useState, useRef, useEffect } from 'react';
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../api/notificationApi';
import bell_gif from '../../assets/bell.gif';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Poll unread count periodically, independent of the dropdown being open.
  useEffect(() => {
    let ignore = false;

    async function fetchCount() {
      try {
        const res = await getUnreadCount();
        if (!ignore) setUnreadCount(res.data.count);
      } catch {
        // Non-critical — badge just won't update this cycle.
      }
    }

    fetchCount();
    const interval = setInterval(fetchCount, 60000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = async () => {
    const willOpen = !open;
    setOpen(willOpen);

    if (willOpen) {
      setLoading(true);
      try {
        const res = await getMyNotifications(0, 10);
        setNotifications(res.data.content);
      } catch {
        // Leave list empty on failure.
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Leave as-is; next open resyncs.
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Leave as-is.
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative hover:text-brand-pink transition-colors"
      >
        <img src={bell_gif} alt="Notifications" className="h-10 w-10 object-contain" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-800 text-sm">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-brand-pink font-semibold hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-400 text-sm py-6">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-6">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                    !n.read ? 'bg-pink-50/40' : ''
                  }`}
                >
                  <p className="text-sm text-gray-700">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}