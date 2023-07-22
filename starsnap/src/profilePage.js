import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import the useParams hook
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://riashvlmualipdicirlb.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYXNodmxtdWFsaXBkaWNpcmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc2MzgwNjIsImV4cCI6MjAwMzIxNDA2Mn0._aTzU3_PMXZdpxI-_gp1JaFMevd080yGYURIubIzibE';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProfilePage() {
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [username, setUsername] = useState('');

  // Use useParams to access the userId from the URL
  const { userId } = useParams();

  useEffect(() => {
    fetchUserPosts();
    fetchUserComments();
    fetchUserProfile();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', userId); // Use the userId from the URL instead of props
      if (error) {
        throw error;
      }
      setUserPosts(data);
    } catch (error) {
      console.error('Error fetching user posts:', error.message);
    }
  };

  const fetchUserComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('author_id', userId); // Use the userId from the URL instead of props
      if (error) {
        throw error;
      }
      setUserComments(data);
    } catch (error) {
      console.error('Error fetching user comments:', error.message);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email, profile_picture, username')
        .eq('id', userId); // Use the userId from the URL instead of props
      if (error) {
        throw error;
      }
      setEmail(data.email);
      setProfilePicture(data.profile_picture);
      setUsername(data.username);
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
    }
  };

  const handleEmailChange = async e => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('users')
        .update({ email })
        .eq('id', props.userId);

      if (error) {
        throw error;
      }
      console.log('Email successfully changed!');
    } catch (error) {
      console.error('Error changing email:', error.message);
    }
  };

  const handlePasswordChange = async e => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.update({ password });

      if (error) {
        throw error;
      }
      console.log('Password successfully changed!');
    } catch (error) {
      console.error('Error changing password:', error.message);
    }
  };

  const handleProfilePictureChange = async e => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('users')
        .update({ profile_picture: profilePicture })
        .eq('id', props.userId);

      if (error) {
        throw error;
      }
      console.log('Profile picture successfully changed!');
    } catch (error) {
      console.error('Error changing profile picture:', error.message);
    }
  };

  const handleUsernameChange = async e => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('users')
        .update({ username })
        .eq('id', props.props.userId);

      if (error) {
        throw error;
      }
      console.log('Username successfully changed!');
    } catch (error) {
      console.error('Error changing username:', error.message);
    }
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Profile Page
      </Heading>

      <Heading as="h2" size="lg" mb={4}>
        My Posts
      </Heading>
      <VStack spacing={4} align="stretch">
        {userPosts.map(post => (
          <Box
            key={post.id}
            bg="white"
            boxShadow="base"
            p={4}
            borderRadius="md"
          >
            <Heading as="h3" size="md" mb={2}>
              {post.caption}
            </Heading>
            {/* Display other post details */}
          </Box>
        ))}
      </VStack>

      <Heading as="h2" size="lg" mt={8} mb={4}>
        My Comments
      </Heading>
      <VStack spacing={4} align="stretch">
        {userComments.map(comment => (
          <Box
            key={comment.id}
            bg="white"
            boxShadow="base"
            p={4}
            borderRadius="md"
          >
            <Box mb={2}>{comment.text}</Box>
            {/* Display other comment details */}
          </Box>
        ))}
      </VStack>

      <Heading as="h2" size="lg" mt={8} mb={4}>
        Edit Profile
      </Heading>

      <form onSubmit={handleEmailChange}>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" mb={4}>
          Change Email
        </Button>
      </form>

      <form onSubmit={handlePasswordChange}>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" mb={4}>
          Change Password
        </Button>
      </form>

      <form onSubmit={handleProfilePictureChange}>
        <FormControl mb={4}>
          <FormLabel>Profile Picture URL</FormLabel>
          <Input
            type="text"
            value={profilePicture}
            onChange={e => setProfilePicture(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" mb={4}>
          Change Profile Picture
        </Button>
      </form>

      <form onSubmit={handleUsernameChange}>
        <FormControl mb={4}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" mb={4}>
          Change Username
        </Button>
      </form>
    </Box>
  );
}
