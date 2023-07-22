import React, { useState } from 'react';
import {
  Box,
  Button,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Flex,
  Stack,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import background from './images/background.jpg';
import Navbar from './navbar.js';
import { useColorMode } from '@chakra-ui/react';

const supabaseUrl = 'https://riashvlmualipdicirlb.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYXNodmxtdWFsaXBkaWNpcmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc2MzgwNjIsImV4cCI6MjAwMzIxNDA2Mn0._aTzU3_PMXZdpxI-_gp1JaFMevd080yGYURIubIzibE';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SignInSignUp() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // New state for profile picture
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();

  const handleSignInSignUpToggle = () => {
    setIsSignIn(prevIsSignIn => !prevIsSignIn);
    setError(null);
  };

  // Function to handle profile picture file input change
  const handleProfilePictureChange = event => {
    const file = event.target.files[0];
    setProfilePicture(file);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Check if a user with the same email already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUserError) {
      console.error(
        'Error checking for existing user:',
        existingUserError.message
      );
      setError(existingUserError.message);
      setIsLoading(false);
      return;
    }

    if (existingUser) {
      setError('An account with this email already exists.');
      setIsLoading(false);
      return;
    }

    // Proceed with the signup process if no existing user found
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Use FormData to include the profile picture
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', hashedPassword);
      formData.append('profilePicture', profilePicture);

      const { error: signUpError, user } = await supabase.auth.signUp({
        email,
        password: hashedPassword,
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      console.log('User signed up:', user);
      // Redirect to account page or handle successful signup
      setIsSignIn(true); // Automatically switch to Sign In after successful sign-up
    } catch (error) {
      console.error('Sign up error:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = event => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value);
  };

  return (
    <Box>
      <Navbar currentPage="forum" />
      <Flex
        justifyContent="center"
        minHeight="100vh"
        width="100vw"
        bgImage={background}
      >
        <Box
          minHeight="100vh"
          width="70%"
          bg={colorMode !== 'dark' ? 'white' : 'gray.800'}
          py="1em"
        >
          <Heading textAlign="center" m="6">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </Heading>
          {error && (
            <Alert status="error" mb="6">
              <AlertIcon />
              <Text textAlign="center">{error}</Text>
            </Alert>
          )}
          <Box
            px={{ base: '4', md: '10' }}
            shadow="base"
            rounded={{ sm: 'lg' }}
          >
            <chakra.form onSubmit={handleSubmit}>
              {!isSignIn && (
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                  />
                </FormControl>
              )}
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
              </FormControl>
              {!isSignIn && (
                <FormControl id="confirmPassword">
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </FormControl>
              )}
              {!isSignIn && ( // Display profile picture input field for Sign Up
                <FormControl id="profilePicture">
                  <FormLabel>Profile Picture</FormLabel>
                  <Input
                    name="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </FormControl>
              )}
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
              >
                {isSignIn ? 'Sign In' : 'Sign Up'}
              </Button>
            </chakra.form>
          </Box>
          {isSignIn ? (
            <Text mt="2" textAlign="center">
              Don't have an account?{' '}
              <chakra.span
                color="blue.500"
                cursor="pointer"
                onClick={handleSignInSignUpToggle}
              >
                Sign Up
              </chakra.span>
            </Text>
          ) : (
            <Text mt="2" textAlign="center">
              Already have an account?{' '}
              <chakra.span
                color="blue.500"
                cursor="pointer"
                onClick={handleSignInSignUpToggle}
              >
                Sign In
              </chakra.span>
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
