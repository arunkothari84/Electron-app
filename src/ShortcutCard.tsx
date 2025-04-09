export default function ShortcutCard({ keys, action }) {
  return (
    <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl shadow-md hover:bg-gray-700 transition duration-200 ease-in-out">
      <div className="text-yellow-300 font-mono text-sm mb-1">{keys}</div>
      <div className="text-white text-lg">{action}</div>
    </div>
  );
}
