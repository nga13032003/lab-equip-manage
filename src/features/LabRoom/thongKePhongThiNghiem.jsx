
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Spin, Typography } from 'antd';
import { getAllPhongThiNghiem } from '../../api/labApi';
import { getAllViTriDungCu } from '../../api/viTriDungCu';
import { getThietBiData } from '../../api/deviceApi';

const { Title } = Typography;

const ThongKePhongThiNghiem = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [phongThiNghiem, viTriDungCu, thietBi] = await Promise.all([
          getAllPhongThiNghiem(),
          getAllViTriDungCu(),
          getThietBiData(),
        ]);

        // Ghép dữ liệu dựa trên mã phòng
        const aggregatedData = phongThiNghiem.map((phong) => {
          const soLuongDungCu = viTriDungCu.filter(
            (dungCu) => dungCu.maPhong === phong.maPhong
          ).length;
          const soLuongThietBi = thietBi.filter(
            (tb) => tb.maPhong === phong.maPhong
          ).length;

          return {
            maPhong: phong.maPhong,
            tenPhong: phong.loaiPhong,
            soLuongDungCu,
            soLuongThietBi,
          };
        });

        setData(aggregatedData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>Thống Kê Phòng Thí Nghiệm</Title>
      {loading ? (
        <Spin size="large" />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="maPhong" label={{ value: 'Mã Phòng', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Số Lượng', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="soLuongDungCu" name="Số Lượng Dụng Cụ" fill="#8884d8" />
            <Bar dataKey="soLuongThietBi" name="Số Lượng Thiết Bị" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ThongKePhongThiNghiem;
