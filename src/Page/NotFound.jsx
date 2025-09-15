import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center  ">
      <div className="text-center max-w-md mx-auto">
        {/* Tiêu đề */}
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          Đang trong giai đoạn triển khai
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Tính năng chưa được phát triển
        </h2>

        {/* Nội dung */}
        <p className="text-gray-600 mb-8">
          Đường dẫn bạn truy cập không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra
          lại hoặc quay về trang chủ.
        </p>

        {/* Nút điều hướng */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition min-w-[150px]"
          >
            <FaHome className="mr-2" />
            Về Trang Chủ
          </Link> */}

          <button
            onClick={handleGoBack}
            className="flex items-center justify-center px-6 py-3 border border-gray-600 text-gray-700 rounded-md hover:bg-gray-200 transition min-w-[150px]"
          >
            <FaArrowLeft className="mr-2" />
            Quay Lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
