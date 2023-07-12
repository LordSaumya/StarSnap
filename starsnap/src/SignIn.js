import { useState } from "react";
import {
  Box,
  Button,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://riashvlmualipdicirlb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYXNodmxtdWFsaXBkaWNpcmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc2MzgwNjIsImV4cCI6MjAwMzIxNDA2Mn0._aTzU3_PMXZdpxI-_gp1JaFMevd080yGYURIubIzibE";
const supabase = createClient(supabaseUrl, supabaseKey);

import bcrypt from "bcryptjs";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error, user } = await supabaseClient.auth.signIn({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
      console.log("User signed in:", user);
      // Redirect to account page or handle successful login
    } catch (error) {
      console.error("Sign in error:", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Box minH="100vh" py="12" px={{ base: "4", lg: "8" }} bg="gray.50">
      <Box maxW="md" mx="auto">
        <Heading textAlign="center" m="6">
          Sign In
        </Heading>
        {error && (
          <Alert status="error" mb="6">
            <AlertIcon />
            <Text textAlign="center">{error}</Text>
          </Alert>
        )}
        <Box
          py="8"
          px={{ base: "4", md: "10" }}
          shadow="base"
          rounded={{ sm: "lg" }}
          bg="white"
        >
          <chakra.form onSubmit={handleSignIn}>
            <Stack spacing="6">
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
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </Stack>
          </chakra.form>
        </Box>
      </Box>
    </Box>
  );
};

export { SignIn };
