import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Typography, Button } from "@mui/material";
import { TableSort } from '../lib/TableSort/TableSort';
import { Modal, TextInput, Group } from "@mantine/core";
import DashboardModal from "./DashboardModal"; // Import the DashboardModal component

const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (formData) => {
    try {
      const userId = auth.currentUser.uid;
      const userWorkspacesRef = collection(db, "groups", userId, "workspaces");

      const newWorkspace = {
        ...formData,
        createdAt: new Date(),
      };

      await addDoc(userWorkspacesRef, newWorkspace);

      setWorkspaces((prevWorkspaces) => [...prevWorkspaces, newWorkspace]);
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

        const workspacesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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
      <Button onClick={() => setIsModalOpen(true)} variant="outline">New Workspace</Button>
      <Typography variant="h2">Workspaces</Typography>
      {workspaces.length === 0 && <Typography>No workspaces found.</Typography>}
      <DashboardModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
      {workspaces.length > 0 && <TableSort data={workspaces} />}
    </div>
  );
};

export default Dashboard;
