import { useEffect, useState } from 'react'
import { getRestaurantes, createRestaurante, getRestaurantesCercanos } from '../services/restaurantes'
import RestauranteCard from '../components/RestauranteCard'

const emptyForm = {
  nombre: '', descripcion: '', categorias: '', estado: 'activo',
  lat: '', lng: '',
}

export default function Restaurantes() {
  const [restaurantes, setRestaurantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [busqueda, setBusqueda] = useState({ lat: '', lng: '', dist: '1000' })
  const [error, setError] = useState(null)

  const cargar = () => {
    setLoading(true)
    getRestaurantes()
      .then((r) => setRestaurantes(r.data || []))
      .catch(() => setError('Error al cargar restaurantes'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      categorias: form.categorias.split(',').map((c) => c.trim()).filter(Boolean),
      estado: form.estado,
      ubicacion: {
        type: 'Point',
        coordinates: [parseFloat(form.lng), parseFloat(form.lat)],
      },
    }
    try {
      await createRestaurante(payload)
      setShowForm(false)
      setForm(emptyForm)
      cargar()
    } catch {
      alert('Error al crear restaurante')
    }
  }

  const handleBuscarCercanos = async (e) => {
    e.preventDefault()
    try {
      const r = await getRestaurantesCercanos(busqueda.lat, busqueda.lng, busqueda.dist)
      setRestaurantes(r.data || [])
    } catch {
      alert('Error en búsqueda por cercanía')
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Restaurantes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo'}
        </button>
      </div>

      {/* Formulario nuevo restaurante */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input placeholder="Categorías (separadas por coma)" value={form.categorias} onChange={(e) => setForm({ ...form, categorias: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <input placeholder="Latitud" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input placeholder="Longitud" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <button type="submit" className="md:col-span-2 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 text-sm">
            Guardar Restaurante
          </button>
        </form>
      )}

      {/* Búsqueda por cercanía */}
      <form onSubmit={handleBuscarCercanos} className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Latitud</label>
          <input value={busqueda.lat} onChange={(e) => setBusqueda({ ...busqueda, lat: e.target.value })}
            placeholder="19.4326" className="border rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Longitud</label>
          <input value={busqueda.lng} onChange={(e) => setBusqueda({ ...busqueda, lng: e.target.value })}
            placeholder="-99.1332" className="border rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Distancia (m)</label>
          <input value={busqueda.dist} onChange={(e) => setBusqueda({ ...busqueda, dist: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
          Buscar Cercanos
        </button>
        <button type="button" onClick={cargar} className="text-sm text-orange-600 hover:underline">
          Ver todos
        </button>
      </form>

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : restaurantes.length === 0 ? (
        <p className="text-gray-400">No hay restaurantes registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurantes.map((r) => (
            <RestauranteCard key={r._id} restaurante={r} />
          ))}
        </div>
      )}
    </div>
  )
}
