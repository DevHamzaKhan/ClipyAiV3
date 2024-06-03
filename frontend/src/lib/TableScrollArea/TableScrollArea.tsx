import cx from 'clsx';
import { useState, useEffect } from 'react';
import { Table, ScrollArea } from '@mantine/core';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import classes from './TableScrollArea.module.css';

export function TableScrollArea({ id }) {
  const [scrolled, setScrolled] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userWorkspacesRef = collection(db, 'groups', userId, 'workspaces', id, 'data');
        const querySnapshot = await getDocs(userWorkspacesRef);

        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          // Use the document ID as the ID in the table
          const id = doc.id;
          // Use the document data value as the link
          const link = doc.data();

          fetchedData.push({ id, link });
        });

        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error appropriately, such as showing a message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const rows = data.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td><a href={row.link.value}>{row.link.value}</a></Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={700}>
        <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Link</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
