import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Button, Modal, TextInput, Group } from "@mantine/core";
import { TableSort } from '../lib/TableSort/TableSort';

const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = auth.currentUser.uid;
      const userWorkspacesRef = collection(db, "groups", userId, "workspaces");

      const newWorkspace = {
        title,
        description,
        createdAt: new Date()
      };

      await addDoc(userWorkspacesRef, newWorkspace);

      setWorkspaces((prevWorkspaces) => [
       ...prevWorkspaces,
        newWorkspace
      ]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userWorkspacesRef = collection(db, "groups", userId, "workspaces");
        const querySnapshot = await getDocs(userWorkspacesRef);
        
        const workspacesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
         ...doc.data()
        }));
        setWorkspaces(workspacesData);
      } catch (error) {
        console.error("Error fetching workspaces: ", error);
      }
    };

    fetchWorkspaces();
  }, []);

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>New Workspace</Button>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: isModalOpen ? "block" : "none" }}>
        <TextInput
          id="title"
          placeholder="Title of your workspace"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextInput
          id="description"
          placeholder="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Group position="right" mt="md">
          <Button type="button" onClick={handleCloseModal} variant="light">
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </form>

      <h2>Workspaces</h2>
      {workspaces.length > 0 && <TableSort data={workspaces} />}
    </div>
  );
};

export default Dashboard;
