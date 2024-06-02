import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './Workspace.css';
import {
  Button,
  TextInput,
  Modal,
  Container,
  Group,
  Text,
  Title,
  Card,
  Image,
  Grid,
  rem,
  Paper,
  Box,
} from '@mantine/core';
import LinkModal from './LinkModal';
import VideoModal from './VideoModal'; // Import the CustomModal component


import { List, ListItem } from '@mantine/core';

const Workspace = () => {
  const { id } = useParams(); // Get the workspace ID from the URL
  const [workspace, setWorkspace] = useState(null);
  const [data, setData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);  // State to manage LinkModal visibility
  const [userId, setUserId] = useState(null);
  const [section, setSection] = useState('info'); // State to manage the active section
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const handleModalOpen = (url, timestamp) => {
    console.log('Open modal for video:', url);
    console.log('Timestamp:', timestamp);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        console.log('Fetching workspace data...');
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          setUserId(userId);
          console.log('User ID:', userId);

          // Reference to the workspace document
          const workspaceDocRef = doc(db, 'groups', userId, 'workspaces', id);
          const workspaceDocSnap = await getDoc(workspaceDocRef);

          if (workspaceDocSnap.exists()) {
            console.log('Workspace document data:', workspaceDocSnap.data());
            setWorkspace(workspaceDocSnap.data());
          } else {
            setError('No such workspace!');
            console.error('Error: No such workspace!');
          }
        } else {
          setError('User not authenticated');
          console.error('Error: User not authenticated');
        }
      } catch (error) {
        setError('Error fetching document: ' + error.message);
        console.error('Error fetching document:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userWorkspacesRef = collection(db, "groups", userId, "workspaces", id, "data");
        const querySnapshot = await getDocs(userWorkspacesRef);
  
        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          fetchedData.push({ id: doc.id, ...doc.data() });
        });
  
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error appropriately, such as showing a message to the user
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);
  const handleDataSubmit = async (e) => {
    e.preventDefault();
    const youtubeLink = e.target.dataValue.value;
    
    try {
      console.log('Submitting new YouTube link:', youtubeLink);
    
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
    
      const newLink = { value: youtubeLink, id: Date.now() }; // Unique ID for the new link
    
      setData((prevData) => [...prevData, newLink]); // Add the new link to the local state
    
      setIsLinkModalOpen(false);
    } catch (error) {
      console.error('Error adding data:', error);
      // Handle error appropriately, such as showing a message to the user
    }
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    const userQuestion = e.target.userQuestion.value;
  
    console.log('Search input:', userQuestion);
  
    try {
      // Send all current links to the backend
      const responseLinks = await fetch('https://skm-flask-app-46d796cfe56d.herokuapp.com/youtubeVideoUpload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          links: data.map((item) => { // Fix here
            return fetch('https://skm-flask-app-46d796cfe56d.herokuapp.com/youtubeVideoUpload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ youtube_link: item.value, userID: userId, collectionID: id })
            })
          })
        })
      });
  
      // Check if sending links to the backend was successful
      if (!responseLinks.ok) {
        throw new Error('Failed to send links to the backend');
      } else {
        console.log("senttoBACKEND")
      }
  
      // Proceed with sending search request
      const responseSearch = await fetch('https://skm-flask-app-46d796cfe56d.herokuapp.com/semantic-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_question: userQuestion,
          userID: userId,
          collectionID: id
        })
      });
  
      const result = await responseSearch.json();
      console.log('Search results:', result.docs);

      console.log('Backend search response:', result);
  
      if (responseSearch.ok) {
        const searchResults = result.docs.map(doc => {
          const videoID = new URL(doc.metadata.url).searchParams.get('v');
          const embedUrl = `https://www.youtube.com/embed/${videoID}?start=${Math.floor(doc.metadata.start)}`;
          const duration = new Date(doc.metadata.duration * 1000).toISOString().substr(11, 8);

          return {
            metadata: {
              url: embedUrl,
              videoThumbnail: doc.metadata.videoThumbnail,
              videoTitle: doc.metadata.videoTitle,
              duration: duration,
            },
            page_content: doc.page_content
          };
        });
  
        console.log('Search results:', searchResults);
        setSearchResults(searchResults);
      } else {
        console.error('Error fetching search results:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setError('Error searching');
    }
  };
  
  


  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!workspace) {
    return <Text>No workspace data available</Text>;
  }

  return (
    <>
      <div className="box">
      <div className="header-container">
      <Container>
        <div className="tab-container">
        <button
          className={`tab-button ${section === 'info' ? 'active' : ''}`}
          onClick={() => setSection('info')}
        >
          Info
        </button>
        <button
          className={`tab-button ${section === 'data' ? 'active' : ''}`}
          onClick={() => setSection('data')}
        >
          Data
        </button>
        <button
          className={`tab-button ${section === 'search' ? 'active' : ''}`}
          onClick={() => setSection('search')}
        >
          Search
        </button>
        </div>
      </Container>
      </div>
      </div>

      <Container>
  {/* Content based on selected section */}
  {section === 'info' && (
    <>
      <Title order={1}>{workspace.title}</Title>
      <Text mt="md">{workspace.description}</Text>
    </>
  )}


{section === 'data' && (
  <>
    <Button onClick={() => setIsLinkModalOpen(true)} mt="md">Add YouTube Link</Button>
    <Title order={2} mt="xl">Existing Data</Title>
    <Box mt="md">
      <List>
        {data.map((item, index) => (
          <ListItem key={index} mt="sm">
            <strong>Link:</strong> <a href={item.value} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>{item.value}</a>
          </ListItem>
        ))}
      </List>
    </Box>
  </>
)}


{section === 'search' && (
  <>
    <Title order={2} mt="xl">Search</Title>
    <form onSubmit={handleSearch}>
      <TextInput name="userQuestion" placeholder="Enter your question" mt="md" />
      <Button type="submit" mt="md">Search</Button>
    </form>
    
    <Title order={2} mt="xl">Search Results</Title>
    <Grid mt="md">
      {searchResults.map((doc, index) => (
        <Grid.Col key={index} sm={6} md={4}>
          <Card shadow="sm">
            <Card.Section>
              <Image src={doc.metadata.videoThumbnail} height={160} alt="Video Thumbnail" />
            </Card.Section>
            <Box p="md">
              <Title order={3}>{doc.metadata.videoTitle}</Title>
              <Text mt="sm">{doc.page_content}</Text>
              <Button onClick={() => handleModalOpen(doc.metadata.url, doc.metadata.duration)}>Open modal</Button>    
              <VideoModal open={isModalOpen} handleClose={handleModalClose}  timestamp = {doc.metadata.duration} url={doc.metadata.url} />
            </Box>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  </>
)}
  </Container>
  </>
  );
}

export default Workspace;
