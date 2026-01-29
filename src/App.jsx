import React from 'react'
// SỬA DÒNG NÀY:
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom' 
import AdminLayout from './layouts/AdminLayout'
import CardManagement from './pages/CardManagement/CardManagement'
import AccessLogManagement from './pages/AccessLogManagement/AccessLogManagement'
import ETHHistoryManagement from './pages/ETHHistoryManagement/ETHHistoryManagement'
import {AuthProvider} from './contexts/AuthContext'
import LoginPage from './pages/auth/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import EmployeeManagementPage from './pages/home/EmployeeManagementPage'
import ShopManagerment from './pages/ShopManagerment/ShopManagerment'
import { EmployeeProvider } from './contexts/EmployeeContext'

const App = () => {
  return (
    <EmployeeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* THÊM DÒNG NÀY: */}
            <Route path="/" element={<Navigate to="/admin" replace />} /> 
            
            <Route path='/login' element={<LoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path='employee-management' element={<EmployeeManagementPage/>} />
              <Route path="cards" element={<CardManagement />} />
              <Route path="users" element={<div>User Management</div>} />
              <Route path="history-access" element={<AccessLogManagement/>} />
              <Route path="eth-wallet-history" element={<ETHHistoryManagement/>} />
              <Route path="shop" element={<ShopManagerment/>} />
            </Route>
            
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </EmployeeProvider>
  )
}

export default App