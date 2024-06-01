import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import { createTheme, MantineProvider, rem } from '@mantine/core';

const theme = createTheme({
  colors: {
    // Add your color
    siteBackground: [
      '#202327'
    ],
    editorBackground: [
      '#15181E'
    ],
    navbar: [
      '#2E3138'
    ],
    codeSnippetBackground: [
      '#181A1D'
    ],
    // or replace default theme color
    blue: [
      '#eef3ff',
      '#dee2f2',
      '#bdc2de',
      '#98a0ca',
      '#7a84ba',
      '#6672b0',
      '#5c68ac',
      '#4c5897',
      '#424e88',
      '#364379',
    ],
  },

  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },

  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },
});
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <MantineProvider theme={theme} defaultColorScheme="dark">
          <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
