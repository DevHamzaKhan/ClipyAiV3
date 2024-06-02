import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { addDoc, doc, setDoc, collection, getDocs } from "firebase/firestore";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';

const AAA = () => {
  const [title, setTitle] = useState("");
  const [link1, setLink1] = useState("");
  const [link2, setLink2] = useState("");
  const [link3, setLink3] = useState("");
  const [link4, setLink4] = useState("");
  const [link5, setLink5] = useState("");
  const [userLinks, setUserLinks] = useState([]);

  useEffect(() => {
    // Fetch user's document from Firestore
    const fetchUserLinks = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(db, "groups", userId);
        const docSnapshot = await getDocs(userDocRef);
        if (docSnapshot.exists()) {
          setUserLinks(docSnapshot.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };
    fetchUserLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, "groups", userId);
      await setDoc(userDocRef, {
        [title]: [link1, link2, link3, link4, link5]
      }, { merge: true });
      console.log("Document written for user ID: ", userId);

      setTitle("");
      setLink1("");
      setLink2("");
      setLink3("");
      setLink4("");
      setLink5("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <Label>Title:</Label>
        <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Label>Link 1:</Label>
        <Input type="text" value={link1} onChange={(e) => setLink1(e.target.value)} />
        <Label>Link 2:</Label>
        <Input type="text" value={link2} onChange={(e) => setLink2(e.target.value)} />
        <Label>Link 3:</Label>
        <Input type="text" value={link3} onChange={(e) => setLink3(e.target.value)} />
        <Label>Link 4:</Label>
        <Input type="text" value={link4} onChange={(e) => setLink4(e.target.value)} />
        <Label>Link 5:</Label>
        <Input type="text" value={link5} onChange={(e) => setLink5(e.target.value)} />
        <Button type="submit">Submit</Button>
      </form>

      <h2>Your Links:</h2>
      <ul>
        {Object.keys(userLinks).map((key) => (
          <li key={key}>
            <strong>{key}:</strong> {userLinks[key].join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AAA;
