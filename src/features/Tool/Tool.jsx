import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchToolsByType } from '../../api/toolApi';

const Tool = () => {
    const { maLoaiDC } = useParams(); // Lấy đúng tham số từ URL
  const [tools, setTools] = useState([]); // Lưu trữ danh sách dụng cụ
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const getTools = async () => {
      try {
        const response = await fetchToolsByType(maLoaiDC); // Gọi API để lấy dụng cụ
        setTools(response); // Lưu dụng cụ vào state
      } catch (error) {
        console.error('Error fetching tools:', error); // Xử lý lỗi
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };
    getTools();
  }, [maLoaiDC]); // Chạy lại khi mã loại thay đổi

  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi đang tải
  }

  return (
    <div className="tool-container max-w-1200 mx-auto p-5">
      <h1 className="text-2xl mb-6">Danh Sách Dụng Cụ</h1>
      <div className="grid grid-cols-3 gap-5">
        {tools.length === 0 ? (
          <p>Không có dụng cụ nào trong danh mục này.</p>
        ) : (
          tools.map((tool) => (
            <div
              key={tool.maDungCu}
              className="tool-card bg-white rounded-lg p-4 border border-gray-300 transition-transform transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <img
                src={tool.hinhAnhUrl || 'default-image.jpg'}
                alt={tool.tenDungCu}
                className="tool-image w-full aspect-square object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-medium text-gray-800">{tool.tenDungCu}</h3>
              <p className="text-sm text-gray-600">
                Loại: {tool.loaiDungCu?.tenLoaiDC || 'Không rõ'}
              </p>
              <p className="text-sm text-gray-600">Xuất xứ: {tool.xuatXu}</p>
              <p className="text-sm text-gray-600">Tình trạng: {tool.tinhTrang}</p>
              <p className="text-sm text-gray-600">
                Ngày bảo hành: {new Date(tool.ngayBaoHanh).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tool;
