# Blockchain Admin UI

Hệ thống quản trị viên cho ứng dụng Blockchain, được xây dựng bằng React và Vite.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Tính năng](#tính-năng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt](#cài-đặt)
- [Sử dụng](#sử-dụng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Responsive Design](#responsive-design)
- [Cấu trúc thư mục chi tiết](#cấu-trúc-thư-mục-chi-tiết)

## 🎯 Tổng quan

Dự án này là một ứng dụng quản trị viên (Admin Dashboard) được thiết kế để quản lý các thành phần của hệ thống Blockchain, bao gồm:
- Quản lý nhân viên
- Quản lý thẻ RFID
- Quản lý lịch sử ra vào
- Quản lý lịch sử ví ETH
- Quản lý cửa hàng

## ✨ Tính năng

- ✅ **Xác thực người dùng**: Hệ thống đăng nhập/đăng xuất với JWT
- ✅ **Quản lý nhân viên**: CRUD đầy đủ cho nhân viên
- ✅ **Quản lý thẻ RFID**: Gán và quản lý thẻ cho nhân viên
- ✅ **Lịch sử truy cập**: Theo dõi lịch sử ra vào
- ✅ **Quản lý ví ETH**: Xem lịch sử giao dịch ví Ethereum
- ✅ **Quản lý cửa hàng**: Quản lý sản phẩm và cửa hàng
- ✅ **Responsive Design**: Hỗ trợ đầy đủ trên mobile, tablet và desktop
- ✅ **UI/UX hiện đại**: Giao diện đẹp mắt với Tailwind CSS

## 📁 Cấu trúc dự án

```
admin-ui/
├── public/                 # Tài nguyên tĩnh
│   └── vite.svg
├── src/
│   ├── assets/            # Hình ảnh, fonts, và các tài nguyên khác
│   │   ├── bg.png
│   │   └── react.svg
│   ├── components/        # Các component tái sử dụng
│   │   ├── commons/       # Component chung (Button, Input, Table, NavItem)
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── navitem/
│   │   │   └── table/
│   │   ├── modals/        # Các modal dialog
│   │   │   ├── AddEmployeeModal.jsx
│   │   │   ├── AssignUserModal.jsx
│   │   │   └── EmployeeDetailModal.jsx
│   │   ├── NavItem/       # Component điều hướng
│   │   ├── ProtectedRoute.jsx  # Route bảo vệ
│   │   └── UploadAvatarDialog.jsx
│   ├── constants/         # Các hằng số của ứng dụng
│   │   └── index.js
│   ├── contexts/          # React Context cho state management
│   │   ├── AuthContext.jsx
│   │   └── EmployeeContext.jsx
│   ├── hook/              # Custom React Hooks
│   │   ├── useAuth.js
│   │   └── useEmployee.js
│   ├── layouts/           # Layout components
│   │   ├── AdminLayout.jsx    # Layout chính cho admin
│   │   ├── AuthLayout.jsx     # Layout cho trang auth
│   │   ├── Header.jsx         # Header component
│   │   └── Sidebar.jsx        # Sidebar navigation
│   ├── pages/             # Các trang của ứng dụng
│   │   ├── auth/
│   │   │   └── LoginPage.jsx
│   │   ├── home/
│   │   │   ├── CardManagementPage.jsx
│   │   │   └── EmployeeManagementPage.jsx
│   │   ├── AccessLogManagement/
│   │   ├── CardManagement/
│   │   ├── ETHHistoryManagement/
│   │   └── ShopManagerment/
│   ├── routes/            # Cấu hình routing
│   │   └── index.jsx
│   ├── services/          # API services
│   │   ├── api.jsx        # Cấu hình API base
│   │   ├── accessLog/
│   │   ├── auth/
│   │   ├── card/
│   │   ├── employee/
│   │   └── product/
│   ├── styles/            # Global styles
│   │   ├── GlobalStyle.css
│   │   └── pages/
│   ├── App.jsx            # Component chính
│   ├── main.jsx           # Entry point
│   └── index.css          # Global CSS với Tailwind
├── .gitignore
├── eslint.config.js       # Cấu hình ESLint
├── index.html
├── package.json
├── postcss.config.js      # Cấu hình PostCSS
├── tailwind.config.js    # Cấu hình Tailwind CSS
├── vite.config.js        # Cấu hình Vite
└── README.md
```

## 🚀 Cài đặt

### Yêu cầu hệ thống

- Node.js >= 16.x
- npm hoặc yarn

### Các bước cài đặt

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd admin-ui
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường** (nếu cần)
   Tạo file `.env` và cấu hình các biến môi trường:
   ```env
   VITE_API_BASE_URL=your_api_url
   ```

4. **Chạy ứng dụng ở chế độ development**
   ```bash
   npm run dev
   ```

5. **Build cho production**
   ```bash
   npm run build
   ```

6. **Preview build**
   ```bash
   npm run preview
   ```

## 💻 Sử dụng

### Đăng nhập

1. Truy cập `/login`
2. Nhập username và password
3. Sau khi đăng nhập thành công, bạn sẽ được chuyển đến trang admin

### Quản lý nhân viên

- Truy cập `/admin/employee-management`
- Xem danh sách nhân viên
- Thêm nhân viên mới bằng nút "Thêm nhân viên"
- Xem chi tiết nhân viên bằng nút "Xem"
- Kích hoạt/Vô hiệu hóa nhân viên

### Quản lý thẻ RFID

- Truy cập `/admin/cards`
- Xem danh sách thẻ
- Gán thẻ cho nhân viên
- Kích hoạt/Vô hiệu hóa thẻ

### Các tính năng khác

- **Lịch sử ra vào**: `/admin/history-access`
- **Lịch sử ví ETH**: `/admin/eth-wallet-history`
- **Quản lý cửa hàng**: `/admin/shop`

## 🛠 Công nghệ sử dụng

### Core
- **React 19.1.1**: Thư viện UI
- **React Router DOM 7.9.5**: Routing
- **Vite 7.1.7**: Build tool và dev server

### Styling
- **Tailwind CSS 3.4.18**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Autoprefixer**: Tự động thêm vendor prefixes

### State Management
- **React Context API**: Quản lý state toàn cục
- **Custom Hooks**: Tái sử dụng logic

### Form Handling
- **React Hook Form 7.66.0**: Quản lý form và validation

### Icons
- **Phosphor React 1.4.1**: Icon library
- **Lucide React 0.553.0**: Icon library bổ sung

### Code Quality
- **ESLint 9.36.0**: Linting
- **PropTypes**: Type checking cho props

## 📱 Responsive Design

Ứng dụng được thiết kế responsive với các breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: >= 1024px

### Tính năng responsive

1. **Sidebar**
   - Desktop: Hiển thị cố định bên trái
   - Mobile: Ẩn mặc định, hiển thị dạng overlay khi mở

2. **Header**
   - Desktop: Hiển thị đầy đủ thông tin
   - Mobile: Ẩn một số thông tin, thêm nút menu

3. **Tables**
   - Desktop: Hiển thị dạng bảng đầy đủ
   - Mobile: Chuyển sang dạng card view

4. **Forms**
   - Tự động điều chỉnh kích thước input
   - Nút full-width trên mobile

## 📂 Cấu trúc thư mục chi tiết

### `/src/components`

Chứa các component tái sử dụng:

- **commons/**: Các component cơ bản
  - `Button`: Nút với nhiều variant và size
  - `Input`: Input field với validation
  - `Table`: Bảng dữ liệu có thể tái sử dụng
  - `NavItem`: Item điều hướng

- **modals/**: Các dialog/modal
  - `AddEmployeeModal`: Modal thêm nhân viên
  - `EmployeeDetailModal`: Modal chi tiết nhân viên
  - `AssignUserModal`: Modal gán user

### `/src/contexts`

Quản lý state toàn cục:

- **AuthContext**: Quản lý authentication state
  - `token`: JWT token
  - `currentUser`: Thông tin user hiện tại
  - `login()`: Hàm đăng nhập
  - `logout()`: Hàm đăng xuất

- **EmployeeContext**: Quản lý state nhân viên
  - `employees`: Danh sách nhân viên
  - `getEmployees()`: Lấy danh sách nhân viên
  - `updateEmployeeStatus()`: Cập nhật trạng thái

### `/src/hook`

Custom hooks:

- **useAuth**: Hook để truy cập AuthContext
- **useEmployee**: Hook để truy cập EmployeeContext

### `/src/services`

API services được tổ chức theo module:

- **api.jsx**: Cấu hình base URL và headers
- **auth/**: Service xử lý authentication
- **employee/**: Service quản lý nhân viên
- **card/**: Service quản lý thẻ RFID
- **accessLog/**: Service lịch sử truy cập
- **product/**: Service quản lý sản phẩm

### `/src/pages`

Các trang của ứng dụng:

- **auth/**: Trang authentication
- **home/**: Trang chủ và các trang quản lý chính
- **AccessLogManagement/**: Trang quản lý lịch sử ra vào
- **CardManagement/**: Trang quản lý thẻ
- **ETHHistoryManagement/**: Trang quản lý lịch sử ETH
- **ShopManagerment/**: Trang quản lý cửa hàng

### `/src/layouts`

Layout components:

- **AdminLayout**: Layout chính với Sidebar và Header
- **AuthLayout**: Layout cho trang auth (nếu cần)
- **Header**: Component header với user info và logout
- **Sidebar**: Component sidebar với navigation menu

### `/src/constants`

Các hằng số của ứng dụng:

- `ROUTES`: Định nghĩa các route paths
- `STATUS_LABELS`: Nhãn trạng thái
- `STATUS_COLORS`: Màu sắc cho trạng thái
- `BREAKPOINTS`: Breakpoints responsive
- `DATE_FORMAT_OPTIONS`: Tùy chọn format ngày tháng

## 🔒 Bảo mật

- Sử dụng JWT token để xác thực
- Protected routes yêu cầu đăng nhập
- Token được lưu trong localStorage
- Headers Authorization được tự động thêm vào mọi request

## 🎨 Styling Guidelines

- Sử dụng Tailwind CSS utility classes
- Màu chủ đạo: Purple (purple-500, purple-600)
- Breakpoints theo Tailwind defaults
- Component styling nhất quán

## 📝 Scripts

- `npm run dev`: Chạy dev server
- `npm run build`: Build cho production
- `npm run preview`: Preview build
- `npm run lint`: Chạy ESLint

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này thuộc về [Tên tổ chức/cá nhân]

## 👥 Tác giả

- **Tên tác giả** - [GitHub](https://github.com/username)

## 🙏 Lời cảm ơn

Cảm ơn tất cả các thư viện và công cụ mã nguồn mở đã được sử dụng trong dự án này.
