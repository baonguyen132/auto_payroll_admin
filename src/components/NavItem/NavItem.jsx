import React from 'react'
import * as Icon from 'phosphor-react'
import { Link } from 'react-router-dom'

const NavItem = ({ icon, label, to, isActive }) => {
  const IconComponent = Icon[icon]

  return (
    <Link 
      to={to} 
      className={`
        group relative flex items-center space-x-3 px-4 py-3 
        rounded-xl transition-all duration-200 ease-in-out
        ${isActive 
          ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30' 
          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
        }
      `}
    >
      {/* Active indicator */}
      {isActive && (
        <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full'></div>
      )}
      
      <div className={`
        flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-white/20' 
          : 'bg-purple-100 group-hover:bg-purple-200'
        }
      `}>
        <IconComponent 
          size={20} 
          weight={isActive ? 'fill' : 'regular'}
          className={isActive ? 'text-white' : 'text-purple-600'}
        />
      </div>
      
      <span className={`
        font-semibold text-sm transition-colors duration-200
        ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-purple-600'}
      `}>
        {label}
      </span>
      
      {/* Hover effect */}
      {!isActive && (
        <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/0 transition-all duration-200'></div>
      )}
    </Link>
  )
}

export default NavItem