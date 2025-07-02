import Sidebar from "../../components/admin/Sidebar";
import UserLogWidget from "./UserLogWidget";

const UserLogPage = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <UserLogWidget />
      </div>
    </div>
  );
};

export default UserLogPage;
