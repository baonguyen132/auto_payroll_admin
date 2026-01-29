import React, { useState, useEffect, useMemo } from 'react';
import Table from '../../components/commons/table/Table';
import Button from '../../components/commons/button/Button'; 
import { 
    Package, 
    Search, 
    X, 
    DollarSign, 
    Tag, 
    RefreshCw,
    Trash2
} from 'lucide-react'; 
import { productService } from '../../services/product/productService';

import { API_URL_IMAGE as IPFS_GATEWAY } from '../../services/api';
import { BASE_URL } from '../../services/api';

const ShopManagerment = () => {
    // --- Local State ---
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // State cho Modal Add/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        productCode: '',
        name: '',
        priceEther: '',
        imageFile: null
    });
    
    // State cho Modal Xác nhận xóa
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    // --- Helpers ---
    const formatWeiToEth = (wei) => {
        if (!wei) return '0';
        return (parseFloat(wei) / 1e18).toString();
    };

    const getImageUrl = (ipfsHash) => {
        if (!ipfsHash) return null;
        return IPFS_GATEWAY+'ipfs/'+ipfsHash;
    };

    // --- API Loading Logic ---
    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const data = await productService.getProducts();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi tải sản phẩm:", error);
            // Có thể thêm toast thông báo lỗi ở đây
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // --- Stats Calculation ---
    const stats = useMemo(() => {
        const safeProducts = Array.isArray(products) ? products : [];
        const totalProducts = safeProducts.length;
        
        // Tính tổng giá trị kho (quy đổi từ Wei -> Eth)
        const totalValueEth = safeProducts.reduce((acc, curr) => {
            const ethValue = parseFloat(curr.priceWei || 0) / 1e18;
            return acc + ethValue;
        }, 0);

        const avgPrice = totalProducts > 0 ? (totalValueEth / totalProducts) : 0;
        return { totalProducts, avgPrice, totalValueEth };
    }, [products]);

    // --- Filter Logic ---
    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];
        return products.filter(p => 
            (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.productCode && p.productCode.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [products, searchTerm]);

    // --- Handlers ---
    const handleOpenModal = (product = null) => {
        if (product) {
            // Mode Edit
            setEditingProduct(product);
            setFormData({
                productCode: product.productCode,
                name: product.name,
                priceEther: formatWeiToEth(product.priceWei),
                imageFile: null
            });
        } else {
            // Mode Add
            setEditingProduct(null);
            setFormData({ productCode: '', name: '', priceEther: '', imageFile: null });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate cơ bản
        if (!formData.name || !formData.priceEther) {
            alert("Vui lòng nhập tên và giá sản phẩm");
            return;
        }

        setIsLoading(true);
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('priceEther', formData.priceEther);
        if (formData.imageFile) {
            submitData.append('imageFile', formData.imageFile);
        }

        try {
            if (editingProduct) {
                // Update
                await productService.updateProduct(editingProduct.productCode, submitData);
                alert("Cập nhật sản phẩm thành công!");
            } else {
                // Create
                if(!formData.productCode) {
                    alert("Vui lòng nhập mã sản phẩm");
                    setIsLoading(false);
                    return;
                }
                submitData.append('productCode', formData.productCode);
                await productService.createProduct(submitData);
                alert("Thêm sản phẩm thành công!");
            }
            setIsModalOpen(false);
            loadProducts();
        } catch (error) {
            alert("Lỗi: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Xóa sản phẩm ---
    const handleOpenDeleteModal = (product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
        await productService.deleteProduct(productToDelete.productCode);
        
        // Hiển thị thông báo thành công
        alert("Xóa sản phẩm thành công!");
        
        // Đóng modal và refresh
        setIsDeleteModalOpen(false);
        loadProducts();
        
    } catch (error) {
        console.error('Delete error details:', error);
        
        // Phân loại lỗi để hiển thị thông báo phù hợp
        let errorMessage = "Lỗi xóa sản phẩm: " + error.message;
        
        if (error.message.includes('404') || error.message.includes('Not Found')) {
            errorMessage = "API không hỗ trợ xóa sản phẩm. Vui lòng liên hệ quản trị viên.";
        } else if (error.message.includes('401') || error.message.includes('403')) {
            errorMessage = "Bạn không có quyền xóa sản phẩm này.";
        } else if (error.message.includes('500')) {
            errorMessage = "Lỗi máy chủ. Vui lòng thử lại sau.";
        }
        
        alert(errorMessage);
        
        // Nếu là lỗi API không hỗ trợ, đóng modal
        if (error.message.includes('không hỗ trợ')) {
            setIsDeleteModalOpen(false);
        }
    } finally {
        setIsDeleting(false);
        setProductToDelete(null);
    }
};

    // --- Cấu hình cột bảng ---
    const columns = [
        {
            key: 'image',
            header: 'Hình ảnh',
            width: '100px',
            render: (row) => (
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center group relative">
                    {row.image ? (
                        <img 
                            src={getImageUrl(row.image)} 
                            alt={row.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/64?text=Error"}}
                        />
                    ) : (
                        <Package className="text-gray-400" size={24} />
                    )}
                </div>
            )
        },
        {
            key: 'info',
            header: 'Thông tin sản phẩm',
            render: (row) => (
                <div>
                    <div className="font-bold text-gray-900">{row.name}</div>
                    <div className="text-sm text-gray-500 font-mono">CODE: {row.productCode}</div>
                </div>
            )
        },
        {
            key: 'price',
            header: 'Giá (ETH)',
            width: '150px',
            render: (row) => (
                <span className="font-mono font-bold text-indigo-600">
                    {parseFloat(formatWeiToEth(row.priceWei)).toFixed(5)} ETH
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Thao tác',
            width: '150px',
            render: (row) => (
                <div className="flex gap-2">
                    <Button 
                        variant="secondary" 
                        size="small" 
                        icon="PencilSimple"
                        onClick={() => handleOpenModal(row)}
                        title="Chỉnh sửa"
                    >
                        Sửa
                    </Button>
                    <Button 
                        variant="danger" 
                        size="small" 
                        icon="Trash"
                        onClick={() => handleOpenDeleteModal(row)}
                        title="Xóa sản phẩm"
                    >
                        Xóa
                    </Button>
                </div>
            )
        }
    ];

    // --- Render ---
    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quản Lý Sản Phẩm</h2>
                    <p className="text-gray-500 text-sm">Quản lý kho hàng trên mạng lưới Blockchain</p>
                </div>
                <Button
                    variant="primary"
                    icon="Plus"
                    onClick={() => handleOpenModal(null)}
                >
                    Thêm Sản Phẩm
                </Button>
            </div>

            {/* Thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Package size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Tổng sản phẩm</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalProducts}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full"><DollarSign size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Giá trung bình</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.avgPrice.toFixed(4)} ETH</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><Tag size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Tổng giá trị niêm yết</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalValueEth.toFixed(4)} ETH</h3>
                    </div>
                </div>
            </div>

            {/* Toolbar Tìm kiếm & Refresh */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <input
                        className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                        placeholder="Tìm kiếm theo tên hoặc mã..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        icon="ArrowsClockwise"
                        onClick={loadProducts}
                        isDisabled={isLoading}
                    >
                        Làm mới
                    </Button>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {isLoading && products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <RefreshCw size={32} className="animate-spin mb-2" />
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        data={filteredProducts}
                        emptyMessage={
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <Package size={48} className="mb-2 text-gray-300" />
                                <p>Chưa có sản phẩm nào</p>
                            </div>
                        }
                    />
                )}
            </div>

            {/* Modal Thêm/Sửa */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã sản phẩm</label>
                                <input
                                    type="text"
                                    value={formData.productCode}
                                    onChange={(e) => setFormData({...formData, productCode: e.target.value})}
                                    disabled={!!editingProduct}
                                    className={`w-full px-4 py-2 border rounded-xl outline-none transition-all ${
                                        editingProduct ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-purple-400'
                                    }`}
                                    placeholder="VD: PRD001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                                    placeholder="VD: Mèo Anh Lông Ngắn"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giá (ETH)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.000000000000000001"
                                        value={formData.priceEther}
                                        onChange={(e) => setFormData({...formData, priceEther: e.target.value})}
                                        className="w-full pl-4 pr-12 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                                        placeholder="0.001"
                                    />
                                    <span className="absolute right-4 top-2 text-gray-400 font-medium">ETH</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Hệ thống sẽ tự động chuyển đổi sang Wei khi lưu.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                            </div>
                                    
                            <div className="pt-3 flex gap-1 justify-center">
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    onClick={() => {
                                        if (!formData.name) {
                                            alert("Vui lòng nhập tên sản phẩm trước khi tạo ảnh.");
                                            return;
                                        }

                                        setIsGeneratingImage(true);
                                        setGeneratedImageUrl(null);

                                        productService.generateImage(formData.name)
                                            .then((res) => {
                                                if (res && res.pathImage) {
                                                    setGeneratedImageUrl(BASE_URL + "generated.png"); 
                                                    alert("Tạo ảnh thành công! Vui lòng tải ảnh về và upload thủ công.");
                                                    window.open(res.pathImage, '_blank');
                                                } else {
                                                    alert("Không nhận được URL ảnh từ AI.");
                                                }
                                            })
                                            .catch((err) => {
                                                alert("Lỗi khi tạo ảnh: " + err.message);
                                            })
                                            .finally(() => {
                                                setIsGeneratingImage(false);
                                            });
                                    }}
                                >
                                    {isGeneratingImage ? "Đang tạo ảnh..." : "Tạo ảnh"}
                                </Button>
                            </div>

                            {/* Text chờ */}
                            {isGeneratingImage && (
                                <p className="text-sm text-blue-600 text-center mt-2 animate-pulse">
                                    Đang tạo ảnh, vui lòng chờ...
                                </p>
                            )}

                            {/* Preview ảnh */}
                            {generatedImageUrl && (
                                <div className="mt-3 flex justify-center">
                                    <img 
                                        src={generatedImageUrl}
                                        alt="Generated preview"
                                        className="w-40 h-40 object-cover rounded-xl border shadow"
                                    />
                                </div>
                            )}


                            <div className="pt-4 flex gap-3 justify-end">
                                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
                                <Button type="submit" variant="primary" isDisabled={isLoading}>
                                    {isLoading ? 'Đang xử lý...' : (editingProduct ? 'Cập nhật' : 'Thêm mới')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Xác nhận xóa */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Xác nhận xóa sản phẩm</h3>
                            <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg">
                                <div className="p-2 bg-red-100 text-red-600 rounded-full">
                                    <Trash2 size={24} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Bạn có chắc chắn muốn xóa sản phẩm này?</p>
                                    <p className="text-sm text-gray-600 mt-1">Hành động này không thể hoàn tác.</p>
                                </div>
                            </div>
                            
                            {productToDelete && (
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        {productToDelete.image && (
                                            <img 
                                                src={getImageUrl(productToDelete.image)} 
                                                alt={productToDelete.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <p className="font-bold text-gray-900">{productToDelete.name}</p>
                                            <p className="text-sm text-gray-500">Mã: {productToDelete.productCode}</p>
                                            <p className="text-sm font-medium text-indigo-600">
                                                {parseFloat(formatWeiToEth(productToDelete.priceWei)).toFixed(5)} ETH
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex gap-3 justify-end pt-4">
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    isDisabled={isDeleting}
                                >
                                    Hủy bỏ
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="danger" 
                                    onClick={handleDeleteProduct}
                                    isDisabled={isDeleting}
                                    icon="Trash"
                                >
                                    {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopManagerment;