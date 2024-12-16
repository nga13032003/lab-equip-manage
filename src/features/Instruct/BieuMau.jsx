import React, { useState } from 'react';
import { Button, Modal, Upload, message } from 'antd';
import { FileExcelOutlined, FileWordOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const FormSelection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handle file selection
  const handleFileChange = (info) => {
    const file = info.file.originFileObj;
    if (file && (file.name.endsWith('.docx') || file.name.endsWith('.xlsx'))) {
      setSelectedFile(file);
      if (file.name.endsWith('.xlsx')) {
        readExcelFile(file);
      } else if (file.name.endsWith('.docx')) {
        readWordFile(file);
      }
      setVisible(true); // Show preview modal
    } else {
      message.error('Chỉ chấp nhận tệp Word hoặc Excel');
    }
  };

  // Read Excel file and show preview
  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
      setFilePreview(json);
    };
    reader.readAsBinaryString(file);
  };

  // Read Word file (basic text content preview)
  const readWordFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setFilePreview(text);
    };
    reader.readAsText(file);
  };

  // Close preview modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Save the file (e.g., download as Excel)
  const handleSave = () => {
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      if (fileExtension === 'xlsx') {
        // Handle Excel file saving
        const blob = new Blob([selectedFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, selectedFile.name);
      } else if (fileExtension === 'docx') {
        // Handle Word file saving
        const blob = new Blob([selectedFile], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        saveAs(blob, selectedFile.name);
      }
      message.success('Tệp đã được lưu thành công');
    }
  };

  return (
    <div>
      <h2>Chọn Biểu Mẫu</h2>
      <Upload
        customRequest={handleFileChange}
        showUploadList={false}
        accept=".docx, .xlsx"
        maxCount={1}
      >
        <Button icon={<FileExcelOutlined />} style={{ marginRight: 8 }}>Tải lên tệp Excel</Button>
        <Button icon={<FileWordOutlined />}>Tải lên tệp Word</Button>
      </Upload>

      <Modal
        title="Xem trước Biểu Mẫu"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: 20 }}>
          {filePreview ? (
            filePreview instanceof Array ? (
              <pre>{JSON.stringify(filePreview, null, 2)}</pre> // For Excel preview (JSON)
            ) : (
              <pre>{filePreview}</pre> // For Word preview (text)
            )
          ) : (
            <span>Chưa có nội dung để xem trước.</span>
          )}
        </div>
        <Button icon={<CloseOutlined />} onClick={handleCancel} style={{ marginRight: 8 }}>Thoát</Button>
        <Button icon={<SaveOutlined />} onClick={handleSave}>Lưu</Button>
      </Modal>
    </div>
  );
};

export default FormSelection;
