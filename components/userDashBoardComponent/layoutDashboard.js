import Sidebar from "./Sidebar";

const LayoutDashboard = ({ children }) => {
  return (
    <>
      <Sidebar />
      <div>{children}</div>
    </>
  );
};

export default LayoutDashboard;
