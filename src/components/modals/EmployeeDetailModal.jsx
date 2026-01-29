import { Camera, UploadSimple, X } from 'phosphor-react'
import React, { useRef, useState } from 'react'
import { useEmployee } from '../../hook/useEmployee';
import Button from '../commons/button/Button';

const EmployeeDetailModal = ({isOpen, onClose, employee}) => {
    const { uploadAvatar, isLoading } = useEmployee();
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [uploading, setUploading] = useState(false);
    const avatarInputRef = useRef();

    if (!isOpen || !employee) return null;

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreviewAvatar(objectUrl);

        try {
            setUploading(true);
            await uploadAvatar(employee.userCode, file);
            alert('Cập nhật avatar thành công!');
            
        } catch (error) {
            alert(`Lỗi upload: ${error.message}`);
            setPreviewAvatar(null);
            
        } finally {
            setUploading(false);
        }
    }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Chi tiết nhân viên</h2>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
            >
                <X size={32} weight="bold" />
            </button>
        </div>
        {/* Body */}
        <div className="p-6 overflow-y-auto">
            <div className='relative mb-2 group'>
                <div className='w-32 h-32 rounded-full border-4 border-purple-100 overflow-hidden shadow-inner bg-gray-100 flex items-center justify-center'>
                    {previewAvatar ? (
                        <img
                            src={previewAvatar}
                            alt="Avatar Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={employee.avatar || '/default-avatar.png'}
                            alt="Employee Avatar"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <button
                    className='absolute bottom-0 right-0 bg-purple-600 text-white p-1 rounded-full shadow-md hover:bg-purple-700 transition-all cursor-pointer'
                    onClick={() => avatarInputRef.current.click()}
                    disabled={uploading || isLoading}
                    title='Đổi ảnh đại diện'
                >
                    {uploading ? <UploadSimple size={24} className='animate-bounce' /> : <Camera size={24} /> }

                </button>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                    ref={avatarInputRef}
                />

            </div>
            <div className='flex justify-between items-center'>
                <h2 className='text-xl font-bold'>{employee.fullName.toUpperCase()}</h2>
                <span className={`p-2 ${employee.active === true ? "bg-green-200 text-green-500" : "bg-red-200 text-red-500"} font-semibold rounded text-sm`}>{employee.active === true ? "Đang hoạt động" : "Không hoạt động"}</span>

            </div>
            <div className='p-5 border-2 rounded-lg my-3'>
                <div className='border-b border-gray-200 pb-2 mb-2'>
                    <label className='text-sm text-gray-600' htmlFor="">User Code</label>
                    <p className='text-md font-semibold text-gray-900'>{employee.userCode}</p>
                </div>
                <div className='border-b border-gray-200 pb-2 mb-2'>
                    <label className='text-sm text-gray-600' htmlFor="">Email</label>
                    <p className='text-md font-semibold text-gray-900'>{employee.email}</p>
                </div>
                <div className='border-b border-gray-200 pb-2 mb-2'>
                    <label className='text-sm text-gray-600' htmlFor="">Phone</label>
                    <p className='text-md font-semibold text-gray-900'>{employee.phone}</p>
                </div>
                <div className='border-b border-gray-200 pb-2 mb-2'>
                    <label className='text-sm text-gray-600' htmlFor="">Department</label>
                    <p className='text-md font-semibold text-gray-900'>{employee.department}</p>
                </div>
                <div className='border-b border-gray-200 pb-2 mb-2'>
                    <label className='text-sm text-gray-600' htmlFor="">Position</label>
                    <p className='text-md font-semibold text-gray-900'>{employee.position}</p>
                </div>
                <div className='border-b border-gray-200 pb-2 mb-2'>
                    <label className='text-sm text-gray-600' htmlFor="">Wallet</label>
                    <p className='text-md font-semibold text-gray-900'>{employee.wallet}</p>
                </div>
                <div>
                    <label className='text-sm text-gray-600' htmlFor="">Create At</label>
                    <p className='text-md font-semibold text-gray-900'>{employee.createdAt}</p>
                </div>
            </div>

        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
            <Button onClick={onClose}>Đóng</Button>
        </div>
        
      </div>
    </div>
  )
}




export default EmployeeDetailModal