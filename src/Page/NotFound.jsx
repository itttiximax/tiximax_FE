import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div style={{ textAlign: "center", marginTop: "80px" }}>
    <h1>404 - Không tìm thấy trang</h1>
    <p>Trang bạn yêu cầu không tồn tại.</p>
    <Link to="/home">Quay về trang chủ</Link>
  </div>
);

export default NotFound;
