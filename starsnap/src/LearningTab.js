//Imports
import React from 'react';
import { useState } from 'react';
import Navbar from './navbar.js';
import LazyLoad from 'react-lazyload';
import moment from 'moment';
import background from './images/background.jpg';
import { FaArrowCircleUp } from 'react-icons/fa';
import testImage from './images/testImage.jpg';
import moderatorList from './moderatorsList.json';
import Post from './post.js';
import useLocation from 'react-router-dom';
import {
    Box,
    Text,
    Link,
    Badge,
    useColorMode,
    Select,
    Button,
    Container,
    Heading,
    Divider,
    FormControl,
    FormLabel,
    Spinner,
    FormErrorMessage,
    FormHelperText,
    Collapse,
    Flex,
    Input,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { CheckIcon, WarningIcon, AddIcon, ChatIcon, TriangleDownIcon, TriangleUpIcon, Search2Icon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';

//Body

export default function LearningTab() {
    const { colorMode, toggleColorMode } = useColorMode();
    const constellationList = ["Orion", "Scorpius", "Crux", "Big Dipper"];
    const constellationQuery = useLocation().constellation ? useLocation().constellation : constellationList[0];

    return (
    <Box>
        <Navbar />
        <Flex justifyContent = "center" height = "100vh" width = "100vw" bgImage={background}>
            <Box minHeight = "100vh" width="70%" bg = {colorMode !== 'dark' ? 'white' : 'gray.800'} py = "1em">
                
            </Box>
        </Flex>
    </Box>
    );
}