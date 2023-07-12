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
  Flex,
  AlertIcon,
  useColorMode,
} from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import background from './images/background.jpg';
import Navbar from './navbar.js';

const supabaseUrl = "https://riashvlmualipdicirlb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYXNodmxtdWFsaXBkaWNpcmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc2MzgwNjIsImV4cCI6MjAwMzIxNDA2Mn0._aTzU3_PMXZdpxI-_gp1JaFMevd080yGYURIubIzibE";
const supabase = createClient(supabaseUrl, supabaseKey);



export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const { error, user } = await supabase.auth.signUp({
        email,
        password: hashedPassword,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("User signed up:", user);
      // Redirect to account page or handle successful signup
    } catch (error) {
      console.error("Sign up error:", error.message);
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

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  return (
    <Box>
      <Navbar currentPage="forum" />
      <Flex justifyContent="center" minHeight="100vh" width="100vw" bgImage={background}>
        <Box minHeight="100vh" width="70%" bg={colorMode !== 'dark' ? 'white' : 'gray.800'} py="1em">
          <Heading textAlign="center" m="6">
            Sign Up
          </Heading>
          {error && (
            <Alert status="error" mb="6">
              <AlertIcon />
              <Text textAlign="center">{error}</Text>
            </Alert>
          )}
          <Box
            px={{ base: "4", md: "10" }}
            shadow="base"
            rounded={{ sm: "lg" }}
          >
            <chakra.form onSubmit={handleSignUp}>
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
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </FormControl>
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
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                >
                  Sign Up
                </Button>
              </Stack>
            </chakra.form>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};