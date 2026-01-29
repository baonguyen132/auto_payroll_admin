import React, { useEffect, useState, useCallback } from 'react'
import Button from '../../components/commons/button/Button'
import { useEmployee } from '../../hook/useEmployee'
import AddEmployeeModal from '../../components/modals/AddEmployeeModal'
import EmployeeDetailModal from '../../components/modals/EmployeeDetailModal'
import { STATUS_LABELS, STATUS_COLORS } from '../../constants'

function EmployeeManagementPage() {
  const { employees, isLoading, error, getEmployees, updateEmployeeStatus } = useEmployee()

  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    getEmployees()
  }, [getEmployees])

  const handleGetEmployeeDetails = useCallback((emp) => {
    setSelectedEmployee(emp)
    setShowDetailModal(true)
  }, [])

  const handleToggleStatus = useCallback(async (userCode, currentStatus) => {
    try {
      await updateEmployeeStatus(userCode, !currentStatus)
      alert('Cập nhật trạng thái thành công.')
    } catch (err) {
      alert(`Lỗi khi cập nhật: ${err.message}`)
    }
  }, [updateEmployeeStatus])

  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp * 1000).toLocaleDateString('vi-VN')
  }, [])

  
  if (isLoading) {
    return <div className='p-4'>Đang tải dữ liệu nhân viên...</div>;
  }

  if (error) {
    return <div className='p-4 text-red-500'>Lỗi: {error}</div>;
  }

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <div className='bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl p-6 shadow-lg'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>Quản lý nhân viên</h1>
            <p className='text-purple-100 text-sm'>Quản lý thông tin và trạng thái nhân viên trong hệ thống</p>
          </div>
          <Button 
            variant='secondary' 
            icon='Plus'
            onClick={() => setShowAddModal(true)}
            className='w-full sm:w-auto bg-white text-purple-600 hover:bg-purple-50 border-0 shadow-md'
          >
            <span className='hidden sm:inline'>Thêm nhân viên</span>
            <span className='sm:hidden'>Thêm mới</span>
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className='hidden lg:block bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100'>
        <div className='overflow-x-auto custom-scrollbar'>
          <table className='min-w-full divide-y divide-gray-100'>
            <thead className='bg-gradient-to-r from-purple-50 to-purple-100'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider'>Mã NV</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider'>Họ tên</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider'>Email & SĐT</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider'>Phòng ban</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider'>Chức vụ</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider'>Ngày tạo</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider'>Trạng thái</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider'>Hành động</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-100'>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className='flex flex-col items-center justify-center'>
                      <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                        <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                        </svg>
                      </div>
                      <p className='text-gray-500 font-medium'>Không tìm thấy nhân viên nào.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((emp, index) => (
                  <tr key={emp.userCode} className='hover:bg-purple-50/50 transition-colors duration-150'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm font-bold text-purple-600'>{emp.userCode}</span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm font-semibold text-gray-900'>{emp.fullName}</span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-700'>{emp.email}</div>
                      <div className='text-xs text-gray-500'>{emp.phone}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{emp.department}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{emp.position}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>{formatTimestamp(emp.createdAt)}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm ${
                        emp.active ? STATUS_COLORS.ACTIVE.bg + ' ' + STATUS_COLORS.ACTIVE.text : STATUS_COLORS.INACTIVE.bg + ' ' + STATUS_COLORS.INACTIVE.text
                      }`}>
                        {emp.active ? STATUS_LABELS.ACTIVE : STATUS_LABELS.INACTIVE}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex gap-2'>
                        <Button 
                          size='small'
                          variant={emp.active ? 'danger' : 'success'}
                          icon={emp.active ? 'ToggleRight' : 'ToggleLeft'}
                          onClick={() => handleToggleStatus(emp.userCode, emp.active)}
                        >
                          {emp.active ? 'Vô hiệu' : 'Kích hoạt'}
                        </Button>
                        <Button 
                          size='small' 
                          variant='secondary' 
                          icon='Eye'
                          onClick={() => handleGetEmployeeDetails(emp)}
                        >
                          Xem
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className='lg:hidden space-y-4'>
        {employees.length === 0 ? (
          <div className='bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-100'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
              </svg>
            </div>
            <p className='text-gray-500 font-medium'>Không tìm thấy nhân viên nào.</p>
          </div>
        ) : (
          employees.map((emp) => (
            <div key={emp.userCode} className='bg-white shadow-lg rounded-2xl p-5 space-y-4 border border-gray-100 card-hover'>
              <div className='flex justify-between items-start pb-3 border-b border-gray-100'>
                <div>
                  <h3 className='font-bold text-lg text-gray-900 mb-1'>{emp.fullName}</h3>
                  <p className='text-sm text-purple-600 font-medium'>Mã: {emp.userCode}</p>
                </div>
                <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm ${
                  emp.active ? STATUS_COLORS.ACTIVE.bg + ' ' + STATUS_COLORS.ACTIVE.text : STATUS_COLORS.INACTIVE.bg + ' ' + STATUS_COLORS.INACTIVE.text
                }`}>
                  {emp.active ? STATUS_LABELS.ACTIVE : STATUS_LABELS.INACTIVE}
                </span>
              </div>
              
              <div className='space-y-2 text-sm'>
                <div className='flex items-center space-x-2'>
                  <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                  <span className='text-gray-600'>{emp.email}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                  </svg>
                  <span className='text-gray-600'>{emp.phone}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                  </svg>
                  <span className='text-gray-600'>{emp.department}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                  <span className='text-gray-600'>{emp.position}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                  <span className='text-gray-600'>{formatTimestamp(emp.createdAt)}</span>
                </div>
              </div>
              
              <div className='flex gap-2 pt-3 border-t border-gray-100'>
                <Button 
                  size='small'
                  variant={emp.active ? 'danger' : 'success'}
                  icon={emp.active ? 'ToggleRight' : 'ToggleLeft'}
                  onClick={() => handleToggleStatus(emp.userCode, emp.active)}
                  className='flex-1'
                >
                  {emp.active ? 'Vô hiệu' : 'Kích hoạt'}
                </Button>
                <Button 
                  size='small' 
                  variant='secondary' 
                  icon='Eye'
                  onClick={() => handleGetEmployeeDetails(emp)}
                  className='flex-1'
                >
                  Xem
                </Button>
              </div>
            </div>
          ))
        )}
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