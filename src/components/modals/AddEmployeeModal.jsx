import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Button from '../commons/button/Button';
import Input from '../commons/input/Input';
import { useEmployee } from '../../hook/useEmployee';
import { X } from 'phosphor-react';

const AddEmployeeModal = ({isOpen, onClose}) => {

    const { createEmployee, isLoading} = useEmployee()

    const { 
        control, 
        handleSubmit, 
        reset, 
        formState: { errors } 
    } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            department: '',
            position: '',
            username: '',
            password: ''
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    if (!isOpen) return null;

    const onSubmit = async (data) => {
        try {
            
            const result = await createEmployee(data);
            
            // Thành công
            alert(`Tạo nhân viên thành công!\nĐịa chỉ ví: ${result.wallet?.address || 'N/A'}`);
            
            
            onClose();
        } catch (error) {
            
            alert(error.message);
        }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Thêm Nhân Viên Mới</h2>
                <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
                >
                    <X size={32} weight="bold" />
                </button>
            </div>

            {/* Body - Form Content */}
            <div className="p-6 overflow-y-auto">
                <form id="add-employee-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* --- Nhóm: Thông tin cá nhân --- */}
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Thông tin cá nhân</h3>
                    </div>

                    <Controller
                        name="fullName"
                        control={control}
                        rules={{ required: "Họ tên không được để trống" }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Họ và tên"
                                required
                                value={value}
                                onChange={onChange}
                                placeholder="Nguyễn Văn A"
                                error={errors.fullName?.message}
                                isDisabled={isLoading}
                            />
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        rules={{ 
                            required: "Email không được để trống",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Email không hợp lệ"
                            }
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Email"
                                type="email"
                                required
                                value={value}
                                onChange={onChange}
                                placeholder="example@company.com"
                                error={errors.email?.message}
                                isDisabled={isLoading}
                            />
                        )}
                    />

                    <Controller
                        name="phone"
                        control={control}
                        rules={{ 
                            required: "SĐT không được để trống",
                            pattern: {
                                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                                message: "Số điện thoại không hợp lệ (VN)"
                            }
                            }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Số điện thoại"
                                required
                                value={value}
                                onChange={onChange}
                                placeholder="0901234567"
                                error={errors.phone?.message}
                                isDisabled={isLoading}
                            />
                        )}
                    />

                    {/* --- Nhóm: Công việc --- */}
                    <div className="md:col-span-2 mt-2">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Công việc</h3>
                    </div>

                    <Controller
                        name="department"
                        control={control}
                        rules={{ required: "Phòng ban là bắt buộc" }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Phòng ban"
                                value={value}
                                onChange={onChange}
                                placeholder="Kỹ thuật, Nhân sự..."
                                error={errors.department?.message}
                                isDisabled={isLoading}
                            />
                        )}
                    />

                    <Controller
                        name="position"
                        control={control}
                        rules={{ required: "Chức vụ là bắt buộc" }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Chức vụ"
                                value={value}
                                onChange={onChange}
                                placeholder="Developer, Manager..."
                                error={errors.position?.message}
                                isDisabled={isLoading}
                            />
                        )}
                    />

                    {/* --- Nhóm: Tài khoản --- */}
                    <div className="md:col-span-2 mt-2">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Tài khoản hệ thống</h3>
                    </div>

                    <Controller
                        name="username"
                        control={control}
                        rules={{ required: "Tên đăng nhập là bắt buộc" }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Tên đăng nhập"
                                required
                                value={value}
                                onChange={onChange}
                                placeholder="user123"
                                error={errors.username?.message}
                                isDisabled={isLoading}
                            />
                        )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        rules={{ 
                            required: "Mật khẩu là bắt buộc",
                            minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Mật khẩu"
                                type="password"
                                required
                                value={value}
                                onChange={onChange}
                                placeholder="******"
                                error={errors.password?.message}
                                isDisabled={isLoading}
                            />
                        )}
                    />
                </form>
            </div>

            {/* Footer - Buttons */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                <Button 
                    variant="secondary" 
                    onClick={onClose}
                    isDisabled={isLoading}
                >
                    Hủy bỏ
                </Button>
                <Button 
                    variant="primary" 
                    type="submit"
                    form="add-employee-form" // Link button này với form ID
                    isDisabled={isLoading}
                    icon={isLoading ? "Spinner" : "Plus"} // Icon Phosphor: Spinner hoặc Plus
                >
                    {isLoading ? "Đang xử lý..." : "Thêm nhân viên"}
                </Button>
            </div>
        </div>
    </div>
  )
}

export default AddEmployeeModal