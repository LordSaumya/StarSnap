import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  VStack,
  SimpleGrid,
  Image,
  Text,
  Flex,
  useColorMode,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import background from './images/background.jpg';
import Navbar from './navbar.js';

export default function PersonalGallery() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [images, setImages] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setImages((prevImages) => [...prevImages, imageUrl]);
    setCaptions((prevCaptions) => [...prevCaptions, ""]);
    setShowUploadForm(false);
  };

  const handleCaptionChange = (event, index) => {
    const newCaptions = [...captions];
    newCaptions[index] = event.target.value;
    setCaptions(newCaptions);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setCaptions((prevCaptions) => prevCaptions.filter((_, i) => i !== index));
  };

  const handleShowUploadForm = () => {
    setShowUploadForm(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredImages = images.filter((_, index) =>
    captions[index].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={4}>
      <Stack direction="row" spacing={4}>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={handleShowUploadForm}
        >
          Upload Image
        </Button>

        <FormControl>
          <FormLabel>Search by caption:</FormLabel>
          <Input
            type="text"
            placeholder="Enter caption"
            value={searchTerm}
            onChange={handleSearchChange}
            rightIcon={<SearchIcon />}
          />
        </FormControl>
      </Stack>

      {showUploadForm && (
        <FormControl mt={4}>
          <FormLabel>Select an image:</FormLabel>
          <Input type="file" onChange={handleImageUpload} />
        </FormControl>
      )}

      <SimpleGrid columns={3} spacing={4} mt={4}>
        {filteredImages.map((imageUrl, index) => (
          <Box key={index} position="relative">
            <Image
              src={imageUrl}
              alt="Uploaded"
              maxH="200px"
              maxW="200px"
              objectFit="cover"
            />

            <FormControl mt={2}>
              <Input
                value={captions[index]}
                onChange={(event) => handleCaptionChange(event, index)}
                placeholder="Enter a caption"
              />
            </FormControl>

            <Text fontSize="sm" mt={2}>
              {captions[index]}
            </Text>

            <Button
              position="absolute"
              top="4px"
              right="4px"
              size="sm"
              colorScheme="red"
              onClick={() => handleRemoveImage(index)}
            >
              Remove
            </Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};