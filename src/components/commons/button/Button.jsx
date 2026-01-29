import React from 'react'
import PropTypes from 'prop-types';
import * as Icon from 'phosphor-react' // Thêm import phosphor-react

const Button = ({
    children, 
    onClick,
    variant = 'primary',
    size = 'medium',
    isDisabled = false,
    icon,
    type = 'button',
    fullWidth = false,
    className = '',
    ...props
    
}) => {

    const IconComponent = icon ? Icon[icon] : null;

    // Map kích thước nút với kích thước icon
    const iconSizeMap = {
        small: 16,
        medium: 20,
        large: 24
    };
    const iconSize = iconSizeMap[size];

    // Style mặc định với shadow và transitions tốt hơn
    const baseStyles = 'font-semibold rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 transform active:scale-95'

    // Các biến thể variant với shadows và hover effects
    const variantStyles = {
        primary: 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 focus:ring-purple-400',
        secondary: 'bg-white hover:bg-purple-50 text-purple-700 border-2 border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md focus:ring-purple-400',
        gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl focus:ring-blue-400',
        danger: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 focus:ring-red-400',
        success: 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 focus:ring-green-400',
        outline: 'border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 focus:ring-purple-400',
        text: 'text-purple-600 hover:bg-purple-50 focus:ring-purple-400',
        current: 'bg-purple-500 text-white shadow-md hover:bg-purple-600 focus:ring-purple-400',
        answered: 'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-400',
        unanswered: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400',
    }

    // Size styles với padding tốt hơn
    const sizeStyles = {
        small: 'px-3 py-2 text-xs',
        medium: 'px-5 py-2.5 text-sm',
        large: 'px-6 py-3 text-base'
    }

    // Disable style
    const disabledStyles = 'opacity-50 cursor-not-allowed transform-none hover:shadow-none'

    const widthStyles = fullWidth ? 'w-full' : 'flex-shrink-0 whitespace-nowrap'

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${isDisabled ? disabledStyles : ''} ${widthStyles} flex justify-center items-center space-x-2 ${className}`.trim()

  return (
    <button
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        className={combinedClassName}
        {...props} 
    >
        
        {IconComponent && <IconComponent size={iconSize} weight="bold" />}
        
        {children}
        
    </button>
  )
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline', 'text']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    isDisabled:PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    icon: PropTypes.string,
    fullWidth: PropTypes.bool,
    className: PropTypes.string
}



export default Button