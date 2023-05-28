//Imports
import React from 'react';
import LazyLoad from 'react-lazyload';
import moment from 'moment';
import moderatorList from './moderatorsList.json';
import UseFetch from './UseFetch.js';
import { FaLink, FaComment, FaThumbsUp} from 'react-icons/fa';
import cameraIcon from './images/cameraIcon.png';
import testImage from './images/testImage.jpg';
import {
    Box,
    Text,
    IconButton,
    Link,
    Badge,
    Select,
    Button,
    Container,
    HStack,
    Heading,
    Divider,
    Collapse,
    Image,
    ButtonGroup,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { CheckIcon, WarningIcon, AddIcon, ChatIcon, TriangleDownIcon, TriangleUpIcon, Search2Icon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Post(props) {
    //props: PostID, image, caption, date, UserID, Tag
    const PostID = 0; //props.PostID;
    const image = testImage; //props.Image;
    const Caption = "The Beehive Cluster is an open cluster in the constellation Cancer. One of the nearest open clusters to Earth, it contains a larger population of stars than other nearby bright open clusters holding around 1,000 stars." //props.Caption;
    const Date = 20120606; //props.Date;
    const isLiked = false;
    const UserID = 0; //props.UserID;
    const Tag = "Beehive Cluster"//props.Tag;

    const Navigate = useNavigate();
    const timeAgo = moment(Date).fromNow();
    const author = UseFetch("localhost:4000/" + props.UserID); //REPLACE URL
    const authorUsername = "Test Username"; //author.username;
    

    const mods = JSON.parse(JSON.stringify(moderatorList)).moderators;
    const isMod = mods.includes(author.username);

    return (
        <LazyLoad>
            <Container boxShadow = "md" minWidth = "50%" padding = "10px" name = "postContainer" marginBottom = "10px">
                <Badge ml='1' colorScheme='green' float="right" name="postTag">
                    {Tag}
                </Badge>
                {isMod ?
                    <Badge ml='1' colorScheme='yellow' float="right" name="mod">
                        Moderator Post
                    </Badge>
                    : <></>
                }
                    <HStack><Image  src={cameraIcon} height = "2em" onMouseDown={Navigate()} alt="ProfPic" borderRadius={10000} _hover={{border: "1px"}} /><Text fontSize="sm" color="gray.500"><Link href={"/ProfilePage/" + authorUsername} color="teal.500" >{authorUsername}</Link> {timeAgo}</Text></HStack>
                    <Divider color = "gray.500" paddingTop = "5px" />
                    <Image height = "40vh" width = "100%" py = "8px" src={image} alt="PostImage" />
                    <Divider color = "gray.500" paddingTop = "5px" />
                <HStack height = "5em">
                    <ButtonGroup isAttached variant="outline" borderRight = "5px">
                <IconButton onMouseDown = {LikePost(PostID, UserID)} color = {isLiked ? "blue.500" : ""} size='md' mt = '1rem' icon = {<FaThumbsUp />} />
                <IconButton size='md' mt = '1rem' icon = {<FaComment />} />
                <IconButton size='md' mt = '1rem' icon = {<FaLink />} />
                </ButtonGroup>
                <Text paddingLeft = "1em" paddingTop = "1em" fontSize="sm" color="gray.500" name="postCaption">
                    {Caption}
                </Text>
                </HStack>
            </Container>
        </LazyLoad>
    );
}

function LikePost(PostID, UserID) {}