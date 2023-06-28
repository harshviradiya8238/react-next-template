import Sidebar from "./Sidebar";

const LayoutDashboard = ({ children }) => {
  return (
    <>
      <Sidebar />
      <div className="wrapper">{children}</div>
    </>
  );
};

export default LayoutDashboard;
