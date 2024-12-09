import React from "react";
import "./Instruct.scss"; 
import { thietbi, thinghiem } from "../../assets";

const DaoTao = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="dao-tao-container">
      <header className="article-header">
        <h1>Tăng Cường Quản Lý Thiết Bị Phòng Thí Nghiệm Bằng Giải Pháp Đào Tạo Chuyên Sâu</h1>
      </header>
      <p className="sub-title">
        Một bước tiến mới trong công tác quản lý thiết bị tại Đại học Công thương TP.HCM.
      </p>
      <div className="article-content">
        <section className="section">
          <h2>Thực trạng quản lý thiết bị thí nghiệm hiện nay</h2>
          <p>
            Theo khảo sát từ khoa Hóa học, Đại học Công thương TP.HCM, hiện nay công tác quản lý thiết bị vẫn phụ thuộc nhiều vào sổ sách giấy tờ và quản lý nhân sự thủ công. 
            Cách làm này không chỉ tiêu tốn thời gian mà còn dễ dẫn đến những sai sót nghiêm trọng như mất mát thiết bị, chậm trễ trong bảo dưỡng, hoặc khó khăn trong việc theo dõi lịch sử sử dụng.
          </p>
          <img
            src={thinghiem}
            alt="Hình minh họa thực trạng quản lý thiết bị"
            className="article-image"
          />
          <p>
            Các thiết bị thí nghiệm, vốn có giá trị lớn và đòi hỏi bảo quản cẩn thận, lại thường xuyên bị hư hỏng hoặc không được bảo dưỡng kịp thời do thiếu một hệ thống quản lý tự động. 
            Điều này không chỉ gây lãng phí tài nguyên mà còn ảnh hưởng đến chất lượng giảng dạy và nghiên cứu.
          </p>
        </section>

        <section className="section">
          <h2>Giải pháp từ đào tạo chuyên sâu</h2>
          <p>
            Đào tạo chuyên sâu về quản lý thiết bị phòng thí nghiệm là bước đi đột phá, giúp nâng cao năng lực của đội ngũ quản lý và giảng viên trong việc vận hành hệ thống quản lý hiện đại.
          </p>
          <img
            src={thietbi}
            alt="Hình minh họa giải pháp đào tạo"
            className="article-image"
          />
          <p>
            Chương trình đào tạo không chỉ tập trung vào việc sử dụng công nghệ quản lý mà còn trang bị cho học viên những kỹ năng mềm cần thiết như quản lý thời gian, giải quyết vấn đề và làm việc nhóm trong môi trường thí nghiệm.
          </p>
        </section>

        <section className="section">
          <h2>Lợi ích mang lại cho hệ thống giáo dục</h2>
          <p>
            Chương trình đào tạo chuyên sâu không chỉ cải thiện năng lực cá nhân mà còn mang lại nhiều lợi ích dài hạn cho cả hệ thống giáo dục.
          </p>
          <ul>
            <li>Tiết kiệm chi phí và thời gian nhờ ứng dụng công nghệ quản lý hiện đại.</li>
            <li>Nâng cao chất lượng giảng dạy và nghiên cứu.</li>
            <li>Mở ra nhiều cơ hội phát triển chuyên môn cho giảng viên và cán bộ quản lý.</li>
          </ul>
        </section>
      </div>
      <footer className="article-footer">
        <p>
          Đây là một bước tiến quan trọng trong việc hiện đại hóa quản lý thiết bị tại Đại học Công thương TP.HCM, tạo tiền đề cho một môi trường giáo dục an toàn và hiệu quả.
        </p>
      </footer>
      <div className="print-button-container">
        <button onClick={handlePrint} className="print-button">
          In Nội Dung
        </button>
      </div>
    </div>
  );
};

export default DaoTao;
