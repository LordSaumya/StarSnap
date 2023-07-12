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
import Home from './Home.js';
import IdentificationTab from './identificationTab.js';
import LearningTab from './LearningTab.js';
import { ColorModeSwitcher } from './ColorModeSwitcher.js';
import { persistor, store } from './store.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import PersonalGallery from './personalGallery.js';
import ProfilePage from './profilePage.js';

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
              <Route path="/" element={<Home />} />
              <Route path="/identify" element={<IdentificationTab />} />
              <Route path="/learn" element={<LearningTab />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/personalgallery" element={<PersonalGallery />} />

            </Routes>
          </BrowserRouter>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
}
