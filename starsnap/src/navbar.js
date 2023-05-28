// Imports
import {
    Box,
    Text,
    Button,
    ButtonGroup,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Container,
    Icon,
    Flex,
    Collapse,
    HStack,
    IconButton,
    Image,
} from '@chakra-ui/react';
import { FaGraduationCap, FaSignOutAlt, FaComments, FaUserAstronaut, FaImages} from 'react-icons/fa';
import cameraIcon from './images/cameraIcon.png';
import logo from './images/logo.png';
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
                    <Flex justify="space-between">
                        <Image src={logo} alt="Logo" height="5em" borderRadius={10000} />
                        <Flex justify="center" flex={1} align="center">
                            <ButtonGroup variant="ghost" spacing="8">
                                <Button as="a" href="/" leftIcon={<Icon as={FaGraduationCap} boxSize="1.5em" />} variant={props.currentPage === "learningTab" ? "solid" : "ghost"}>Learning Tab</Button>
                                <Image display="inline" onMouseDown={{/*Add navigate function*/ }} boxSize="6em" src={cameraIcon} _hover={{ border: "2px", boxShadow: "dark-lg" }} border="1px" boxShadow="lg" borderRadius={1000000} />
                                <Button as="a" href="/" leftIcon={<Icon as={FaComments} boxSize="1.5em" />} variant={props.currentPage === "learningTab" ? "solid" : "ghost"}>Forum</Button>
                                {mods.includes(username) ? <Button onClick={() => Navigate("/ModDashboard", { state: { access: true } })} variant={props.currentPage === "moderator" ? "solid" : "ghost"}>Moderator Dashboard</Button> : <></>}
                            </ButtonGroup>
                        </Flex>
                        <HStack spacing="3">
                            <ColorModeSwitcher />
                            <NavbarProfileLink />
                        </HStack>
                    </Flex>
                </Container>
            </Box>
        </Box>

    )
}

function NavbarProfileLink(props) {
    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const username = "abc";// useSelector(state => state.username);

    const logOut = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            const action = { type: "LOGOUT" };
            dispatch(action);
            try {
                Navigate("/Registration", { state: { typeNotification: "loggedOut" } });
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    if (!username) {
        return (
            <Button variant="ghost" onClick={() => Navigate("/Registration", { state: { typeNotification: "loggedIn" } })}>
                <Text fontSize="sm" fontWeight="medium" color="gray.500">Log In or Sign Up</Text>
            </Button>
        );
    }
    else {
        return (
            <HStack>
                <Menu>
                    <MenuButton as={IconButton} aria-label='ProfilePic' variant="ghost" icon = {<Image src={cameraIcon} alt="Logo" height="50px" borderRadius={10000}  _hover = {{border: "1px"}} />} borderRadius={1000000}>
                    </MenuButton>
                    <MenuList>
                        <MenuItem icon = {<Icon as = {FaUserAstronaut} boxSize={5} />} onClick={() => Navigate("/profile/" + username)}>Profile</MenuItem>
                        <MenuItem icon = {<Icon as = {FaImages} boxSize={5} />} onClick={() => Navigate("/personalGallery")}>Personal Gallery</MenuItem>
                        <MenuDivider />
                        <MenuItem icon = {<Icon as = {FaSignOutAlt} boxSize={5} />} onClick={logOut}>Log out</MenuItem>
                        </MenuList>
                </Menu>
            </HStack>
        );
    }
}