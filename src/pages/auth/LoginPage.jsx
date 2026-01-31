import Button from '../../components/commons/button/Button.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import bg from '../../assets/bg.png'
import { useEffect, useState } from 'react'
import { useAuth } from '../../hook/useAuth.js'
import { Eye, EyeSlash, Lock, User, AlertCircle, ShieldCheck } from 'phosphor-react'

const LoginPage = () => {
    const navigate = useNavigate()
    const { login, isLoggedIn } = useAuth()
    const [loginErr, setLoginErr] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/admin')
        }
    }, [isLoggedIn, navigate])

    const onSubmit = async (data) => {
        setLoginErr(null)
        setIsLoading(true)
        try {
            await login(data)
        } catch (error) {
            setLoginErr(error.message || 'Đã xảy ra lỗi khi đăng nhập.')
        } finally {
            setIsLoading(false)
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm()

    return (
        <div className='relative min-h-screen flex items-center justify-center p-4 overflow-hidden'>
            {/* Animated Background với overlay */}
            <div className='absolute inset-0'>
                <img 
                    src={bg} 
                    alt="Background" 
                    className='w-full h-full object-cover animate-fade-in'
                />
                <div className='absolute inset-0 bg-gradient-to-br from-purple-900/70 via-indigo-900/60 to-purple-800/70'></div>
                {/* Animated gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-indigo-600/20 animate-pulse'></div>
            </div>
            
            {/* Login Card */}
            <div className='relative z-10 w-full max-w-md animate-scale-in'>
                <div className='bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden'>
                    {/* Header với gradient */}
                    <div className='bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 p-8 text-center relative overflow-hidden'>
                        {/* Decorative circles */}
                        <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16'></div>
                        <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12'></div>
                        
                        <div className='relative z-10'>
                            <div className='w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl transform hover:scale-105 transition-transform duration-300'>
                                <ShieldCheck className='w-10 h-10 text-white' weight='bold' />
                            </div>
                            <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight'>
                                Chào mừng trở lại!
                            </h1>
                            <p className='text-purple-100 text-sm sm:text-base'>
                                Đăng nhập để tiếp tục quản lý hệ thống
                            </p>
                        </div>
                    </div>
                    
                    {/* Form */}
                    <div className='p-6 sm:p-8 bg-white/95 backdrop-blur-sm'>
                        {loginErr && (
                            <div 
                                className="w-full bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3.5 rounded-xl mb-6 animate-slide-up shadow-sm" 
                                role="alert"
                            >
                                <div className='flex items-start'>
                                    <AlertCircle className='w-5 h-5 mr-2 flex-shrink-0 mt-0.5' weight='bold' />
                                    <div className='flex-1'>
                                        <strong className="font-bold block text-sm mb-1">Lỗi đăng nhập</strong>
                                        <span className="text-sm">{loginErr}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                            {/* Username Field */}
                            <div>
                                <label htmlFor="username" className='block text-sm font-semibold text-gray-700 mb-2.5 flex items-center'>
                                    <User className='w-4 h-4 mr-1.5 text-purple-600' weight='bold' />
                                    Tên đăng nhập
                                </label>
                                <div className='relative'>
                                    <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'>
                                        <User className='w-5 h-5' weight='regular' />
                                    </div>
                                    <input 
                                        type="text" 
                                        id="username" 
                                        placeholder='Nhập tên đăng nhập' 
                                        className='w-full font-medium text-sm text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300'
                                        {...register('username', { required: 'Tên đăng nhập không được để trống' })}
                                    />
                                </div>
                                {errors.username && (
                                    <span className='text-red-500 text-xs mt-2 block flex items-center animate-slide-up'>
                                        <AlertCircle className='w-3.5 h-3.5 mr-1.5' weight='bold' />
                                        {errors.username.message}
                                    </span>
                                )}
                            </div>
                            
                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className='block text-sm font-semibold text-gray-700 mb-2.5 flex items-center'>
                                    <Lock className='w-4 h-4 mr-1.5 text-purple-600' weight='bold' />
                                    Mật khẩu
                                </label>
                                <div className='relative'>
                                    <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'>
                                        <Lock className='w-5 h-5' weight='regular' />
                                    </div>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        id="password" 
                                        placeholder='Nhập mật khẩu' 
                                        className='w-full font-medium text-sm text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300'
                                        {...register('password', { required: 'Mật khẩu không được để trống' })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none'
                                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                    >
                                        {showPassword ? (
                                            <EyeSlash className='w-5 h-5' weight='regular' />
                                        ) : (
                                            <Eye className='w-5 h-5' weight='regular' />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className='text-red-500 text-xs mt-2 block flex items-center animate-slide-up'>
                                        <AlertCircle className='w-3.5 h-3.5 mr-1.5' weight='bold' />
                                        {errors.password.message}
                                    </span>
                                )}
                            </div>
                            
                            {/* Remember & Forgot Password */}
                            <div className='flex items-center justify-between pt-1'>
                                <label className='flex items-center cursor-pointer group'>
                                    <input 
                                        type="checkbox" 
                                        className='w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer'
                                    />
                                    <span className='ml-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors'>
                                        Ghi nhớ đăng nhập
                                    </span>
                                </label>
                                <Link 
                                    to="/auth/verify-code" 
                                    className='text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 hover:underline'
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            
                            {/* Submit Button */}
                            <div className='pt-2'>
                                <Button 
                                    type='submit' 
                                    fullWidth={true} 
                                    size='large'
                                    isDisabled={isLoading}
                                    className='relative overflow-hidden group'
                                >
                                    {isLoading ? (
                                        <span className='flex items-center justify-center'>
                                            <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                            </svg>
                                            Đang đăng nhập...
                                        </span>
                                    ) : (
                                        <span className='flex items-center justify-center'>
                                            <ShieldCheck className='w-5 h-5 mr-2' weight='bold' />
                                            Đăng nhập
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage