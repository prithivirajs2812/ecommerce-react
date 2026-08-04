// src/components/admin/NotAdminFallback.jsx
export default function NotAdminFallback() {
  return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">
        You don't have permission to view this page.
      </p>
    </div>
  );
}