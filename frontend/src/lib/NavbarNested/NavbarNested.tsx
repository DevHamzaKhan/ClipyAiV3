import React, { useState, useEffect } from 'react';
import { Group, Code, ScrollArea, rem } from '@mantine/core';
import {
  IconNotes,
  IconGauge,
  IconAdjustments,
  IconFileAnalytics,
  IconLock,
} from '@tabler/icons-react';
import { UserButton } from '../UserButton/UserButton';
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
import { Logo } from './Logo';
import classes from './NavbarNested.module.css';
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from '../../firebase';
import { Link } from 'react-router-dom';

export function NavbarNested() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const workspacesRef = collection(db, 'groups', userId, 'workspaces');
          const workspacesSnapshot = await getDocs(workspacesRef);
          const workspacesList = workspacesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setWorkspaces(workspacesList);
        }
      } catch (error) {
        console.error("Error fetching workspaces: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();

    // Check for authentication status every 10 seconds
    const intervalId = setInterval(() => {
      if (!auth.currentUser) {
        fetchWorkspaces();
      }
    }, 10000);

    // Clean up the interval to avoid memory leaks
    return () => clearInterval(intervalId);
  }, []);

  const mockdata = [
    { label: 'Overview', icon: IconGauge, link: '/home' },
    {
      label: 'Workspaces',
      icon: IconNotes,
      initiallyOpened: true,
      link: '/workspace',
      links: workspaces.map(workspace => ({
        label: workspace.title,
        link: `/workspace/${workspace.id}`,
      })),
    },
    { label: 'Upgrade to Pro', icon: IconAdjustments, link: '/pro' },
    { label: 'Documentation', icon: IconFileAnalytics, link: '/documentation' },
    { label: 'Help', icon: IconLock, link: '/help' },
  ];

  const links = mockdata.map((item) => (
    <LinksGroup
      {...item}
      key={item.label}
      // If it's a workspace link, use Link from react-router-dom
      // Otherwise, use a regular anchor tag
      icon={item.link.includes('/workspace') ? Link : 'a'}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Logo style={{ width: rem(120) }} />
          <Code fw={700}>v3.1.2</Code>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>
          {loading ? <div>Loading...</div> : links}
        </div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton />
      </div>
    </nav>
  );
}
