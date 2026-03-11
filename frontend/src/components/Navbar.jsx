import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/restaurantes', label: 'Restaurantes' },
  { to: '/ordenes', label: 'Órdenes' },
  { to: '/usuarios', label: 'Usuarios' },
  { to: '/resenas', label: 'Reseñas' },
]

export default function Navbar() {
  return (
    <nav className="bg-orange-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-14">
        <span className="font-bold text-lg tracking-wide">🍽 RestaurantApp</span>
        <div className="flex gap-2 ml-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1 rounded text-sm font-medium transition-colors ${
                  isActive ? 'bg-white text-orange-600' : 'hover:bg-orange-500'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
