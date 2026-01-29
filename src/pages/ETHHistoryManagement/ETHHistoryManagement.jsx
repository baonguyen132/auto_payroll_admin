import React, { useState, useEffect, useContext } from 'react'
import Table from '../../components/commons/table/Table'
import Button from '../../components/commons/button/Button'
import { Search, ArrowUpRight, ArrowDownLeft, Wallet, RefreshCw, AlertCircle, User, Calendar } from 'lucide-react'
import { EmployeeContext } from '../../contexts/EmployeeContext'

const ETHHistoryManagement = () => {
  const [logs, setLogs] = useState([])
  const [balanceInfo, setBalanceInfo] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [filterUserCode, setFilterUserCode] = useState('')
  const [localLoading, setLocalLoading] = useState(false)

  const {
    employees,
    isLoading,
    error,
    getEmployees,
    getTransactionLogs,
    clearError
  } = useContext(EmployeeContext)

  // Tải danh sách nhân viên để gợi ý trong search
  useEffect(() => {
    getEmployees().catch(err => console.warn("Không tải được danh sách nhân viên (có thể do quyền hạn)", err));
  }, [])

  // Hiển thị lỗi từ Context nếu có
  useEffect(() => {
    if (error) {
      alert(error)
      clearError()
    }
  }, [error])

  // Hàm quan trọng nhất: Gọi API Logs & Xử lý Balance
  const loadData = async (userCode) => {
    if (!userCode) return;

    setLocalLoading(true);
    setLogs([]);
    setBalanceInfo(null);

    try {
      console.log(`Calling API logs for user: ${userCode}`);
      const response = await getTransactionLogs(userCode);
      console.log('API Response:', response);

      if (response) {
        // 1. Xử lý Logs
        if (Array.isArray(response.logs)) {
          const formattedLogs = response.logs.map((log, index) => ({
            ...log,
            id: index + 1,
            formattedDate: log.timestamp ? new Date(log.timestamp * 1000).toLocaleString('vi-VN') : 'N/A',
            // Thêm trạng thái giao dịch nếu có
            status: log.status || 'completed'
          }));
          // Sắp xếp log mới nhất lên đầu
          setLogs(formattedLogs.sort((a, b) => b.timestamp - a.timestamp));
        }

        // 2. Xử lý Balance
        setBalanceInfo({
          balance: response.bookBalance !== undefined ? response.bookBalance : 0,
          currency: 'ETH',
          userCode: response.userCode || userCode,
          // Thêm thông tin bổ sung nếu API có
          lastUpdated: response.lastUpdated || Date.now()
        });
      }

    } catch (error) {
      console.error('Error loading data:', error);
      if (error.message && !error.message.includes('404')) {
        alert("Không thể tải dữ liệu giao dịch: " + error.message);
      }
    } finally {
      setLocalLoading(false);
    }
  }

  const handleFilter = async () => {
    const codeToSearch = filterUserCode.trim();
    if (!codeToSearch) {
      alert("Vui lòng nhập mã nhân viên");
      return;
    }

    setSelectedEmployee(codeToSearch);
    await loadData(codeToSearch);
  }

  const handleRefresh = async () => {
    if (selectedEmployee) {
      await loadData(selectedEmployee);
    } else {
      getEmployees();
    }
  }

  const handleClearFilter = () => {
    setFilterUserCode('')
    setSelectedEmployee(null)
    setBalanceInfo(null)
    setLogs([])
  }

  // Định nghĩa cột cho bảng
  const columns = [
    {
      key: 'id',
      header: 'STT',
      width: '60px',
      render: (_, index) => <span className="text-gray-500">{index + 1}</span>
    },
    {
      key: 'action',
      header: 'Loại Giao Dịch',
      width: '140px',
      render: (row) => {
        const isWithdraw = row.action === 'withdraw';
        const isPurchase = row.action === 'purchase';
        return (
          <span className={`flex items-center font-medium ${isWithdraw || isPurchase ? 'text-red-600' : 'text-green-600'}`}>
            {isWithdraw || isPurchase ? <ArrowDownLeft size={16} className="mr-1" /> : <ArrowUpRight size={16} className="mr-1" />}
            {isWithdraw ? 'Rút Tiền' : isPurchase ? 'Mua Hàng' : 'Nhận Tiền'}
          </span>
        )
      }
    },
    {
      key: 'amountEth',
      header: 'Số Lượng',
      width: '150px',
      render: (row) => (
        <span className="font-mono font-bold text-gray-800">
          {parseFloat(row.amountEth).toFixed(6)} ETH
        </span>
      )
    },
    {
      key: 'timestamp',
      header: 'Thời Gian',
      width: '200px',
      render: (row) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={14} className="mr-2" />
          {row.formattedDate}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Trạng Thái',
      width: '120px',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'completed' ? 'bg-green-100 text-green-800' :
            row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
          }`}>
          {row.status === 'completed' ? 'Thành công' :
            row.status === 'pending' ? 'Đang xử lý' : 'Không xác định'}
        </span>
      )
    }
  ];

  const isBusy = isLoading || localLoading;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lịch Sử Giao Dịch ETH</h2>
          <p className="text-gray-500 text-sm">Tra cứu lịch sử giao dịch và số dư của nhân viên</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isBusy}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={isBusy ? 'animate-spin' : ''} />
          Làm mới
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Nhập mã nhân viên (VD: 17)..."
            value={filterUserCode}
            onChange={(e) => setFilterUserCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
            disabled={isBusy}
            list="empSuggestions"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          {/* Datalist gợi ý nếu có danh sách employees */}
          <datalist id="empSuggestions">
            {employees.map(e => <option key={e.userCode} value={e.userCode}>{e.username}</option>)}
          </datalist>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={handleFilter} disabled={isBusy}>
            Tìm Kiếm
          </Button>
          <Button variant="secondary" onClick={handleClearFilter} disabled={isBusy}>
            Xóa
          </Button>
        </div>
      </div>

      {/* Info Cards Section - CHỈ HIỂN THỊ THÔNG TIN */}
      {selectedEmployee && balanceInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl p-5 text-white shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-100 text-sm font-medium mb-1">Tổng giao dịch</p>
                <h3 className="text-3xl font-bold">{- parseFloat(balanceInfo.balance).toFixed(6)} ETH</h3>
                <div className="mt-4 flex items-center gap-2 text-xs text-indigo-100">
                  <User size={12} />
                  <span className="bg-white/20 px-2 py-1 rounded">User: {selectedEmployee}</span>
                  <span className="bg-white/20 px-2 py-1 rounded">Tổng giao dịch: {logs.length}</span>
                </div>
              </div>
              <div className="bg-white/10 p-3 rounded-full">
                <Wallet size={32} />
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-3">Thống kê giao dịch</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-green-600">Tổng tiền mua hàng</p>
                <p className="font-bold text-green-700">
                  {logs
                    .filter(log => log.action !== 'withdraw')
                    .reduce((sum, log) => sum + parseFloat(log.amountEth || 0), 0)
                    .toFixed(6)} ETH
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-red-600">Tổng rút</p>
                <p className="font-bold text-red-700">
                  {logs
                    .filter(log => log.action === 'withdraw')
                    .reduce((sum, log) => sum + parseFloat(log.amountEth || 0), 0)
                    .toFixed(6)} ETH
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-medium text-gray-700">Lịch sử giao dịch</h3>
          <p className="text-sm text-gray-500">
            {selectedEmployee ? `Hiển thị ${logs.length} giao dịch của user ${selectedEmployee}` : 'Vui lòng chọn nhân viên để xem lịch sử'}
          </p>
        </div>

        {isBusy && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <RefreshCw size={32} className="animate-spin mb-2" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={logs}
            emptyMessage={
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                {selectedEmployee ? (
                  <>
                    <AlertCircle size={48} className="mb-2 text-gray-300" />
                    <p>Không tìm thấy giao dịch nào cho User {selectedEmployee}</p>
                    <p className="text-sm mt-1">Người dùng này chưa có giao dịch nào</p>
                  </>
                ) : (
                  <>
                    <Search size={48} className="mb-2 text-gray-300" />
                    <p>Vui lòng nhập Mã nhân viên và nhấn Tìm kiếm</p>
                    <p className="text-sm mt-1">Sử dụng danh sách gợi ý hoặc nhập mã trực tiếp</p>
                  </>
                )}
              </div>
            }
          />
        )}
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-gray-400 mt-4">
        <p>Trang này chỉ dùng để tra cứu lịch sử giao dịch. Để thực hiện giao dịch, vui lòng sử dụng chức năng phù hợp.</p>
      </div>
    </div>
  )
}

export default ETHHistoryManagement