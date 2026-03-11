export default function RestauranteCard({ restaurante }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-gray-800 text-lg leading-tight">{restaurante.nombre}</h3>
      {restaurante.descripcion && (
        <p className="text-gray-500 text-sm">{restaurante.descripcion}</p>
      )}
      {restaurante.categorias?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {restaurante.categorias.map((c) => (
            <span key={c} className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">
              {c}
            </span>
          ))}
        </div>
      )}
      {restaurante.estado && (
        <span className={`self-start text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${
          restaurante.estado === 'activo'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {restaurante.estado}
        </span>
      )}
    </div>
  )
}
