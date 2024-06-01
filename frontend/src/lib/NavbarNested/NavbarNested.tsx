import React, { useState, useEffect } from 'react';
import { Group, Code, ScrollArea, rem } from '@mantine/core';
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from '@tabler/icons-react';
import { UserButton } from '../UserButton/UserButton';
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
import { Logo } from './Logo';
import classes from './NavbarNested.module.css';
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from '../../firebase'; // Ensure correct path

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
  }, []);

  const mockdata = [
    { label: 'Dashboard', icon: IconGauge },
    {
      label: 'Market news',
      icon: IconNotes,
      initiallyOpened: true,
      links: [
        { label: 'Overview', link: '/' },
        { label: 'Forecasts', link: '/' },
        { label: 'Outlook', link: '/' },
        { label: 'Real time', link: '/' },
      ],
    },
    {
      label: 'Releases',
      icon: IconCalendarStats,
      links: [
        { label: 'Upcoming releases', link: '/' },
        { label: 'Previous releases', link: '/' },
        { label: 'Releases schedule', link: '/' },
      ],
    },
    { label: 'Analytics', icon: IconPresentationAnalytics },
    { label: 'Contracts', icon: IconFileAnalytics },
    { label: 'Settings', icon: IconAdjustments },
    {
      label: 'Security',
      icon: IconLock,
      links: [
        { label: 'Enable 2FA', link: '/' },
        { label: 'Change password', link: '/' },
        { label: 'Recovery codes', link: '/' },
      ],
    },
    {
      label: 'Workspaces',
      icon: IconNotes, // You can choose a different icon if preferred
      initiallyOpened: true,
      links: workspaces.map(workspace => ({
        label: workspace.title,
        link: `/workspace/${workspace.id}`,
      })),
    },
  ];

  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

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
