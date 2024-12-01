// src/utils/uploadImage.js
import axios from 'axios';
import { message } from 'antd';

const uploadImage = async (file, uploadType) => {
  const formData = new FormData();
  formData.append('file', file);

  const endpoint =
    uploadType === 'upLoadThietBi'
      ? 'https://localhost:7019/api/ImageUpload/uploadThietBi'
      : 'https://localhost:7019/api/ImageUpload/uploadDungCu';

  try {
    // Gửi hình ảnh đến API
    const response = await axios.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Handle success response
    message.success(`${file.name} tải lên thành công.`);
    return response.data; // Return the response data if needed

  } catch (error) {
    // Handle error response
    message.error('Tải lên thất bại!');
    throw error;
  }
};

export default uploadImage;
