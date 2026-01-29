import React, { useState, useMemo } from 'react'
import * as Icon from 'phosphor-react'
import { useAuth } from '../hook/useAuth'
import UploadAvatarDialog from '../components/UploadAvatarDialog.jsx'
import { API_URL_IMAGE } from '../services/api.jsx'
import { DATE_FORMAT_OPTIONS } from '../constants'

const Header = ({ onMenuClick }) => {
    const { currentUser, logout } = useAuth()
    const [showDialog, setShowDialog] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(currentUser?.image_url || null)

    const handleLogout = async () => {
        if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
            await logout()
        }
    }

    const currentDateTime = useMemo(() => {
        const now = new Date()
        return now.toLocaleString('vi-VN', DATE_FORMAT_OPTIONS.vi)
    }, [])

    const userInitial = useMemo(() => {
        return currentUser?.username?.charAt(0).toUpperCase() || 'A'
    }, [currentUser?.username])

    return (
        <>
            <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 shadow-sm sticky top-0 z-30">
                <div className="px-4 lg:px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            {/* Mobile menu button */}
                            <button
                                onClick={onMenuClick}
                                className="lg:hidden p-2.5 hover:bg-purple-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-purple-600"
                                aria-label="Mở menu"
                            >
                                <Icon.List size={22} weight="bold" />
                            </button>
                            
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                                    Hệ thống quản lý
                                </h1>
                                <p className="hidden lg:block text-xs text-gray-500 mt-0.5">
                                    Quản lý và giám sát hệ thống Blockchain
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 lg:space-x-4">
                            {/* Thông tin user - ẩn trên mobile */}
                            <div className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-2 rounded-xl">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-800">
                                        {currentUser?.username}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Quản trị viên
                                    </p>
                                </div>
                            </div>
                            
                            {/* Avatar */}
                            <div 
                                className="relative w-11 h-11 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 rounded-full flex items-center justify-center shadow-lg cursor-pointer flex-shrink-0 transition-transform duration-200 hover:scale-110 hover:shadow-xl"
                                onClick={() => setShowDialog(true)}
                            >
                                {avatarUrl ? (
                                    <img
                                        src={API_URL_IMAGE + avatarUrl}
                                        alt="Avatar"
                                        className="w-11 h-11 rounded-full object-cover ring-2 ring-white"
                                    />
                                ) : (
                                    <span className="text-white text-sm font-bold">
                                        {userInitial}
                                    </span>
                                )}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>

                            {/* Nút đăng xuất */}
                            <button
                                onClick={handleLogout}
                                className="group flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-red-200 hover:shadow-md"
                                title="Đăng xuất"
                            >
                                <Icon.SignOut size={18} className="transition-transform group-hover:-translate-x-0.5" />
                                <span className="hidden sm:inline">Đăng xuất</span>
                            </button>
                        </div>
                    </div>

                    {/* Thời gian truy cập - ẩn trên mobile nhỏ */}
                    <div className="mt-3 pt-3 border-t border-purple-100 hidden sm:flex items-center space-x-2">
                        <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <Icon.Clock size={14} className="text-purple-500" />
                            <span>Truy cập gần nhất: <span className="font-medium text-gray-700">{currentDateTime}</span></span>
                        </div>
                    </div>
                </div>
            </header>

            <UploadAvatarDialog 
                isOpen={showDialog} 
                onClose={() => setShowDialog(false)} 
                userCode={currentUser?.id} 
                handleChangeAvatar={(url) => setAvatarUrl(url)} 
            />
        </>
    )
}

export default Header