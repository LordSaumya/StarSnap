//Imports
import React, { useEffect } from 'react';
import { useState, useMemo } from 'react';
import Navbar from './navbar.js';
import LazyLoad from 'react-lazyload';
import moment from 'moment';
import background from './images/background.jpg';
import { FaArrowCircleUp } from 'react-icons/fa';
import testImage from './images/testImage.jpg';
import moderatorList from './moderatorsList.json';
import constellationList from './constellations.json';
import Post from './post.js';
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
    Spacer,
    Image,
    Skeleton,
    Divider,
    FormControl,
    FormLabel,
    Spinner,
    FormErrorMessage,
    InputGroup,
    FormHelperText,
    Collapse,
    Flex,
    Input,
    InputLeftElement,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { CheckIcon, WarningIcon, AddIcon, ChatIcon, TriangleDownIcon, TriangleUpIcon, Search2Icon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';

//Body

export default function LearningTab() {
    const { colorMode, toggleColorMode } = useColorMode();
    const constellations = JSON.parse(JSON.stringify(constellationList));

    const initialConstellationQuery = useLocation().constellationQuery;
    const [constellationQuery, setConstellationQuery] = useState(constellations.find((constellation) => constellation.name === initialConstellationQuery));

    if (constellationQuery === undefined) {
        setConstellationQuery(constellations[0]);
    }


    function ConstellationDisplay(props) {
        const { colorMode, toggleColorMode } = useColorMode();
        const [imageLoading, setImageLoading] = useState(true);

        return (
            <Box bg={colorMode === 'dark' ? "#12161f" : "#767980"} flex="2" borderRadius="1em" padding="10px">
                <Heading as="h2" size="lg" flex="1" textAlign="center" py="0.5em">{props.constellation.name}</Heading>
                <Skeleton minHeight = "20em" isLoaded = {!imageLoading}><Image onLoad = {() => setImageLoading(false)} transition="box-shadow 0.5s ease-in-out" _hover={{ boxShadow: "dark-lg" }} boxShadow="xl" width="90%" height="auto" src={props.constellation.image} borderRadius="0.5em" /></Skeleton>
                <Divider width="90%" py="1em" />
                <Text flex="1" width="90%" textAlign="center" py="1em">{props.constellation.description}</Text>
                <Text fontSize='xs' py="0.5em" textAlign="right">Powered by Wikipedia. Read more <Link color='teal.500' target="_blank" href={"https://en.wikipedia.org/wiki/" + props.constellation.wikiTitle}>here</Link>.</Text>
            </Box>
        );
    }

    function ConstellationListItem(props) {
        const [show, setShow] = useState(false);
        const { colorMode, toggleColorMode } = useColorMode();

        return (
            <Button ml = { "0.5em"} name="ConstellationListItem" padding="0.5em" width="100%" bg={props.constellation.name === constellationQuery.name ? "blue.900" : (colorMode === 'dark' ? "#12161f" : "#767980")} mt="0.5em" flex="1" borderRadius="0.25em" onClick={() => setConstellationQuery(props.constellation)}>
                <Text name="ConstellationListItemTitle">{props.constellation.name}</Text>
            </Button>
        );
    }

    function SearchBar() {
        const { colorMode, toggleColorMode } = useColorMode();
        const [searchQuery, setSearchQuery] = useState("");

        function handleSearch(searchQuery) {
            console.log(1);
            setSearchQuery(searchQuery);
            let numResults = 0;
            var constellations = document.getElementsByName("ConstellationListItem")
            var constellationTitles = document.getElementsByName("ConstellationListItemTitle");
            const labelList = document.getElementsByName("levelLabel");

            if (searchQuery === "") {
                for (var i = 0; i < constellations.length; i++) {
                    constellations[i].style.display = "block";
                }

                for (var i = 0; i < labelList.length; i++) {
                    labelList[i].style.display = "block";
                }
                document.getElementById("noResults").style.display = "none";
                return;
            } else {
                for (var i = 0; i < labelList.length; i++) {
                    labelList[i].style.display = "none";
                }
            }

            for (var i = 0; i < constellations.length; i++) {
                console.log(constellationTitles[i].innerHTML)
                if (constellationTitles[i].innerHTML.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) {
                    constellations[i].style.display = "block";
                    numResults++;
                } else {
                    constellations[i].style.display = "none";
                }
            }

            if (numResults === 0) {
                document.getElementById("noResults").style.display = "block";
            }
            else {
                document.getElementById("noResults").style.display = "none";
            }
        }

        return (
            <InputGroup bg={colorMode === 'dark' ? "#12161f" : "#767980"} flex="1" borderRadius="1em">
                <InputLeftElement pointerEvents="none">
                    <Search2Icon />
                </InputLeftElement>
                <Input placeholder="Search for a constellation" value={searchQuery} onChange={(event) => handleSearch(event.target.value)} />
            </InputGroup>
        );
    }

    const maxLevel = Math.max(...constellations.map(obj => obj.level));
    const levelColours = ["#008000", "#013220", "#FFBF00", "#BF0000", "#800000"];


    const constellationLevelList = [];
    for (var i = 1; i <= maxLevel; i++) {
        constellationLevelList.push(<Box  borderRadius="0.25em" bg = {levelColours[i - 1]} name = "levelLabel" pl = "1em" fontSize="md" textAlign="center" padding="0.5em" mt = "0.5em">Level {i}</Box>);

        for (var j = 0; j < constellations.length; j++) {
            if (constellations[j].level === i) {
                constellationLevelList.push(<ConstellationListItem constellation={constellations[j]} />);
            }
        }
    }
    console.log(constellationLevelList);

    return (
        <Box>
            <Navbar currentPage="learningTab" />
            <Flex justifyContent="center" minHeight="100vh" width="100vw" bgImage={background}>
                <Box align="center" minHeight="100vh" width="70%" bg={colorMode !== 'dark' ? '#D3D3D3' : 'gray.800'} py="1em">
                    <Heading as="h1" size="xl" flex="1" textAlign="center" py="0.5em">Learning Tab</Heading>
                    <Flex direction="row" width="90%" justify="flex-end">
                        <ConstellationDisplay constellation={constellationQuery} />
                        <Spacer flex="0.1" />
                        <Box flex="1">
                            <SearchBar />
                            <Box display="none" py="1em" id="noResults">
                                <Text fontSize="sm" textAlign="center">No constellations found.</Text>
                            </Box>
                            {
                                constellationLevelList
                            }
                        </Box>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
}