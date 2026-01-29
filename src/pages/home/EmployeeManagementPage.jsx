import React, { useEffect, useState } from 'react';
import Button from '../../components/commons/button/Button'; 
import { useEmployee } from '../../hook/useEmployee';
import AddEmployeeModal from '../../components/modals/AddEmployeeModal';
import EmployeeDetailModal from '../../components/modals/EmployeeDetailModal';


function EmployeeManagementPage() {
  const { employees, isLoading, error, getEmployees, updateEmployeeStatus} = useEmployee();

  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Sử dụng useEffect để gọi API khi component được tải
  // getEmployees đã được bọc trong useCallback ở context, nên an toàn khi đưa vào dependency
  useEffect(() => {
    getEmployees();
  }, [getEmployees])

  const handleGetEmployeeDetails = async (emp) => {
    setSelectedEmployee(emp);
    setShowDetailModal(true);
    
  };

  const handleToggleStatus = async (userCode, currentStatus) => {
    try {
      await updateEmployeeStatus(userCode, !currentStatus); 

      alert(`Cập nhật trạng thái thành công.`);
    } catch (err) {
      alert(`Lỗi khi cập nhật: ${err.message}`);
    }
  };

 

  // Hàm tiện ích để định dạng timestamp (từ API)
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('vi-VN');
  };

  
  if (isLoading) {
    return <div className='p-4'>Đang tải dữ liệu nhân viên...</div>;
  }

  if (error) {
    return <div className='p-4 text-red-500'>Lỗi: {error}</div>;
  }

  return (
    <div className='p-4 space-y-4'>
      {/* Tiêu đề và nút Thêm mới */}
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-neutral-700'>Quản lý nhân viên</h1>
        <Button 
          variant='primary' 
          icon='Plus'
          onClick={() => setShowAddModal(true)}
        >
          Thêm nhân viên
        </Button>
      </div>

      {/* Bảng dữ liệu */}
      <div className='bg-white shadow-md rounded-lg overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Mã NV</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Họ tên</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email & SĐT</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Phòng ban</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Chức vụ</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Ngày tạo</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Trạng thái</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Hành động</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy nhân viên nào.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.userCode} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{emp.userCode}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{emp.fullName}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                    <div>{emp.email}</div>
                    <div>{emp.phone}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{emp.department}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{emp.position}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{formatTimestamp(emp.createdAt)}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    {emp.active === true ? (
                      <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800' >
                        Hoạt động
                      </span>
                    ) : (
                      <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'>
                        Không hoạt động
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3'>
                    <Button 
                      size='small'
                      variant={emp.active ? 'danger' : 'success'}
                      icon={emp.active ? 'ToggleRight' : 'ToggleLeft'}
                      
                      onClick={() => handleToggleStatus(emp.userCode, emp.active)}
                    >
                      {emp.active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    </Button>
                    <Button 
                      size='small' 
                      variant='secondary' 
                      icon='Eye'
                      onClick={() => handleGetEmployeeDetails(emp)}
                    >
                      Xem
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddEmployeeModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      {selectedEmployee && (<EmployeeDetailModal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)} 
        employee={selectedEmployee} 
      />)}
    </div>
  );
}

export default EmployeeManagementPage;