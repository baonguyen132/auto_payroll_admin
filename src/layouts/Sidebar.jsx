import React from 'react'
import NavItem from '../components/NavItem/NavItem'
import { useLocation } from 'react-router-dom'
import * as Icon from 'phosphor-react'
import { ROUTES } from '../constants'

const SIDEBAR_MENU_ITEMS = [
    { icon: 'House', label: 'Trang chủ', to: ROUTES.HOME },
    { icon: 'UsersFour', label: 'Quản lý nhân viên', to: ROUTES.EMPLOYEE_MANAGEMENT },
    { icon: 'IdentificationBadge', label: 'Quản lý thẻ RFID', to: ROUTES.CARDS },
    { icon: 'ShieldCheck', label: 'Quản lý lịch sử ra vào', to: ROUTES.HISTORY_ACCESS },
    { icon: 'CurrencyEth', label: 'Quản lý lịch sử ví ETH', to: ROUTES.ETH_WALLET_HISTORY },
    { icon: 'Storefront', label: 'Quản lý cửa hàng', to: ROUTES.SHOP },
]

const Sidebar = ({ isOpen = false, onClose }) => {
    const location = useLocation()

    const handleNavClick = () => {
        // Đóng sidebar trên mobile khi click vào nav item
        if (window.innerWidth < 1024) {
            onClose?.()
        }
    }

    return (
        <>
            {/* Mobile sidebar */}
            <div 
                className={`
                    fixed inset-y-0 left-0 z-50
                    w-72 h-screen bg-gradient-to-b from-purple-50 via-white to-white
                    border-r border-purple-100 shadow-2xl
                    transform transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:static lg:z-auto lg:shadow-xl
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className='h-full flex flex-col p-6 custom-scrollbar'>
                    {/* Logo Section */}
                    <div className='flex items-center justify-between mb-8 pb-6 border-b border-purple-100'>
                        <div className='flex items-center space-x-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center shadow-lg'>
                                <Icon.ShieldCheck size={24} className='text-white' weight='fill' />
                            </div>
                            <div>
                                <div className='text-lg font-bold gradient-text'>
                                    BLOCKCHAIN
                                </div>
                                <div className='text-xs text-gray-500 font-medium'>Admin Panel</div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className='lg:hidden p-2 hover:bg-purple-100 rounded-lg transition-colors text-gray-600 hover:text-purple-600'
                            aria-label='Đóng menu'
                        >
                            <Icon.X size={20} weight='bold' />
                        </button>
                    </div>
                    
                    {/* Navigation */}
                    <nav className='flex-1 space-y-1 overflow-y-auto'>
                        {SIDEBAR_MENU_ITEMS.map((item, index) => (
                            <div key={index} onClick={handleNavClick} className='animate-fade-in' style={{ animationDelay: `${index * 50}ms` }}>
                                <NavItem 
                                    icon={item.icon} 
                                    label={item.label} 
                                    to={item.to} 
                                    isActive={location.pathname === item.to} 
                                />
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className='pt-6 mt-auto border-t border-purple-100'>
                        <div className='bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4'>
                            <div className='flex items-center space-x-3'>
                                <div className='w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center'>
                                    <Icon.Info size={18} className='text-white' />
                                </div>
                                <div className='flex-1'>
                                    <p className='text-xs font-semibold text-gray-700'>Hệ thống</p>
                                    <p className='text-xs text-gray-500'>Phiên bản 1.0.0</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar