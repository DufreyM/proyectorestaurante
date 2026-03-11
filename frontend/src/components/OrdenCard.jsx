import { cancelarOrden, deleteOrden } from '../services/ordenes'

const estadoColors = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  procesando: 'bg-blue-100 text-blue-700',
  completado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
}

export default function OrdenCard({ orden, onRefresh }) {
  const handleCancelar = async () => {
    if (!confirm('¿Cancelar esta orden?')) return
    try {
      await cancelarOrden(orden._id)
      onRefresh()
    } catch {
      alert('Error al cancelar la orden')
    }
  }

  const handleEliminar = async () => {
    if (!confirm('¿Eliminar esta orden permanentemente?')) return
    try {
      await deleteOrden(orden._id)
      onRefresh()
    } catch {
      alert('Error al eliminar la orden')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-400 font-mono">#{orden._id?.slice(-6)}</p>
          <p className="text-sm text-gray-500">{orden.fecha ? new Date(orden.fecha).toLocaleDateString() : '—'}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoColors[orden.estado] || 'bg-gray-100 text-gray-600'}`}>
          {orden.estado}
        </span>
      </div>

      <div className="text-sm text-gray-700 divide-y divide-gray-50">
        {orden.items?.map((item, i) => (
          <div key={i} className="flex justify-between py-1">
            <span>{item.nombre} <span className="text-gray-400">x{item.cantidad}</span></span>
            <span>${item.subtotal?.toFixed(2) ?? (item.precio_unitario * item.cantidad).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-1">
        <span className="font-bold text-gray-800">${orden.total?.toFixed(2) ?? '—'}</span>
        <div className="flex gap-2">
          {orden.estado !== 'cancelado' && orden.estado !== 'completado' && (
            <button onClick={handleCancelar}
              className="text-xs px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-medium">
              Cancelar
            </button>
          )}
          <button onClick={handleEliminar}
            className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
