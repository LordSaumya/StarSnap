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
    Icon,
    FormLabel,
    Spacer,
    Spinner,
    FormErrorMessage,
    FormHelperText,
    Collapse,
    Flex,
    Input,
    Skeleton,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { CheckIcon, WarningIcon, AddIcon, ChatIcon, TriangleDownIcon, TriangleUpIcon, Search2Icon, CloseIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaComments, FaImages } from 'react-icons/fa';

//Body

export default function IdentificationTab() {
    const { colorMode, toggleColorMode } = useColorMode();

    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false)
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
        setImageFile(e.target.files[0]);
    };

    const handleImageUpload = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', imageFile);
        try {
            const res = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData,
            });

            setData(await res.json());
            console.log(data);
        } catch (err) {
            console.log(err);
        }
        setTimeout(() => {
            setLoading(false);
            setIsLoaded(true);
        }, Math.floor(Math.random() * 2500) + 2000);
    };

    const class_names = data ? data.class_names : null;

    return (
        <Box>
            <Navbar currentPage="identificationTab" />
            <Flex justifyContent="center" minHeight="100vh" width="100vw" bgImage={background}>
                <Box align="center" minHeight="100vh" width="70%" bg={colorMode !== 'dark' ? 'white' : 'gray.800'} py="2em">
                <Heading as = "h1" size = "xl" flex = "1" textAlign = "center" py = "0.5em">Identification Tab</Heading>
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

                    {image && !data && !loading && <Box align="center">
                        <HStack justify="center">
                            <Button variant="outline" colorScheme="red" leftIcon={<CloseIcon />} size="lg" onClick={() => setImage(null)}>
                                Remove Image
                            </Button>
                            <Button variant="outline" colorScheme="blue" leftIcon={<Search2Icon />} size="lg" onClick={() => handleImageUpload()}>
                                Identify Image
                            </Button>
                        </HStack>
                    </Box>}
                    {image && <Image  transition="box-shadow 0.5s ease-in-out" _hover={{ boxShadow: "dark-lg" }} boxShadow="xl" src={image} marginTop="1em" maxWidth="60%" maxHeight="60vh" alt="uploaded file" />}
                    {loading && (
                        <HStack justify="center">
                            <Spinner
                                size="xl"
                                thickness="4px"
                                speed="0.65s"
                                emptyColor="gray.200"
                                color="blue.500"
                                marginTop="1em"
                            />
                            <Text fontSize="sm" color="grey" marginTop="1em">Identifying image...</Text>
                        </HStack>
                    )}
                    <Flex py = "1em" direction="row" width="90%" justify="center">
                        <Box>
                    {((data && isLoaded) || loading) && <>
                        <Text fontSize="xl" marginTop="1em">Most likely constellations:</Text>
                        <Skeleton height="2em" width="60%" my="0.5em" isLoaded={isLoaded} fadeDuration={5}>
                            <Text fontSize="lg" marginTop="1em">{data ? class_names[0] : null}</Text>
                        </Skeleton>
                        <Skeleton height="2em" width="60%" my="0.5em" isLoaded={isLoaded} fadeDuration={10}>
                            <Text fontSize="md" marginTop="1em">{data ? class_names[1] : null}</Text>
                        </Skeleton>
                        <Skeleton height="2em" width="60%" my="0.5em" isLoaded={isLoaded} fadeDuration={15}>
                            <Text fontSize="sm" marginTop="1em">{data ? class_names[2] : null}</Text>
                        </Skeleton>
                    </>}
                    </Box>
                    <Spacer flex="0.1" />
                    <Box>
                    {
                        (data && isLoaded) && <>
                        <Button width = "100%" variant="outline" colorScheme="blue" leftIcon={<Search2Icon />} size="lg" onClick={() => window.location.reload(false)}>
                            Identify Another Image
                        </Button>
                        <Spacer flex="0.2" />
                        <Button width = "100%" mt = "1em" variant="outline" leftIcon={<Icon as={FaGraduationCap} boxSize="1.5em" />} colorScheme="green" size="lg" onClick={() => navigate("/learn", {state: {constellationQuery: class_names[0]}})}>
                            Learn More
                        </Button>
                        <Spacer flex="0.2" />
                        <Button width = "100%" mt = "1em" variant="outline" leftIcon={<Icon as={FaComments} boxSize="1.5em" />} colorScheme="yellow" size="lg" onClick={() => navigate("/", {state: {constellationQuery: class_names[0]}})}>
                            Post to Forum
                        </Button>
                        <Spacer flex="0.2" />
                        <Button width = "100%" mt = "1em" variant="outline" leftIcon={<Icon as={FaImages} boxSize="1.5em" />} colorScheme="purple" size="lg" onClick={() => navigate("/", {state: {constellationQuery: class_names[0]}})}>
                            Save to Gallery
                        </Button>
                        </>
                    }
                    </Box>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
}