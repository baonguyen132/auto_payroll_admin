import React from "react";
import Button from "../commons/button/Button";

const AssignUserModal = ({ show, card, onClose, onConfirm }) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // DEMO: Hiện thông báo thay vì gọi API
    alert(`Gán thẻ ${card?.card_uid} cho người dùng (demo)`);
    onConfirm && onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Gán Người Dùng Cho Thẻ
        </h3>

        <p className="text-gray-600 mb-4">
          Chọn người dùng để gán cho thẻ <span className="font-semibold">{card?.card_uid}</span>
        </p>

        {/* DEMO: Chưa load nhân viên */}
        <div className="text-center py-6 text-gray-500 italic">
          Danh sách nhân viên sẽ hiển thị ở đây (DEMO)
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Xác Nhận (Demo)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignUserModal;
