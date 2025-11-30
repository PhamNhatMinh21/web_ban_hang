
import React from 'react';

interface FooterProps {
  onInfoLinkClick: (title: string, content: React.ReactNode) => void;
}

// --- Content Components for Info Pages ---

const HoTroThanhToan = () => (
    <>
        <h2 className="text-xl font-bold text-white mb-3">Các phương thức thanh toán</h2>
        <p className="mb-4">GymSup hỗ trợ đa dạng các phương thức thanh toán để mang lại sự tiện lợi tối đa cho quý khách:</p>
        <ul className="space-y-4">
            <li>
                <h3 className="font-semibold text-white">1. Thanh toán khi nhận hàng (COD)</h3>
                <p>Quý khách sẽ thanh toán tiền mặt trực tiếp cho nhân viên giao hàng khi nhận sản phẩm. Vui lòng kiểm tra kỹ sản phẩm trước khi thanh toán.</p>
            </li>
            <li>
                <h3 className="font-semibold text-white">2. Chuyển khoản ngân hàng</h3>
                <p>Quý khách có thể chuyển khoản vào tài khoản ngân hàng của GymSup. Vui lòng ghi rõ <strong className="text-gym-yellow">Mã đơn hàng</strong> trong nội dung chuyển khoản.</p>
                <div className="bg-gym-darker p-3 rounded-md mt-2 text-sm">
                    <p><strong>Ngân hàng:</strong> Vietcombank - CN Thăng Long</p>
                    <p><strong>Chủ tài khoản:</strong> CTY TNHH GYMSUP VIETNAM</p>
                    <p><strong>Số tài khoản:</strong> 180069696969</p>
                </div>
            </li>
            <li>
                <h3 className="font-semibold text-white">3. Thanh toán qua Ví điện tử (MoMo, ZaloPay)</h3>
                <p>Chúng tôi chấp nhận thanh toán qua các ví điện tử phổ biến. Quét mã QR sẽ được hiển thị ở bước thanh toán cuối cùng.</p>
            </li>
            <li>
                <h3 className="font-semibold text-white">4. Thanh toán qua thẻ ATM/Visa/Mastercard</h3>
                <p>Hệ thống của chúng tôi được bảo mật và tích hợp với cổng thanh toán VNPay, chấp nhận tất cả các loại thẻ nội địa và quốc tế.</p>
            </li>
        </ul>
    </>
);

const ChinhSachKhachHang = () => (
    <>
        <h2 className="text-xl font-bold text-white mb-3">Chính sách khách hàng thân thiết</h2>
        <p className="mb-4">GymSup tri ân những khách hàng đã luôn tin tưởng và đồng hành. Chương trình Khách hàng thân thiết của chúng tôi bao gồm các cấp độ với những ưu đãi đặc biệt:</p>
        <ul className="space-y-3 list-disc ml-5">
            <li><strong>Thành viên Bạc (Silver):</strong> Tích lũy chi tiêu từ 5,000,000 VNĐ. Giảm giá 3% cho tất cả các đơn hàng tiếp theo.</li>
            <li><strong>Thành viên Vàng (Gold):</strong> Tích lũy chi tiêu từ 15,000,000 VNĐ. Giảm giá 5% cho tất cả các đơn hàng tiếp theo và nhận quà sinh nhật.</li>
            <li><strong>Thành viên Kim Cương (Diamond):</strong> Tích lũy chi tiêu từ 30,000,000 VNĐ. Giảm giá 7% cho tất cả các đơn hàng, quà sinh nhật và miễn phí vận chuyển trọn đời.</li>
        </ul>
        <p className="mt-4">Điểm tích lũy sẽ được tự động cập nhật sau mỗi đơn hàng thành công.</p>
    </>
);

const TichDiemDoiQua = () => (
    <>
        <h2 className="text-xl font-bold text-white mb-3">Tích điểm đổi quà - SUP Point</h2>
        <p className="mb-4">Với mỗi 10,000 VNĐ chi tiêu tại GymSup, quý khách sẽ nhận được 1 SUP Point. Tích lũy SUP Point để đổi lấy những phần quà hấp dẫn:</p>
        <ul className="space-y-2 list-disc ml-5">
            <li><strong>100 SUP Point:</strong> 01 Bình lắc (Shaker) GymSup cao cấp.</li>
            <li><strong>200 SUP Point:</strong> 01 Mẫu thử Pre-workout bất kỳ.</li>
            <li><strong>500 SUP Point:</strong> Voucher giảm giá 100,000 VNĐ.</li>
            <li><strong>1000 SUP Point:</strong> 01 Áo thun GymSup phiên bản giới hạn.</li>
        </ul>
        <p className="mt-4">Quý khách có thể kiểm tra điểm và đổi quà trực tiếp tại trang tài khoản cá nhân.</p>
    </>
);

const SoSanhSanPham = () => (
    <>
        <h2 className="text-xl font-bold text-white mb-3">Tính năng so sánh sản phẩm</h2>
        <p>Để giúp bạn đưa ra lựa chọn tốt nhất, GymSup cung cấp tính năng so sánh sản phẩm trực quan. Bạn có thể thêm tối đa 3 sản phẩm vào danh sách so sánh.</p>
        <p className="mt-2">Các tiêu chí so sánh bao gồm:</p>
        <ul className="space-y-1 list-disc ml-5 mt-2">
            <li>Hàm lượng Protein / serving</li>
            <li>Hàm lượng Calories / serving</li>
            <li>Giá tiền / serving</li>
            <li>Thành phần chính</li>
            <li>Đánh giá từ khách hàng</li>
        </ul>
        <p className="mt-3">Để sử dụng, chỉ cần nhấp vào nút "So sánh" trên trang sản phẩm bạn quan tâm.</p>
    </>
);

const ChinhSachDoiTra = () => (
     <>
        <h2 className="text-xl font-bold text-white mb-3">Chính sách đổi trả trong 7 ngày</h2>
        <p className="mb-2">GymSup cam kết về chất lượng sản phẩm. Chúng tôi hỗ trợ đổi/trả hàng trong các trường hợp sau:</p>
        <ul className="space-y-2 list-disc ml-5 mb-4">
            <li>Sản phẩm bị lỗi từ nhà sản xuất (hỏng hóc, vón cục bất thường).</li>
            <li>Sản phẩm bị hư hại trong quá trình vận chuyển.</li>
            <li>Giao sai sản phẩm, sai mùi vị hoặc size so với đơn đặt hàng.</li>
        </ul>
        <h3 className="font-semibold text-white mb-2">Điều kiện áp dụng:</h3>
        <ul className="space-y-2 list-disc ml-5">
            <li>Sản phẩm phải còn nguyên tem, seal, chưa qua sử dụng.</li>
            <li>Quý khách cần cung cấp video mở hàng để chứng thực.</li>
            <li>Yêu cầu đổi trả phải được thực hiện trong vòng 7 ngày kể từ ngày nhận hàng.</li>
        </ul>
        <p className="mt-4">Để yêu cầu đổi trả, vui lòng liên hệ hotline <strong className="text-gym-yellow">1800 6969</strong> để được hướng dẫn chi tiết.</p>
    </>
);

const ChinhSachVanChuyen = () => (
    <>
        <h2 className="text-xl font-bold text-white mb-3">Chính sách vận chuyển</h2>
        <p className="mb-2">Chúng tôi hợp tác với các đơn vị vận chuyển uy tín như Giao Hàng Tiết Kiệm, Viettel Post để đảm bảo sản phẩm đến tay bạn nhanh nhất.</p>
        <ul className="space-y-2 list-disc ml-5">
            <li><strong>Nội thành Hà Nội:</strong> Giao hàng trong 2-4 giờ.</li>
            <li><strong>Các tỉnh miền Bắc:</strong> 1-3 ngày làm việc.</li>
            <li><strong>Các tỉnh miền Trung & Nam:</strong> 3-5 ngày làm việc.</li>
        </ul>
        <h3 className="font-semibold text-white mt-4 mb-2">Biểu phí vận chuyển:</h3>
        <ul className="space-y-2 list-disc ml-5">
            <li>Đồng giá <strong className="text-gym-yellow">30,000 VNĐ</strong> cho tất cả các đơn hàng.</li>
            <li><strong className="text-gym-yellow">Miễn phí vận chuyển</strong> cho các đơn hàng có giá trị từ 1,000,000 VNĐ trở lên.</li>
        </ul>
    </>
);

const ChinhSachBaoMat = () => (
     <>
        <h2 className="text-xl font-bold text-white mb-3">Chính sách bảo mật thông tin</h2>
        <p className="mb-2">GymSup hiểu rằng sự riêng tư của bạn là rất quan trọng. Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng.</p>
        <ul className="space-y-2 list-disc ml-5">
            <li><strong>Mục đích thu thập:</strong> Chúng tôi chỉ thu thập các thông tin cần thiết (tên, địa chỉ, SĐT, email) để xử lý đơn hàng và chăm sóc khách hàng.</li>
            <li><strong>Phạm vi sử dụng:</strong> Thông tin của bạn chỉ được sử dụng nội bộ trong công ty và chia sẻ cho đơn vị vận chuyển để giao hàng.</li>
            <li><strong>Cam kết bảo mật:</strong> Chúng tôi cam kết không bán, chia sẻ hay trao đổi thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào khác vì mục đích thương mại.</li>
            <li><strong>Bảo mật thanh toán:</strong> Mọi thông tin thẻ thanh toán của bạn được mã hóa và xử lý qua cổng thanh toán VNPay an toàn, chúng tôi không lưu trữ thông tin thẻ của bạn.</li>
        </ul>
    </>
);

const DieuKhoanSuDung = () => (
    <>
        <h2 className="text-xl font-bold text-white mb-3">Điều khoản sử dụng</h2>
        <p className="mb-2">Vui lòng đọc kỹ các điều khoản và điều kiện này trước khi sử dụng trang web của chúng tôi.</p>
        <ul className="space-y-2 list-disc ml-5">
            <li><strong>Chấp nhận điều khoản:</strong> Bằng việc truy cập và sử dụng website gymsup.vn, bạn đồng ý tuân thủ các điều khoản này.</li>
            <li><strong>Tài khoản người dùng:</strong> Bạn chịu trách nhiệm bảo mật mật khẩu và thông tin tài khoản của mình.</li>
            <li><strong>Quyền sở hữu trí tuệ:</strong> Tất cả nội dung, hình ảnh, logo trên trang web này thuộc bản quyền của GymSup.</li>
            <li><strong>Hành vi bị cấm:</strong> Nghiêm cấm mọi hành vi sử dụng website cho mục đích bất hợp pháp, phá hoại hoặc gây ảnh hưởng đến người dùng khác.</li>
            <li><strong>Thay đổi điều khoản:</strong> Chúng tôi có quyền thay đổi các điều khoản này bất kỳ lúc nào mà không cần thông báo trước.</li>
        </ul>
    </>
);

const VeChungToi = () => (
    <>
        <h2 className="text-xl font-bold text-white mb-3">Về GymSup</h2>
        <p className="mb-2">Được thành lập vào năm 2020 bởi những người có chung niềm đam mê với thể hình và sức khỏe, GymSup ra đời với sứ mệnh mang đến những sản phẩm thực phẩm bổ sung chính hãng, chất lượng hàng đầu thế giới cho cộng đồng gymer Việt Nam.</p>
        <p className="mb-2">Chúng tôi hiểu rằng dinh dưỡng là yếu tố then chốt quyết định 70% thành công trong việc xây dựng cơ thể. Vì vậy, mỗi sản phẩm tại GymSup đều được lựa chọn kỹ lưỡng, nhập khẩu chính ngạch và có đầy đủ giấy tờ chứng nhận, đảm bảo an toàn tuyệt đối cho người sử dụng.</p>
        <p>Với đội ngũ tư vấn viên am hiểu sâu về sản phẩm và dinh dưỡng thể hình, GymSup không chỉ là một cửa hàng, mà còn là người bạn đồng hành đáng tin cậy trên hành trình chinh phục vóc dáng mơ ước của bạn.</p>
    </>
);

const HeThongCuaHang = () => (
    <>
        <h2 className="text-xl font-bold text-white mb-3">Hệ thống cửa hàng</h2>
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold text-white">GYMSUP HÀ NỘI</h3>
                <p>Địa chỉ: 96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội</p>
                <p>Hotline: 1800 6969</p>
                <p>Giờ mở cửa: 8:30 - 21:30 (Tất cả các ngày trong tuần)</p>
            </div>
             <div>
                <h3 className="font-semibold text-white">GYMSUP TP. HỒ CHÍ MINH <span className="text-xs bg-gym-yellow text-gym-darker font-bold px-2 py-0.5 rounded-full ml-2">SẮP KHAI TRƯƠNG</span></h3>
                <p>Địa chỉ: 200 Đường 3/2, Phường 12, Quận 10, TP. Hồ Chí Minh</p>
                <p>Dự kiến khai trương: Quý 4, 2023</p>
            </div>
        </div>
    </>
);

const TuyenDung = () => (
    <>
        <h2 className="text-xl font-bold text-white mb-3">Cơ hội nghề nghiệp tại GymSup</h2>
        <p className="mb-4">Gia nhập đội ngũ GymSup để cùng chúng tôi lan tỏa lối sống khỏe mạnh đến cộng đồng. Chúng tôi đang tìm kiếm các ứng viên tài năng cho các vị trí:</p>
        <div className="space-y-3">
            <div>
                <h3 className="font-semibold text-white">1. Nhân viên tư vấn bán hàng</h3>
                <p className="text-sm">Yêu cầu: Có kiến thức về thể hình và dinh dưỡng, kỹ năng giao tiếp tốt, nhiệt tình.</p>
            </div>
            <div>
                <h3 className="font-semibold text-white">2. Chuyên viên Digital Marketing</h3>
                <p className="text-sm">Yêu cầu: Kinh nghiệm chạy quảng cáo Facebook/Google, quản lý fanpage, sáng tạo nội dung.</p>
            </div>
             <div>
                <h3 className="font-semibold text-white">3. Nhân viên kho</h3>
                <p className="text-sm">Yêu cầu: Trung thực, cẩn thận, có sức khỏe tốt.</p>
            </div>
        </div>
        <p className="mt-4">Ứng viên quan tâm vui lòng gửi CV về email: <strong className="text-gym-yellow">tuyendung@gymsup.vn</strong></p>
    </>
);

const LienHe = () => (
     <>
        <h2 className="text-xl font-bold text-white mb-3">Liên hệ với chúng tôi</h2>
        <p className="mb-4">Mọi thắc mắc, góp ý hoặc cần hỗ trợ, xin vui lòng liên hệ GymSup qua các kênh sau:</p>
         <div className="space-y-2">
            <p><strong>Địa chỉ:</strong> 96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội</p>
            <p><strong>Hotline Mua hàng & CSKH:</strong> <strong className="text-gym-yellow">1800 6969</strong> (Miễn phí)</p>
            <p><strong>Email:</strong> support@gymsup.vn</p>
            <p><strong>Giờ làm việc:</strong> 8:30 - 21:30, từ Thứ 2 đến Chủ nhật.</p>
        </div>
    </>
);


const Footer: React.FC<FooterProps> = ({ onInfoLinkClick }) => {
  return (
    <footer className="bg-gym-dark border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Hệ thống cửa hàng */}
          <div>
            <h3 className="text-lg font-bold text-gym-yellow uppercase mb-4">Hệ thống cửa hàng GymSup</h3>
            <ul className="space-y-3 text-sm text-gym-gray">
              <li><strong className="text-white">GYMSUP HÀ NỘI:</strong> 96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội</li>
              <li><strong className="text-white">Hotline:</strong> 1800 6969</li>
              <li><strong className="text-white">Giờ mở cửa:</strong> 8:30 - 21:30 (T2-CN)</li>
            </ul>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm text-gym-gray">
              <li><button onClick={() => onInfoLinkClick('Hướng dẫn thanh toán', <HoTroThanhToan />)} className="hover:text-gym-yellow text-left">Hướng dẫn thanh toán</button></li>
              <li><button onClick={() => onInfoLinkClick('Chính sách khách hàng', <ChinhSachKhachHang />)} className="hover:text-gym-yellow text-left">Chính sách khách hàng</button></li>
              <li><button onClick={() => onInfoLinkClick('Tích điểm đổi quà', <TichDiemDoiQua />)} className="hover:text-gym-yellow text-left">Tích điểm đổi quà</button></li>
              <li><button onClick={() => onInfoLinkClick('So sánh sản phẩm', <SoSanhSanPham />)} className="hover:text-gym-yellow text-left">So sánh sản phẩm</button></li>
            </ul>
          </div>
          
          {/* Chính sách chung */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Chính sách chung</h3>
            <ul className="space-y-2 text-sm text-gym-gray">
              <li><button onClick={() => onInfoLinkClick('Chính sách đổi trả', <ChinhSachDoiTra />)} className="hover:text-gym-yellow text-left">Chính sách đổi trả</button></li>
              <li><button onClick={() => onInfoLinkClick('Chính sách vận chuyển', <ChinhSachVanChuyen />)} className="hover:text-gym-yellow text-left">Chính sách vận chuyển</button></li>
              <li><button onClick={() => onInfoLinkClick('Chính sách bảo mật', <ChinhSachBaoMat />)} className="hover:text-gym-yellow text-left">Chính sách bảo mật</button></li>
              <li><button onClick={() => onInfoLinkClick('Điều khoản sử dụng', <DieuKhoanSuDung />)} className="hover:text-gym-yellow text-left">Điều khoản sử dụng</button></li>
            </ul>
          </div>

          {/* Giới thiệu */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Giới thiệu GymSup</h3>
            <ul className="space-y-2 text-sm text-gym-gray">
              <li><button onClick={() => onInfoLinkClick('Về chúng tôi', <VeChungToi />)} className="hover:text-gym-yellow text-left">Về chúng tôi</button></li>
              <li><button onClick={() => onInfoLinkClick('Hệ thống cửa hàng', <HeThongCuaHang />)} className="hover:text-gym-yellow text-left">Hệ thống cửa hàng</button></li>
              <li><button onClick={() => onInfoLinkClick('Tuyển dụng', <TuyenDung />)} className="hover:text-gym-yellow text-left">Tuyển dụng</button></li>
              <li><button onClick={() => onInfoLinkClick('Liên hệ', <LienHe />)} className="hover:text-gym-yellow text-left">Liên hệ</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex justify-center items-center text-center">
          <p className="text-sm text-gym-gray">© Bản quyền thuộc về GYMSUP.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
