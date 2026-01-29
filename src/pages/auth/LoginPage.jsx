import Button from '../../components/commons/button/Button.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import bg from '../../assets/bg.png'
import { useEffect, useState } from 'react'
import { useAuth } from '../../hook/useAuth.js'

const LoginPage = () => {
    const navigate = useNavigate()
    const { login, isLoggedIn } = useAuth()
    const [loginErr, setLoginErr] = useState(null)

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/admin')
        }
    }, [isLoggedIn, navigate])

    const onSubmit = async (data) => {
        setLoginErr(null)
        try {
            await login(data)
        } catch (error) {
            setLoginErr(error.message || 'Đã xảy ra lỗi khi đăng nhập.')
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm()

    return (
        <div className='relative min-h-screen flex items-center justify-center p-4 overflow-hidden'>
            {/* Background với overlay */}
            <div className='absolute inset-0'>
                <img 
                    src={bg} 
                    alt="Background" 
                    className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-br from-purple-900/60 via-purple-800/50 to-purple-900/60'></div>
            </div>
            
            {/* Login Card */}
            <div className='relative z-10 w-full max-w-md animate-scale-in'>
                <div className='bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden'>
                    {/* Header */}
                    <div className='bg-gradient-to-r from-purple-600 to-purple-500 p-6 text-center'>
                        <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                            <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                            </svg>
                        </div>
                        <h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>
                            Chào mừng trở lại!
                        </h1>
                        <p className='text-purple-100 text-sm'>
                            Đăng nhập để tiếp tục quản lý hệ thống
                        </p>
                    </div>
                    
                    {/* Form */}
                    <div className='p-6 sm:p-8'>
                        {loginErr && (
                            <div 
                                className="w-full bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slide-up" 
                                role="alert"
                            >
                                <div className='flex items-center'>
                                    <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                                    </svg>
                                    <div>
                                        <strong className="font-bold block">Lỗi đăng nhập</strong>
                                        <span className="text-sm">{loginErr}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                            <div>
                                <label htmlFor="username" className='block text-sm font-semibold text-gray-700 mb-2'>
                                    Tên đăng nhập
                                </label>
                                <input 
                                    type="text" 
                                    id="username" 
                                    placeholder='Nhập tên đăng nhập' 
                                    className='w-full font-medium text-sm text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400'
                                    {...register('username', { required: 'Username không được để trống' })}
                                />
                                {errors.username && (
                                    <span className='text-red-500 text-xs mt-1.5 block flex items-center'>
                                        <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                        </svg>
                                        {errors.username.message}
                                    </span>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="password" className='block text-sm font-semibold text-gray-700 mb-2'>
                                    Mật khẩu
                                </label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    placeholder='Nhập mật khẩu' 
                                    className='w-full font-medium text-sm text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400'
                                    {...register('password', { required: 'Mật khẩu không được để trống' })}
                                />
                                {errors.password && (
                                    <span className='text-red-500 text-xs mt-1.5 block flex items-center'>
                                        <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                        </svg>
                                        {errors.password.message}
                                    </span>
                                )}
                            </div>
                            
                            <div className='pt-2'>
                                <Button type='submit' fullWidth={true} size='large'>
                                    Đăng nhập
                                </Button>
                            </div>
                            
                            <div className='flex justify-end pt-2'>
                                <Link 
                                    to="/auth/verify-code" 
                                    className='text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 hover:underline'
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage