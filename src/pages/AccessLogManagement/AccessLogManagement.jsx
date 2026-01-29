import React, { useState, useEffect } from 'react'
import Table from '../../components/commons/table/Table'
import Input from '../../components/commons/input/Input'
import Button from '../../components/commons/button/Button'
import accessLogService from '../../services/accessLog/accessLogService.jsx'
import { Search, Clock, LogIn, LogOut } from 'lucide-react'

const AccessLogManagement = () => {
  const [logs, setLogs] = useState([])
  const [processedLogs, setProcessedLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterUserId, setFilterUserId] = useState('')
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    loadLogs()
  }, [])

  // Hàm xử lý logic checkin/checkout
  const processLogs = (logs) => {
    if (!logs || !Array.isArray(logs)) return []

    // Nhóm logs theo ngày và user_id
    const logsByDateAndUser = {}
    
    logs.forEach(log => {
      const date = new Date(log.access_time).toDateString()
      const key = `${log.user_id}_${date}`
      
      if (!logsByDateAndUser[key]) {
        logsByDateAndUser[key] = []
      }
      logsByDateAndUser[key].push(log)
    })

    // Xử lý từng nhóm
    const processed = []
    
    Object.values(logsByDateAndUser).forEach(group => {
      // Sắp xếp theo thời gian
      group.sort((a, b) => new Date(a.access_time) - new Date(b.access_time))
      
      // Tìm checkin đầu tiên (access_type = 0)
      const firstCheckin = group.find(log => log.access_type === 0)
      // Tìm checkout cuối cùng (access_type = 1)
      const lastCheckout = [...group].reverse().find(log => log.access_type === 1)
      
      // Thêm tất cả logs vào kết quả với trạng thái đã xử lý
      group.forEach(log => {
        let statusDisplay = ''
        
        if (log.access_type === 0 && log === firstCheckin) {
          statusDisplay = 'Check In'
        } else if (log.access_type === 1 && log === lastCheckout) {
          statusDisplay = 'Check Out'
        } else if (log.access_type === 0) {
          statusDisplay = 'Đang làm việc'
        } else if (log.access_type === 0) {
          statusDisplay = 'Đang làm việc'
        } else if (log.access_type === 1) {
          statusDisplay = 'Đang làm việc'
        }
        
        processed.push({
          ...log,
          statusDisplay: statusDisplay,
          isCheckin: log.access_type === 0,
          isCheckout: log.access_type === 1
        })
      })
    })

    // Sắp xếp toàn bộ logs theo thời gian giảm dần (mới nhất lên đầu)
    return processed.sort((a, b) => new Date(a.access_time) - new Date(b.access_time))
  }

  const loadLogs = async () => {
    setLoading(true)
    setDebugInfo('Đang tải dữ liệu...')
    try {
      const data = await accessLogService.getLogs()
      
      const logsData = data.access_logs || []
      setLogs(logsData)
      
      // Xử lý logs với logic checkin/checkout
      const processedData = processLogs(logsData)
      setProcessedLogs(processedData)
      
      setDebugInfo(`Đã tải ${logsData.length} bản ghi từ API`)
      
      console.log('Final processed logs data:', processedData)
      
    } catch (error) {
      console.error('Error loading logs:', error)
      setDebugInfo('Lỗi khi tải dữ liệu')
      alert("Không thể tải lịch sử ra vào")
      setLogs([])
      setProcessedLogs([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = async () => {
    if (!filterUserId.trim()) return loadLogs()
    
    setLoading(true)
    setDebugInfo(`Đang lọc theo User ID: ${filterUserId}`)
    try {
      const data = await accessLogService.getLogsByUserId(filterUserId.trim())
      
      const logsData = data.access_logs || []
      setLogs(logsData)
      
      // Xử lý logs với logic checkin/checkout
      const processedData = processLogs(logsData)
      setProcessedLogs(processedData)
      
      setDebugInfo(`Đã tải ${logsData.length} bản ghi cho User ID: ${filterUserId}`)
      
      if (logsData.length === 0) {
        alert(`Không tìm thấy lịch sử cho User ID: ${filterUserId}`)
      }
    } catch (error) {
      console.error('Error filtering logs:', error)
      setDebugInfo('Lỗi khi lọc dữ liệu')
      alert("Không tìm thấy lịch sử của người dùng này")
      setLogs([])
      setProcessedLogs([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (statusDisplay, accessType) => {
    switch (statusDisplay) {
      case 'Check In':
        return (
          <span className="flex items-center px-2 py-1 rounded bg-green-100 text-green-700 font-medium text-xs">
            <LogIn size={12} className="mr-1" />
            Check In
          </span>
        )
      case 'Check Out':
        return (
          <span className="flex items-center px-2 py-1 rounded bg-red-100 text-red-600 font-medium text-xs">
            <LogOut size={12} className="mr-1" />
            Check Out
          </span>
        )
      case 'Đang làm việc':
        return (
          <span className="flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium text-xs">
            <Clock size={12} className="mr-1" />
            Đang làm việc
          </span>
        )
      default:
        return accessType === 1 
          ? <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-medium text-xs">Vào</span>
          : <span className="px-2 py-1 rounded bg-red-100 text-red-600 font-medium text-xs">Ra</span>
    }
  }

  const columns = [
    { 
      key: 'id', 
      header: 'ID',
      width: '80px'
    },
    { 
      key: 'card_uid', 
      header: 'Mã Thẻ',
      width: '120px'
    },
    { 
      key: 'user_id', 
      header: 'Mã Người Dùng',
      width: '120px'
    },
    { 
      key: 'username', 
      header: 'Tên Người Dùng',
      width: '150px'
    },
    {
      key: 'access_time',
      header: 'Thời Gian',
      width: '180px',
      render: (row) => {
        const date = new Date(row.access_time)
        return date.toString() === 'Invalid Date' 
          ? 'Invalid Date' 
          : date.toLocaleString('vi-VN')
      }
    },
    {
      key: 'access_type',
      header: 'Hành Động',
      width: '120px',
      render: (row) =>
        row.access_type === 0
          ? <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-medium text-xs">Vào</span>
          : <span className="px-2 py-1 rounded bg-red-100 text-red-600 font-medium text-xs">Ra</span>
    },
    {
      key: 'statusDisplay',
      header: 'Trạng Thái Làm Việc',
      width: '140px',
      render: (row) => getStatusBadge(row.statusDisplay, row.access_type)
    }
  ]

  // Thống kê
  const getStats = () => {
    const total = processedLogs.length
    const checkins = processedLogs.filter(log => log.statusDisplay === 'Check In').length
    const checkouts = processedLogs.filter(log => log.statusDisplay === 'Check Out').length
    const working = processedLogs.filter(log => log.statusDisplay === 'Đang làm việc').length
    
    return { total, checkins, checkouts, working }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Quản Lý Lịch Sử Ra Vào</h2>
        <p className="text-gray-600">Theo dõi và tra cứu lịch sử ra/vào của nhân viên thông qua thẻ RFID.</p>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Tổng số bản ghi</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Check In</h3>
          <p className="text-2xl font-bold text-green-600">{stats.checkins}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Check Out</h3>
          <p className="text-2xl font-bold text-red-600">{stats.checkouts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Đang làm việc</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.working}</p>
        </div>
      </div>

      {/* Filter Search */}
      <div className="bg-white p-5 rounded-xl shadow flex items-end space-x-3">
        <div className="flex-1">
          <label className="block text-sm text-gray-700 mb-1 font-medium">
            Lọc theo Mã Người Dùng
          </label>
          <div className="relative">
            <input
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Nhập User ID..."
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
            />
            <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
          </div>
        </div>

        <Button variant="primary" onClick={handleFilter}>
          Lọc
        </Button>

        <Button variant="secondary" onClick={() => { setFilterUserId(''); loadLogs(); }}>
          Xóa Lọc
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-3">
        {loading ? (
          <div className="flex justify-center items-center py-10 text-lg font-medium text-gray-600 animate-pulse">
            Đang tải dữ liệu...
          </div>
        ) : (
          <Table 
            columns={columns} 
            data={processedLogs} 
            emptyMessage={
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dữ liệu</h3>
                <p className="text-gray-500">
                  {debugInfo.includes('lọc') ? `Không tìm thấy lịch sử cho User ID: ${filterUserId}` : 'Chưa có bản ghi lịch sử nào trong hệ thống'}
                </p>
              </div>
            }
          />
        )}
      </div>

    </div>
  )
}

export default AccessLogManagement