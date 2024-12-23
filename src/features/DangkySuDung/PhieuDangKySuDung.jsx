import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Checkbox, List, Space, message, DatePicker, Select} from 'antd';
import { createPhieuDangKi, getExistingPhieuDangKi, fetchDevicesInLab, fetchToolsInLab } from '../../api/phieuDangKi';
import './PhieuDangKySuDung.scss';
import { useNavigate } from 'react-router-dom';
import { createChiTietDeXuatDungCu, getChiTietDangKiDungCu, getDangKiDungCuByMaPhieu } from '../../api/dangKiDC';
import { createChiTietDangKiThietBi, getChiTietDangKiThietBi, getDangKyThietBiByMaPhieu } from '../../api/dangKiThietBi';
import { fetchDeviceTypes } from '../../api/deviceTypeApi';
import { fetchDevicesByType } from '../../api/deviceApi';
import { fetchToolTypes } from '../../api/toolTypeApi';
import { fetchToolsByType, getAllTools, getToolById, getQuantitiesByToolCode } from '../../api/toolApi';
import { getAllPhongThiNghiem, getDungCuInLab, getDevicesInLab } from '../../api/labApi';
import { getLichDungCuByMaPhong, getAllLichDungCu , getNgaySuDungLichDungCu, getNgaySuDungByMaPhong, getNgayKetThucByMaPhong, getNgayKetThucLichDungCu} from '../../api/lichDungCu';
import { getLichTietBiByMaPhong, getAllLichThietBi, getAllNgaySuDungThietBi, getAllNgayKetThucThietBi, getNgaySuDungThietBiByMaPhong, getNgayKetThucThietBiByMaPhong } from '../../api/lichThietBI';
import { red } from '@mui/material/colors';

const PhieuDangKySuDung = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [toolList, setToolList] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [deviceTypes, setDeviceTypes] = useState([]); // Danh sách loại thiết bị
  const [selectedDeviceType, setSelectedDeviceType] = useState(''); // Mã loại thiết bị được chọn
  const [filteredDevices, setFilteredDevices] = useState([]); // Danh sách thiết bị theo loại
  const [toolTypes, setToolTypes] = useState([]); // Danh sách loại thiết bị
  const [selectedToolType, setSelectedToolType] = useState(''); // Mã loại thiết bị được chọn
  const [filteredTools, setFilteredTools] = useState([]); // Danh sách thiết bị theo loại
  const [phongThiNghiemList, setPhongThiNghiemList] = useState([]);
  const [selectedPhong, setSelectedPhong] = useState(null);  
  const [maphieudk, setMaphieudk] = useState('');
  const [lichThietBi, setLichThietBi] = useState([]);
  const [lichDungCu, setLichDungCu] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]); 
  const [unavailableEndDates, setUnavailableEndDates] = useState([]); 
  const [quantityError, setQuantityError] = useState(''); // Trạng thái lưu lỗi
  
  const [form] = Form.useForm();
  const navigate = useNavigate();

  console.log(unavailableDates);

  useEffect(() => {
    const storedEmployeeName = localStorage.getItem('employeeName');
    if (storedEmployeeName) {
      setEmployeeName(storedEmployeeName);
    }
    const storedEmployeeCode = localStorage.getItem('employeeCode');
    if (storedEmployeeCode) {
      setEmployeeCode(storedEmployeeCode);
    }
  }, []);
  useEffect(() => {
    const fetchDeviceTypesData = async () => {
      try {
        const types = await fetchDeviceTypes();
        setDeviceTypes(types);
      } catch (error) {
        message.error('Lỗi khi tải danh sách loại thiết bị');
      }
    };
    fetchDeviceTypesData();
  }, []);

  useEffect(() => {
    const fetchToolTypesData = async () => {
      try {
        const types = await fetchToolTypes();
        setToolTypes(types);
      } catch (error) {
        message.error('Lỗi khi tải danh sách loại dụng cụ');
      }
    };
    fetchToolTypesData();
  }, []);

  useEffect(() => {
    const fetchPhongThiNghiemList = async () => {
      try {
        const data = await getAllPhongThiNghiem();
        setPhongThiNghiemList(data || []); // Lưu danh sách phòng thí nghiệm vào state
      } catch (error) {
        message.error('Lỗi khi tải danh sách phòng thí nghiệm');
      }
    };
    fetchPhongThiNghiemList();
  }, []);
  
  
  
  const handlePhongChange = async (value) => {
    setSelectedPhong(value);
  
    try {
      // Fetch the approved device and tool usage history for the selected room
      const thietBiLich = await getNgaySuDungThietBiByMaPhong(value);
      const dungCuLich = await getNgaySuDungByMaPhong(value);
  
      // Fetch end dates for devices and tools in the room
      const ngayKetThucDC = await getNgayKetThucByMaPhong(value); // Tools end dates
      const ngayKetThucTB = await getNgayKetThucThietBiByMaPhong(value); // Devices end dates
  
      // Update the state with the fetched data
      setLichThietBi(thietBiLich || []);
      setLichDungCu(dungCuLich || []);
  
      // Generate lists of unavailable usage dates
      const usedDeviceDates = thietBiLich.map(item => dayjs(item.ngaySuDung).format('YYYY-MM-DDTH:mm:ss'));
      const usedToolDates = dungCuLich.map(item => dayjs(item.ngaySuDung).format('YYYY-MM-DDTHH:mm:ss'));
  
      // Combine unavailable start dates
      setUnavailableDates([...usedDeviceDates, ...usedToolDates]);
  
      // Generate unavailable end dates (used in "end date" picker)
      const unavailableEndDatesDC = ngayKetThucDC.map(item => dayjs(item.ngayKetThuc).format('YYYY-MM-DDTHH:mm:ss'));
      const unavailableEndDatesTB = ngayKetThucTB.map(item => dayjs(item.ngayKetThuc).format('YYYY-MM-DDTHH:mm:ss'));
  
      // Combine both unavailable end dates and remove duplicates
      const allUnavailableEndDates = [...new Set([...unavailableEndDatesDC, ...unavailableEndDatesTB])];
  
      setUnavailableEndDates(allUnavailableEndDates);
    } catch (error) {
      message.error('Lỗi khi tải lịch thiết bị hoặc dụng cụ');
    }
  };
  
  const disabledDate = (current) => {
    // Điều kiện 1: Ngày trong quá khứ
    const isPastDate = current && current.isBefore(dayjs().startOf('day'));

    // Điều kiện 2: Ngày trong unavailableDates
    const isUnavailableDate = unavailableDates.some(date => 
      current && current.isSame(dayjs(date), 'day')
    );

    // Trả về true nếu bất kỳ điều kiện nào đúng
    return isPastDate || isUnavailableDate;
  };

  const disabledEndDate = (current, ngaySuDung) => {
    const isBeforeStartDate = current && current <= dayjs(ngaySuDung).endOf('day');
    
    const isUnavailableEndDate = unavailableEndDates.some(date => 
      current && current.isSame(dayjs(date), 'day')
    );
  
    return isBeforeStartDate || isUnavailableEndDate;
  };
  
  const handleDeviceTypeChange = async (index, maLoaiThietBi) => {
    try {
      // Fetch tools based on the selected type
      const devices = await fetchDevicesByType(maLoaiThietBi);
  
      // Filter out tools that have is_deleted as true
      const availableDevices = devices.filter(device => !device.isDeleted);
  
      
      setDeviceList((prevList) =>
        prevList.map((device, idx) =>
          idx === index
            ? { ...device, MaLoaiThietBi: maLoaiThietBi, filteredDevices: availableDevices }
            : device
        )
      );
    } catch (error) {
      message.error('Lỗi khi tải danh sách thiết bị');
    }
  };
  
  const handleToolTypeChange = async (index, maLoaiDC) => {
    try {
      // Fetch tools based on the selected type
      const tools = await fetchToolsByType(maLoaiDC);
  
      // Filter out tools that have is_deleted as true
      const availableTools = tools.filter(tool => !tool.isDeleted);
  
      // Get the selected tool code (first tool in the list, if available)
      const selectedToolCode = availableTools.length > 0 ? availableTools[0].MaDungCu : null;
  
      if (selectedToolCode) {
        // Check if the selected tool has enough quantity
        const availableTool = availableTools.find(tool => tool.MaDungCu === selectedToolCode);
  
        if (availableTool && availableTool.SoLuong <= 0) {
          message.error('Số lượng dụng cụ không đủ. Không thể đăng ký thêm.');
          return;
        }
      }
  
      // Update the tool list after filtering out deleted tools
      setToolList((prevList) =>
        prevList.map((tool, idx) =>
          idx === index
            ? { ...tool, MaLoaiDC: maLoaiDC, filteredTools: availableTools }
            : tool
        )
      );
    } catch (error) {
      message.error('Lỗi khi tải danh sách dụng cụ');
    }
  };
  
  

  const generateRandomMaPhieuDK = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
const fetchAndGenerateUniqueMaPhieu = useCallback(async () => {
  try {
    const existingPhieuDKs = await getExistingPhieuDangKi(); // Fetch existing MaPhieu
    let generatedMaPhieu = generateRandomMaPhieuDK();

    // Check if the generated MaPhieu is unique
    // eslint-disable-next-line
    while (existingPhieuDKs.some((item) => item.MaPhieuDK === generatedMaPhieu)) {
      generatedMaPhieu = generateRandomMaPhieuDK(); // Regenerate if not unique
    }

    setMaphieudk(generatedMaPhieu); // Set the unique MaPhieu
  } catch (error) {
    message.error('Error fetching existing MaPhieu values');
  }
}, []); // Empty array ensures the function is only created once

useEffect(() => {
  fetchAndGenerateUniqueMaPhieu(); // Call on initial render to generate MaPhieu
}, [fetchAndGenerateUniqueMaPhieu]); // Add memoized function as a dependency


  useEffect(() => {
    form.setFieldsValue({ MaPhieuDK: maphieudk });
  }, [maphieudk, form]);

  const handleAddDevice = useCallback(() => {
    setDeviceList((prevList) => [...prevList, { MaThietBi: '', NgayDangKi: dayjs().format('YYYY-MM-DDTHH:mm:ss')
      , NgayKetThuc: null  }]);
  }, []);

  const handleDeviceChange = useCallback((index, field, value) => {
    setDeviceList((prevList) =>
      prevList.map((device, idx) => {
        if (idx === index) {
          if (field === 'NgaySuDung') {
            // Kiểm tra ngày đã chọn không trùng với ngày trong lịch đã phê duyệt
            if (lichThietBi.some((item) => dayjs(item.ngaySuDung).isSame(value, 'day') && item.trangThai === 'Đã phê duyệt')) {
              message.error('Ngày đã có trong phiếu đăng ký đã phê duyệt.');
              return device; // Không thay đổi nếu trùng ngày
            }
          }
          return { ...device, [field]: value };
        }
        return device;
      })
    );
  }, [lichThietBi]); // Lưu ý thêm `lichThietBi` vào dependency để theo dõi lịch đã phê duyệt
  

  

  const handleAddTool = useCallback(() => {
    setToolList((prevList) => [
      ...prevList,
      { MaDungCu: '', SoLuong: 1, NgayDangKi: dayjs().format('YYYY-MM-DDTHH:mm:ss')
        , NgayKetThuc: null  }
    ]);
  }, []);

  const handleToolChange = useCallback((index, field, value) => {
    setToolList((prevList) =>
      prevList.map((tool, idx) => {
        if (idx === index) {
          // Kiểm tra trường hợp thay đổi ngày sử dụng
          if (field === 'NgaySuDung') {
            // Kiểm tra ngày đã chọn không trùng với ngày trong lịch đã phê duyệt
            if (lichDungCu.some((item) => dayjs(item.ngaySuDung).isSame(value, 'day') && item.trangThai === 'Đã phê duyệt')) {
              message.error('Ngày đã có trong phiếu đăng ký đã phê duyệt.');
              return tool; // Không thay đổi nếu trùng ngày
            }
          }
          
          if (field === 'SoLuong') {
            // Kiểm tra số lượng không vượt quá số lượng dụng cụ hiện có
            const selectedTool = tool.filteredTools?.find(t => t.maDungCu === tool.MaDungCu);
            if (selectedTool && value > selectedTool.soLuong) {
              message.error(`Số lượng không thể vượt quá ${selectedTool.soLuong}`);
              return tool; // Không cập nhật nếu vượt quá
            }
          }
          
          return { ...tool, [field]: value };
        }
        return tool;
      })
    );
  }, [lichDungCu]);
 
  const handleSubmit = async (values) => {
    if (!maphieudk) {
        await fetchAndGenerateUniqueMaPhieu(); // Chỉ tạo mã nếu chưa tồn tại
      }
    
    try {
      const payload = {
        maphieudk: maphieudk,
        maNV: employeeCode,
        maPhong: selectedPhong, 
        lyDoDK: values.LyDoDK,
        ghiChu: values.GhiChu,
        ngayLap: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        trangThai: 'Chưa phê duyệt',
        ngayHoanTat: null, 
      };

      await createPhieuDangKi(payload);
      console.log(payload);
      

        const deviceDetailsPromise = deviceList.map(async (device) => {
        const newChitietThietBi = {
            maphieudk: maphieudk,
            MaThietBi: device.MaThietBi,
            tenThietBi: device.tenThietBi,
            NgayDangKi: dayjs(device.NgayDangKi).format('YYYY-MM-DDTHH:mm:ss'),
            ngaySuDung: device.ngaySuDung ? dayjs(device.ngaySuDung).format('YYYY-MM-DDTHH:mm:ss') : null,
            ngayKetThuc: device.ngayKetThuc 
            ? dayjs(device.ngayKetThuc).format('YYYY-MM-DDTHH:mm:ss') 
            : null,
            trangThaiSuDung: 'Chưa sử dụng',
            tinhTrangSuDung: '',
            ngayBatDauThucTe: null,
            ngayKetThucThucTe: null,
        };
          // Tạo chi tiết đăng ký thiết bị
      await createChiTietDangKiThietBi(newChitietThietBi);

      
    });

        const toolDetailsPromises = toolList.map(async (tool) => {
        const newChitietDungCu = {
            maphieudk: maphieudk,
            MaDungCu: tool.MaDungCu,
            tenDungCu: tool.tenDungCu,
            SoLuong: tool.SoLuong,
            NgayDangKi: dayjs(tool.NgayDangKi).format('YYYY-MM-DDTHH:mm:ss'),
            ngaySuDung: tool.ngaySuDung ? dayjs(tool.ngaySuDung).format('YYYY-MM-DDTHH:mm:ss') : null,
            NgayKetThuc: tool.NgayKetThuc
            ? dayjs(tool.NgayKetThuc).format('YYYY-MM-DDTHH:mm:ss') 
            : null,
            trangThaiSuDung: 'Chưa sử dụng',
            tinhTrangSuDung: '',
            ngayBatDauThucTe: null,
            ngayKetThucThucTe: null,
        };

         // Tạo chi tiết đăng ký dụng cụ
      await createChiTietDeXuatDungCu(newChitietDungCu);

     
    });

        
      // Wait for all tool details to be inserted
      await Promise.all([...deviceDetailsPromise, ...toolDetailsPromises]);

      message.success('Phiếu đăng ký đã được lập thành công!');
      form.resetFields();
      setDeviceList([]);
      setToolList([]);
      setSelectedPhong(null);
      fetchAndGenerateUniqueMaPhieu();
      navigate(`/chi-tiet-phieu-dang-ky/${maphieudk}`);
    } catch (error) {
      message.error(`Lỗi khi lập phiếu: ${error.message}`);
    }
  };
  const handleClearDevices = useCallback(() => {
    setDeviceList([]); // Xóa toàn bộ danh sách thiết bị
    message.success('Danh sách thiết bị đã được xóa.');
  }, []);
  
  const handleClearTools = useCallback(() => {
    setToolList([]); // Xóa toàn bộ danh sách dụng cụ
    message.success('Danh sách dụng cụ đã được xóa.');
  }, []);
  

  return (
    <div className="max-w-4xl mx-auto">
          <div className="phieu-dang-ky-container">
      <h1 className="phieu-dang-ky-title text-2xl font-semibold mb-4 text-center">LẬP PHIẾU ĐĂNG KÝ</h1>

      <Checkbox
        className='check-disable'
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Vô hiệu hóa biểu mẫu
      </Checkbox>

      <Form
        form={form}
        className="phieu-dang-ky-form"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        disabled={componentDisabled}
        onFinish={handleSubmit}
      >
        <Form.Item label="Mã phiếu" name="MaPhieuDK">
          <Input value={maphieudk} disabled />
        </Form.Item>

        <Form.Item label="Lý do đăng kí" name="LyDoDK">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Tên nhân viên"
          name="MaNV"
        >
          <Input value={employeeName} disabled /> {/* Disabled input for MaNV */}
        </Form.Item>
        <Form.Item
          label="Phòng thí nghiệm"
          name="MaPhong"
          rules={[{ required: true, message: 'Vui lòng chọn phòng thí nghiệm' }]}
        >
          <Select
            placeholder="Chọn phòng thí nghiệm"
            onChange={handlePhongChange} // Cập nhật mã phòng được chọn
          >
            {phongThiNghiemList.map((phong) => (
              <Select.Option key={phong.maPhong} value={phong.maPhong}>
                {phong.loaiPhong}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>


        <Form.Item label="Ghi chú" name="GhiChu">
          <Input.TextArea rows={3} />
        </Form.Item>

        <h2>Danh sách Thiết Bị</h2>
        <List
          bordered
          dataSource={deviceList}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item label="Loại thiết bị">
                  <Select
                    placeholder="Chọn loại thiết bị"
                    onChange={(value) => handleDeviceTypeChange(index, value)}
                    value={item.MaLoaiThietBi}
                  >
                    {deviceTypes.map((type) => (
                      <Select.Option key={type.maLoaiThietBi} value={type.maLoaiThietBi}>
                        {type.tenLoaiThietBi}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Tên thiết bị">
                  <Select
                    placeholder="Chọn tên thiết bị"
                    onChange={(value) => handleDeviceChange(index, 'MaThietBi', value)}
                    value={item.MaThietBi}
                  >
                    {item.filteredDevices?.map((device) => (
                      <Select.Option key={device.maThietBi} value={device.maThietBi}>
                        {device.tenThietBi}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Ngày đăng ký">
                <DatePicker
                  value={dayjs()} 
                  format="YYYY-MM-DD HH:mm:ss" 
                  disabled
                />
                </Form.Item>
                <Form.Item label="Ngày sử dụng" name="ngaySuDung">
                <DatePicker
                  disabledDate={disabledDate}
                  format="YYYY-MM-DDTHH:mm:ss"
                  onChange={(value) => handleDeviceChange(index, 'ngaySuDung', value)}
                />
              </Form.Item>
                <Form.Item
                  label="Ngày kết thúc"
                  name={`ngayKetThuc-${index}`}
                  rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                >
                  <DatePicker
                    // className="date-picker-ngaykt"
                    format="YYYY-MM-DDTHH:mm:ss"
                    disabledDate={(current) => disabledEndDate(current, form.getFieldValue('ngaySuDung'))}
                    onChange={(value) =>
                      handleDeviceChange(
                        index,
                        'ngayKetThuc',
                        value ? dayjs(value).format('YYYY-MM-DDTHH:mm:ss') : null
                      )
                    }
                  />
                </Form.Item>
              </Space>
            </List.Item>
          )}
        />
        <Form.Item wrapperCol={{ offset: 9, span: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'start', gap: '10px' }}>
          <Button type="dashed" onClick={handleAddDevice} icon={<PlusOutlined />}>
            Thêm thiết bị
          </Button>
          <Button type="danger" onClick={handleClearDevices} style={{backgroundColor: 'red'}}>
            Xóa Thiết Bị
          </Button>
        </div>
      </Form.Item>


        <h2>Danh sách dụng cụ</h2>
        <List
          bordered
          dataSource={toolList}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item label="Loại dụng cụ">
                  <Select
                    placeholder="Chọn loại dụng cụ"
                    onChange={(value) => handleToolTypeChange(index, value)}
                    value={item.MaLoaiDC}
                  >
                    {toolTypes.map((type) => (
                      <Select.Option key={type.maLoaiDC} value={type.maLoaiDC}>
                        {type.tenLoaiDC}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Tên dụng cụ">
                  <Select
                    placeholder="Chọn tên dụng cụ"
                    onChange={(value) => {
                      handleToolChange(index, 'MaDungCu', value); // Giữ nguyên handleToolChange
                      
                    }}
                    value={item.MaDungCu}
                  >
                    {item.filteredTools?.map((tool) => (
                      <Select.Option key={tool.maDungCu} value={tool.maDungCu}>
                        {tool.tenDungCu}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Số lượng"
                  validateStatus={quantityError ? 'error' : ''}
                  help={quantityError || (item.SoLuong <= 0 && 'Số lượng phải lớn hơn 0')}
                >
                  <InputNumber
                    min={1}
                    value={item.SoLuong}
                    onChange={(value) => {
                      // Lấy số lượng tối đa từ danh sách filteredTools
                      const selectedTool = item.filteredTools?.find(tool => tool.maDungCu === item.MaDungCu);
                      const maxQuantity = selectedTool ? selectedTool.soLuong : 0;

                      // Kiểm tra số lượng vượt quá
                      if (value > maxQuantity) {
                        message.error(`Số lượng không thể vượt quá ${maxQuantity}`);
                        return; // Không cập nhật nếu vượt quá số lượng
                      }

                      handleToolChange(index, 'SoLuong', value); // Cập nhật số lượng
                    }}
                  />
                </Form.Item>

                <Form.Item label="Ngày đăng ký">
                <DatePicker
                  value={dayjs()} 
                  format="YYYY-MM-DD HH:mm:ss" 
                  disabled
                />
                </Form.Item>
                <Form.Item label="Ngày sử dụng" key={`ngaySuDung-${index}`}>
                <DatePicker
                  disabledDate={disabledDate}
                  format="YYYY-MM-DDTHH:mm:ss"
                  onChange={(value) => handleToolChange(index, 'ngaySuDung', value)}
                />
                </Form.Item>
                <Form.Item
                  label="Ngày kết thúc"
                  name={`NgayKetThuc-${index}`}
                  rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                >
                  <DatePicker
                    // className="date-picker-ngaykt"
                    format="YYYY-MM-DDTHH:mm:ss"
                    disabledDate={(current) => disabledEndDate(current, form.getFieldValue('ngaySuDung'))}
                    onChange={(value) =>
                      handleToolChange(
                        index,
                        'NgayKetThuc',
                        value ? dayjs(value).format('YYYY-MM-DDTHH:mm:ss') : null
                      )
                    }
                    />
                </Form.Item>
              </Space>
            </List.Item>
          )}
        />
        <Form.Item wrapperCol={{ offset: 9, span: 18 }}>
          <div className="flex gap-x-2">
            <Button type="dashed" onClick={handleAddTool} icon={<PlusOutlined />}>
              Thêm dụng cụ
            </Button>
            <Button type="danger" onClick={handleClearTools} style={{backgroundColor: 'red'}}>
              Xóa Dụng Cụ
            </Button>
          </div>
        </Form.Item>


        <Form.Item wrapperCol={{ offset: 9, span: 18 }}>
        <div className="flex flex-wrap justify-between gap-4 sm:flex-col md:flex-row">
        <Button type="primary" htmlType="submit">
            Lập phiếu đăng ký
          </Button>
          </div>
          
        </Form.Item>
      </Form>
    </div>
    </div>

  );
};

export default PhieuDangKySuDung;
