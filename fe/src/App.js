import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, message } from 'antd';

const API_URL = 'http://localhost:9090/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', age: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter(user => user.id !== id));
      message.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
    }
  };

  const handleViewUserDetail = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
      setSelectedUser(response.data);
      setIsDetailModalVisible(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      message.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post(API_URL, newUser);
      setUsers([...users, response.data]);
      message.success("User added successfully");
      setIsAddUserModalVisible(false);
      setNewUser({ name: '', age: '' }); // Reset newUser state
    } catch (error) {
      console.error("Error adding user:", error);
      message.error("Failed to add user");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditUserModalVisible(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`${API_URL}/${editingUser.id}`, editingUser);
      setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)));
      message.success("User updated successfully");
      setIsEditUserModalVisible(false);
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Failed to update user");
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, user) => (
        <>
          <Button type="primary" onClick={() => handleViewUserDetail(user.id)}>
            Detail
          </Button>
          <Button type="danger" onClick={() => handleDeleteUser(user.id)} style={{ marginLeft: 8 }}>
            Delete
          </Button>
          <Button type="default" onClick={() => handleEditUser(user)} style={{ marginLeft: 8 }}>
            Edit
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="App">
      <h1>Users List</h1>

      <Button type="primary" onClick={() => setIsAddUserModalVisible(true)} style={{ marginBottom: 16 }}>
        Add User
      </Button>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
      />

      {selectedUser && (
        <Modal
          title="User Detail"
          visible={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={null}
        >
          <p>ID: {selectedUser.id}</p>
          <p>Name: {selectedUser.name}</p>
          <p>Age: {selectedUser.age}</p>
        </Modal>
      )}

      <Modal
        title="Add New User"
        visible={isAddUserModalVisible}
        onOk={handleAddUser}
        onCancel={() => setIsAddUserModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Age">
            <Input
              type="number"
              value={newUser.age}
              onChange={(e) => setNewUser({ ...newUser, age: parseInt(e.target.value) })}
            />
          </Form.Item>
        </Form>
      </Modal>

      {editingUser && (
        <Modal
          title="Edit User"
          visible={isEditUserModalVisible}
          onOk={handleUpdateUser}
          onCancel={() => setIsEditUserModalVisible(false)}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Age">
              <Input
                type="number"
                value={editingUser.age}
                onChange={(e) => setEditingUser({ ...editingUser, age: parseInt(e.target.value) })}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default App;
