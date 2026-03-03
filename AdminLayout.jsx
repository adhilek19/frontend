import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "30px", background: "#f5f5f5" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
