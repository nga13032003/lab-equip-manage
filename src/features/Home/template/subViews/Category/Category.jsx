import React from 'react';
import { thietbi, dungcu, thinghiem } from '../../../../../assets';

const devices = [
  {
    id: 1,
    name: 'Bộ thiết bị thí nghiệm về Điện phân',
    imageUrl: thietbi,
  },
  {
    id: 2,
    name: 'Bộ dụng cụ thí nghiệm',
    imageUrl: dungcu,
  },
  {
    id: 3,
    name: 'Thí nghiệm hóa sinh',
    imageUrl: thinghiem,
  },
  // Thêm các thiết bị khác ở đây
];

const Category = () => {
  return (
    <div className="category-container max-w-1200 mx-auto p-5">
      <h1 className="text-2xl mb-6">Danh Sách Thiết Bị Dụng Cụ</h1>
      <div className="grid grid-cols-3 gap-5">
        {devices.map((device) => (
          <div key={device.id} className="device-card bg-white rounded-lg p-4 border border-gray-300 transition-transform transform hover:shadow-lg hover:-translate-y-1 cursor-pointer">
            <img src={device.imageUrl} alt={device.name} className="device-image w-full aspect-square object-cover rounded-lg mb-3" />
            <p className="device-name text-lg font-medium text-gray-800">{device.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
