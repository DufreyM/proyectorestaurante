import { useEffect, useState } from 'react'
import { getUsuarios, createUsuario, bulkUsuarios } from '../services/usuarios'

const emptyForm = { nombre: '', correo: '', direccion: '', roles: '' }

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)

  const cargar = () => {
    setLoading(true)
    getUsuarios()
      .then((r) => setUsuarios(r.data || []))
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      nombre: form.nombre,
      correo: form.correo,
      direccion: form.direccion,
      roles: form.roles.split(',').map((r) => r.trim()).filter(Boolean),
    }
    try {
      await createUsuario(payload)
      setShowForm(false)
      setForm(emptyForm)
      cargar()
    } catch {
      alert('Error al crear usuario')
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              if (!confirm('¿Cargar usuarios de demo (bulk insert)?')) return
              try { await bulkUsuarios(); cargar() } catch { alert('Error en bulk insert') }
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
          >
            Cargar Demo
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700"
          >
            {showForm ? 'Cancelar' : '+ Nuevo'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input required type="email" placeholder="Correo" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input placeholder="Roles (separados por coma)" value={form.roles} onChange={(e) => setForm({ ...form, roles: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <button type="submit" className="md:col-span-2 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 text-sm">
            Guardar Usuario
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : usuarios.length === 0 ? (
        <p className="text-gray-400">No hay usuarios registrados.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Correo</th>
                <th className="px-4 py-3 text-left">Dirección</th>
                <th className="px-4 py-3 text-left">Roles</th>
                <th className="px-4 py-3 text-left">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.nombre}</td>
                  <td className="px-4 py-3 text-gray-500">{u.correo}</td>
                  <td className="px-4 py-3 text-gray-500">{u.direccion || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles?.map((r) => (
                        <span key={r} className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">{r}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(u.fecha_registro).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
