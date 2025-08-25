// src/components/RouteInput.jsx
import React, { useEffect, useState } from "react";
import routesService from "../../Services/LeadSale/routesService";

const RouteInput = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzYWxlIiwiaWF0IjoxNzU2MTA2MjAzLCJleHAiOjE3NTYxOTI2MDN9.h9r_mVrOp_LcLAvseZMSGfe95Kbyn7E2Brjw6a7YGJ1pdZUslrQVET8R_ejSkPQW";
        const data = await routesService.getRoutes(token);
        setRoutes(data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách tuyến</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map((route) => (
          <div
            key={route.routeId}
            className="bg-white shadow rounded-2xl p-4 border hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {route.name}
            </h3>
            <p className="text-gray-600">
              <span className="font-medium">Thời gian: </span>
              {route.shipTime} ngày
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Đơn giá: </span>
              {route.unitShippingPrice.toLocaleString()} đ
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Ghi chú: </span>
              {route.note || "Không có"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteInput;
