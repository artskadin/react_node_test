import TaskFilter from "../../components/tasks/TaskFilter";
import UserSidebar from "./UserSidebar";

const TaskListPage = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-gray-100">
      <UserSidebar />

      <div className="flex-1 p-6">
        <TaskFilter />
      </div>
    </div>
  );
};

export default TaskListPage;
