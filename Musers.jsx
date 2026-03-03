import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Spinner } from "react-bootstrap";
import Sidebar from "./Sidebar";
import "../admin/css/Musers.css"; 

function Musers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const toggleStatus = (user) => {
    const currentStatus = user.status || "active";
    const newStatus = currentStatus === "active" ? "blocked" : "active";

    axios
      .put(`http://localhost:5000/users/${user.id}`, {
        ...user,
        status: newStatus,
      })
      .then((res) => {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? res.data : u))
        );
      });
  };

  const deleteUser = (id) => {
    if (!window.confirm("Delete this user?")) return;

    axios.delete(`http://localhost:5000/users/${id}`).then(() => {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
  
      <Sidebar />


      <div style={{ flex: 1, padding: "30px", background: "#f0f2f5" }}>
        <h2 className="mb-4" style={{ color: "#343a40" }}>
          Manage Users
        </h2>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table className="custom-table" bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isActive = (u.status || "active") === "active";

                  return (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <Badge bg={isActive ? "success" : "danger"}>
                          {u.status || "active"}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant={isActive ? "outline-warning" : "outline-success"}
                          size="sm"
                          className="me-2"
                          onClick={() => toggleStatus(u)}
                        >
                          {isActive ? "Block" : "Unblock"}
                        </Button>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteUser(u.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default Musers;
