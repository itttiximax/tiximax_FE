import React from "react";

const CustomerList = () => {
  // Fake customer data
  const customers = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an.nguyen@example.com",
      phone: "0901234567",
      orders: 12,
      status: "Active",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "binh.tran@example.com",
      phone: "0912345678",
      orders: 8,
      status: "Inactive",
    },
    {
      id: 3,
      name: "Lê Minh Châu",
      email: "chau.le@example.com",
      phone: "0923456789",
      orders: 15,
      status: "Active",
    },
    {
      id: 4,
      name: "Phạm Quốc Đạt",
      email: "dat.pham@example.com",
      phone: "0934567890",
      orders: 5,
      status: "Pending",
    },
    {
      id: 5,
      name: "Hoàng Thị E",
      email: "e.hoang@example.com",
      phone: "0945678901",
      orders: 20,
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen p-8 font-sans">
      <h1 className="text-4xl font-extrabold text-indigo-900 mb-10 tracking-tight">
        Danh Sách Khách Hàng
      </h1>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl shadow-xl p-8 bg-opacity-95  border">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-indigo-800 border-b border-indigo-200">
                <th className="py-4 px-6 font-semibold">Tên</th>
                <th className="py-4 px-6 font-semibold">Email</th>
                <th className="py-4 px-6 font-semibold">Số điện thoại</th>
                <th className="py-4 px-6 font-semibold">Số đơn hàng</th>
                <th className="py-4 px-6 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-indigo-100 hover:bg-indigo-50 transition-colors duration-200"
                >
                  <td className="py-4 px-6 text-indigo-700 font-medium">
                    {customer.name}
                  </td>
                  <td className="py-4 px-6 text-indigo-600">
                    {customer.email}
                  </td>
                  <td className="py-4 px-6 text-indigo-600">
                    {customer.phone}
                  </td>
                  <td className="py-4 px-6 text-indigo-600">
                    {customer.orders}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : customer.status === "Inactive"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
