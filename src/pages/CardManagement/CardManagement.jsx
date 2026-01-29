import React, { useState, useEffect } from 'react'
import Button from '../../components/commons/button/Button'
import Table from '../../components/commons/table/Table'
import cardService from '../../services/card/cardService.jsx'

const CardManagement = () => {
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadCards()
    }, [])

    const loadCards = async () => {
        setLoading(true)
        try {
            const data = await cardService.getCards()
            setCards(data.cards || [])
        } catch (error) {
            console.error('Lỗi khi tải thẻ:', error)
            alert('Không thể tải danh sách thẻ. Vui lòng kiểm tra kết nối API.')
            setCards([])
        } finally {
            setLoading(false)
        }
    }

    const handleDeactivate = async (cardId) => {
        if (window.confirm('Bạn có chắc muốn vô hiệu hóa thẻ này?')) {
            try {
                await cardService.deactivateCard(cardId)
                loadCards()
                alert('Vô hiệu hóa thẻ thành công!')
            } catch (error) {
                console.error('Lỗi khi vô hiệu hóa thẻ:', error)
                alert('Không thể vô hiệu hóa thẻ.')
            }
        }
    }

    const handleActivate = async (cardId) => {
        try {
            await cardService.activateCard(cardId)
            loadCards()
            alert('Kích hoạt thẻ thành công!')
        } catch (error) {
            console.error('Lỗi khi kích hoạt thẻ:', error)
            alert('Không thể kích hoạt thẻ.')
        }
    }

    const handleDelete = async (cardId) => {
        if (window.confirm('Bạn có chắc muốn xóa thẻ này? Hành động này không thể hoàn tác.')) {
            try {
                await cardService.deleteCard(cardId)
                loadCards()
                alert('Xóa thẻ thành công!')
            } catch (error) {
                console.error('Lỗi khi xóa thẻ:', error)
                alert('Không thể xóa thẻ.')
            }
        }
    }


    const columns = [
        { key: 'id', header: 'ID' },
        { key: 'card_uid', header: 'Mã Thẻ UID' },
        {
            key: 'user_id',
            header: 'Id Người Được Gán',
            render: (card) => card.user_id ? `${card.user_id}` : 'Chưa gán'
        },
        {
            key: 'is_active',
            header: 'Trạng Thái',
            render: (card) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    card.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {card.is_active ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
                </span>
            )
        },
        {
            key: 'issued_at',
            header: 'Ngày Cấp',
            render: (card) => card.issued_at ? new Date(card.issued_at).toLocaleDateString('vi-VN') : 'Chưa có'
        },
        {
            key: 'actions',
            header: 'Thao Tác',
            render: (card) => (
                <div className="flex space-x-2">
                    {card.is_active ? (
                        <Button variant="danger" size="small" onClick={() => handleDeactivate(card.id)}>Vô Hiệu Hóa</Button>
                    ) : (
                        <Button variant="success" size="small" onClick={() => handleActivate(card.id)}>Kích Hoạt</Button>
                    )}

                    <Button variant="secondary" size="small" onClick={() => handleDelete(card.id)}>Xóa</Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quản Lý Thẻ RFID</h2>
                    <p className="text-gray-600">Quản lý và theo dõi tất cả thẻ RFID trong hệ thống</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-900">Tổng Số Thẻ</h3>
                    <p className="text-2xl font-bold text-primary-600">{cards.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-900">Thẻ Đang Hoạt Động</h3>
                    <p className="text-2xl font-bold text-green-600">{cards.filter(card => card.is_active).length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-900">Thẻ Đã Vô Hiệu Hóa</h3>
                    <p className="text-2xl font-bold text-red-600">{cards.filter(card => !card.is_active).length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-900">Thẻ Đã Gán</h3>
                    <p className="text-2xl font-bold text-purple-600">{cards.filter(card => card.user_id).length}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                    </div>
                ) : (
                    <Table columns={columns} data={cards} emptyMessage="Không tìm thấy thẻ nào" />
                )}
            </div>
        </div>
    )
}

export default CardManagement
