import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Spinner,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Navbar from './navbar';
import { persistor, store } from './store';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Index from './index';
import Post from './post';
import { PersistGate } from 'redux-persist/integration/react';

export default function App() {
  return (
    // Provides access to Redux store, and persists it till the user logs out
    <Provider store={store}>
      <PersistGate loading={<Spinner size="xl" />} persistor={persistor}>
        {/* Provides access to Chakra UI */}
        <ChakraProvider theme={theme}>
          {/* Provides routes to all of the pages in the app.
          Handles wrong routes. */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navbar />} />
              <Route path="/Navbar" element={<Navbar currentPage = "learningTab" />} />
              <Route path="/Post" element={<Post />} />
            </Routes>
          </BrowserRouter>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
}
