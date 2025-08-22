import React from "react";

const fakeTeamData = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    role: "Nhân viên Sale",
    email: "vana@example.com",
    area: "Hà Nội",
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    role: "Nhân viên Kho Nội địa",
    email: "thib@example.com",
    area: "Hồ Chí Minh",
  },
  {
    id: 3,
    fullName: "Lê Văn C",
    role: "Nhân viên Kho Ngoại",
    email: "vanc@example.com",
    area: "Đà Nẵng",
  },
  {
    id: 4,
    fullName: "Phạm Thị D",
    role: "Nhân viên Thu mua",
    email: "thid@example.com",
    area: "Cần Thơ",
  },
];

const ManagerTeam = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Danh sách thành viên trong team
      </h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b">ID</th>
              <th className="py-3 px-4 border-b">Họ và tên</th>
              <th className="py-3 px-4 border-b">Vai trò</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Khu vực</th>
            </tr>
          </thead>
          <tbody>
            {fakeTeamData.map((member) => (
              <tr key={member.id} className="text-center hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{member.id}</td>
                <td className="py-2 px-4 border-b">{member.fullName}</td>
                <td className="py-2 px-4 border-b">{member.role}</td>
                <td className="py-2 px-4 border-b">{member.email}</td>
                <td className="py-2 px-4 border-b">{member.area}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerTeam;
