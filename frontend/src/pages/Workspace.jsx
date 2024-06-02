import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
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

const Workspace = () => {
  const { id } = useParams(); // Get the workspace ID from the URL
  const [workspace, setWorkspace] = useState(null);
  const [data, setData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);  // State to manage LinkModal visibility
  const [userId, setUserId] = useState(null);

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

  const handleDataSubmit = async (e) => {
    e.preventDefault();
    const youtubeLink = e.target.dataValue.value;

    try {
      console.log('Submitting new YouTube link:', youtubeLink);

      const response = await fetch('https://skm-flask-app-46d796cfe56d.herokuapp.com/youtubeVideoUpload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ youtube_link: youtubeLink, userID: userId, collectionID: id })
      });

      const result = await response.json();
      console.log('Backend response:', result);

      if (response.ok) {
        const newData = {
          value: youtubeLink,
          id: result.id // Assuming backend returns an ID for the new document
        };

        setData((prevData) => [...prevData, newData]);
        setIsLinkModalOpen(false);
      } else {
        console.error('Error adding data:', result.message);
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const userQuestion = e.target.userQuestion.value;

    console.log('Search input:', userQuestion);

    try {
      const response = await fetch('https://skm-flask-app-46d796cfe56d.herokuapp.com/semantic-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_question: userQuestion, userID: userId, collectionID: id })
      });

      const result = await response.json();
      console.log('Backend search response:', result);

      if (response.ok) {
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
      console.error('Error fetching search results:', error);
      setError('Error fetching search results');
    }
  };

  const openModal = (embedUrl, title) => {
    console.log('Opening modal with URL:', embedUrl);
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = title;
    videoFrame.src = embedUrl + "&autoplay=1";
    modal.style.display = 'block';
  };

  const closeModal = () => {
    console.log('Closing modal');
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    videoFrame.src = '';
    modal.style.display = 'none';
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
    <Container>
      <Title order={1}>{workspace.title}</Title>
      <Text mt="md">{workspace.description}</Text>

      <Button onClick={() => setIsLinkModalOpen(true)} mt="md">Add YouTube Link</Button>

      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSubmit={handleDataSubmit}
      />

      <Title order={2} mt="xl">Existing Data</Title>
      <Box mt="md">
        {data.map((item, index) => (
          <Text key={index} mt="sm">
            <strong>Link:</strong> <a href={item.value} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>{item.value}</a>
          </Text>
        ))}
      </Box>

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
                <Button onClick={() => openModal(doc.metadata.url, doc.metadata.videoTitle)} mt="md">
                  Watch ({doc.metadata.duration})
                </Button>
              </Box>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Modal
        id="videoModal"
        opened={document.getElementById('videoModal') && document.getElementById('videoModal').style.display === 'block'}
        onClose={closeModal}
        title={<Title id="modalTitle" order={3}></Title>}
      >
        <iframe
          id="videoFrame"
          width="560"
          height="315"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </Modal>
    </Container>
  );
};

export default Workspace;
