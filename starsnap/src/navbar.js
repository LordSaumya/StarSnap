// Imports
import {
    Box,
    Text,
    Button,
    ButtonGroup,
    Container,
    Flex,
    Slide,
    HStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { useNavigate } from 'react-router-dom';
// import LogoImage from './logo.png'; /* TODO: change to logo */
import moderatorList from './moderatorsList.json';
import { useSelector, useDispatch } from 'react-redux';

// Main component
export default function Navbar(props) {
    const mods = JSON.parse(JSON.stringify(moderatorList)).moderators;
    const username = "abc"; //useSelector(state => state.username);
    const Navigate = useNavigate();
    const profPageLink = "/profile/" + username;

    const [hoveredLT, setHoveredLT] = useState(false);
    return (
        <Box
            as="section"
            pb={{
                base: '12',
                md: '24',
            }}>

            <Box as="nav" bg="bg-surface">
                <Container
                    py={{
                        base: '4',
                        lg: '5',
                    }}
                    minW="100%"
                    borderBottomWidth=".5px"
                    boxShadow='md'
                >
                    <HStack spacing="10" justify="space-between">
                        {/* <img src={LogoImage} alt="Logo" width="50px" /> */}
                        <Flex justify="space-between" flex="1">
                            <ButtonGroup variant="ghost" spacing="8">
                                <a href="/"><Slide direction='bottom' in={hoveredLT} style={{ zIndex: 10 }}><Button variant={props.currentPage === "learningTab" ? "solid" : "ghost"}>Learning Tab</Button></Slide></a>
                                <a href={profPageLink}><Button variant={props.currentPage === "profile" ? "solid" : "ghost"}>Profile</Button></a>
                                {mods.includes(username) ? <Button onClick={() => Navigate("/ModDashboard", { state: { access: true } })} variant={props.currentPage === "moderator" ? "solid" : "ghost"}>Moderator Dashboard</Button> : <></>}
                            </ButtonGroup>
                            <HStack spacing="3">
                                <ColorModeSwitcher justifySelf="flex-end" />
                            </HStack>
                        </Flex>
                    </HStack>
                </Container>
            </Box>
        </Box>

    )
}