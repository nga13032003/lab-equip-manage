const express = require('express');
const mysql = require('mysql2'); // Sử dụng MySQL
const cors = require('cors');  // Cài đặt để xử lý CORS nếu cần
const app = express();
const port = 7019;

// Middleware để xử lý CORS
app.use(cors());

// Middleware để xử lý dữ liệu JSON
app.use(express.json());

// Kết nối cơ sở dữ liệu MySQL
const db = mysql.createConnection({
  host: 'localhost',    // Đảm bảo đây là đúng tên host của bạn
  user: 'root',         // Tên người dùng của bạn
  password: 'password', // Mật khẩu của bạn (thay bằng mật khẩu thực tế)
  database: 'QuanLyTThietBiDungCuPhongLab', // Tên cơ sở dữ liệu của bạn
});

// Kiểm tra kết nối cơ sở dữ liệu
db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối cơ sở dữ liệu:', err.message);
    throw err;
  }
  console.log('Đã kết nối tới cơ sở dữ liệu MySQL');
});

// API để lấy danh sách thiết bị chưa bảo dưỡng
app.get('/api/thietbi/chua-baoduong', (req, res) => {
  const query = `
    SELECT * FROM ThietBi
    WHERE maThietBi NOT IN (SELECT maThietBi FROM ChiTietBaoDuongTB);
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', err.message);
      return res.status(500).json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu' });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Không có thiết bị nào chưa bảo dưỡng' });
    }

    res.json(results); // Trả về danh sách thiết bị chưa bảo dưỡng
  });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
