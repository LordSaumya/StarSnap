//Imports
import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from './navbar.js';
import LazyLoad from 'react-lazyload';
import moment from 'moment';
import background from './images/background.jpg';
import { FaArrowCircleUp } from 'react-icons/fa';
import moderatorList from './moderatorsList.json';
import Post from './post.js';
import {
    Box,
    Text,
    Link,
    Badge,
    Image,
    useColorMode,
    Select,
    Button,
    Container,
    Heading,
    HStack,
    Divider,
    FormControl,
    FormLabel,
    Spacer,
    Spinner,
    FormErrorMessage,
    FormHelperText,
    Collapse,
    Flex,
    Input,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { CheckIcon, WarningIcon, AddIcon, ChatIcon, TriangleDownIcon, TriangleUpIcon, Search2Icon, CloseIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';

//Body

export default function IdentificationTab() {
    const { colorMode, toggleColorMode } = useColorMode();

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleImageUpload = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', image);
        try {
            const res = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            console.log(data);
        } catch (err) {
            console.log(err);
        }
        setTimeout(() => {
        }, Math.floor(Math.random() * 4500) + 4500);
        setLoading(false);
    };


    return (
        <Box>
            <Navbar currentPage="identificationTab" />
            <Flex justifyContent="center" height="100vh" width="100vw" bgImage={background}>
                <Box align="center" minHeight="100vh" width="70%" bg={colorMode !== 'dark' ? 'white' : 'gray.800'} py="2em">
                    {!image && !loading && <>
                        <Input
                            id="image-upload"
                            type="file"
                            onChange={handleImageChange}
                            display="none"
                            accept="image/*"
                        />
                        <Button as="label" variant="outline" colorScheme="teal" leftIcon={<AddIcon />} size="lg" htmlFor="image-upload">
                            Upload Image
                        </Button>
                    </>}

                    {image && !loading && <Box align="center">
                        <HStack justify="center">
                            <Button variant="outline" colorScheme="red" leftIcon={<CloseIcon />} size="lg" onClick={() => setImage(null)}>
                                Remove Image
                            </Button>
                            <Button variant="outline" colorScheme="blue" leftIcon={<Search2Icon />} size="lg" onClick={() => handleImageUpload()}>
                                Identify Image
                            </Button>
                        </HStack>
                    </Box>}
                    {image && <Image src={image} boxShadow="lg" paddingTop="1em" maxWidth="60%" maxHeight="60vh" alt="uploaded file" />}
                    {loading && (
                        <Spinner
                            size="xl"
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                        />
                    )}
                </Box>
            </Flex>
        </Box>
    );
}