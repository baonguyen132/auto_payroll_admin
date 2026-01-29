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

    const activeCards = cards.filter(card => card.is_active).length
    const inactiveCards = cards.filter(card => !card.is_active).length
    const assignedCards = cards.filter(card => card.user_id).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Quản Lý Thẻ RFID</h2>
                <p className="text-purple-100 text-sm">Quản lý và theo dõi tất cả thẻ RFID trong hệ thống</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Tổng Số Thẻ</h3>
                    <p className="text-3xl font-bold text-purple-600">{cards.length}</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Thẻ Đang Hoạt Động</h3>
                    <p className="text-3xl font-bold text-green-600">{activeCards}</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Thẻ Đã Vô Hiệu Hóa</h3>
                    <p className="text-3xl font-bold text-red-600">{inactiveCards}</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Thẻ Đã Gán</h3>
                    <p className="text-3xl font-bold text-indigo-600">{assignedCards}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col justify-center items-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
                        <span className="text-gray-600 font-medium">Đang tải dữ liệu...</span>
                    </div>
                ) : (
                    <Table columns={columns} data={cards} emptyMessage={
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium">Không tìm thấy thẻ nào</p>
                        </div>
                    } />
                )}
            </div>
        </div>
    )
}

export default CardManagement
