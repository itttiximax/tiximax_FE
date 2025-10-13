import React from "react";
import {
  ShoppingCart,
  DollarSign,
  Calendar,
  User,
  Trash2,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const fakePurchases = [
  {
    id: 1,
    product: "Laptop Pro",
    date: "2023-10-01",
    quantity: 2,
    price: 1500,
    customer: "John Doe",
  },
  {
    id: 2,
    product: "Smartphone X",
    date: "2023-10-05",
    quantity: 1,
    price: 800,
    customer: "Jane Smith",
  },
  {
    id: 3,
    product: "Headphones",
    date: "2023-10-10",
    quantity: 3,
    price: 200,
    customer: "Alice Johnson",
  },
  {
    id: 4,
    product: "Monitor 4K",
    date: "2023-10-15",
    quantity: 1,
    price: 400,
    customer: "Bob Brown",
  },
];

const chartData = fakePurchases.map((purchase) => ({
  name: purchase.product,
  quantity: purchase.quantity,
  total: purchase.quantity * purchase.price,
}));

const totalPurchases = fakePurchases.length;
const totalRevenue = fakePurchases.reduce(
  (sum, p) => sum + p.quantity * p.price,
  0
);
const avgPrice = (totalRevenue / totalPurchases).toFixed(2);

const DashboardPurchase = () => {
  return (
    <div className="container mx-auto p-6  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 flex items-center text-gray-800">
        <ShoppingCart className="mr-3 text-indigo-600" size={28} /> Dashboard
        Purchases
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Purchases
            </h3>
            <ShoppingCart className="text-indigo-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-indigo-600">{totalPurchases}</p>
          <p className="text-sm text-green-500 flex items-center mt-2">
            <ArrowUpRight size={16} className="mr-1" /> +12% from last month
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Revenue
            </h3>
            <DollarSign className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-green-600">${totalRevenue}</p>
          <p className="text-sm text-green-500 flex items-center mt-2">
            <ArrowUpRight size={16} className="mr-1" /> +8% from last month
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Average Price
            </h3>
            <DollarSign className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-blue-600">${avgPrice}</p>
          <p className="text-sm text-red-500 flex items-center mt-2">
            <ArrowDownRight size={16} className="mr-1" /> -5% from last month
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Purchase Overview
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar
              dataKey="quantity"
              fill="#6366f1"
              name="Quantity"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="total"
              fill="#10b981"
              name="Total ($)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Purchases
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                  <Calendar className="mr-1" size={14} /> Date
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                  <DollarSign className="mr-1" size={14} /> Price
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                  <User className="mr-1" size={14} /> Customer
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fakePurchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                    {purchase.id}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                    {purchase.product}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                    {purchase.date}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                    {purchase.quantity}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                    ${purchase.price}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                    {purchase.customer}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                      <button className="text-indigo-600 hover:text-indigo-900 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
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

export default DashboardPurchase;
