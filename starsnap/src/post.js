//Imports
import React from 'react';
import LazyLoad from 'react-lazyload';
import moment from 'moment';
import moderatorList from './moderatorsList.json';
import UseFetch from './UseFetch.js';
import {
    Box,
    Text,
    Link,
    Badge,
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
    Input,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import 'react-quill/dist/quill.snow.css';
import Toast from './Toast.js';
import { CheckIcon, WarningIcon, AddIcon, ChatIcon, TriangleDownIcon, TriangleUpIcon, Search2Icon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';

export default function post(props) {
    //props: id, image, caption, date, user_id, tag
    const timeAgo = moment(props.date).fromNow();
    const author = UseFetch("" + props.user_id); //REPLACE URL


    const mods = JSON.parse(JSON.stringify(moderatorList)).moderators;
    const isMod = mods.includes(author.username);

    return (
        <LazyLoad>
            <div className='ql-editor' style={{ margin: "0px", padding: "0px" }}>
                <Container boxShadow="md" minWidth="80%" padding="10px" name="threadContainer" marginBottom="10px" border={isMod ? "1px" : "0px"} borderColor={isMod ? "gold" : "white"}>
                    <Badge ml='1' colorScheme='green' float="right" name="threadTag">
                        {props.tag}
                    </Badge>
                    {isMod ?
                        <Badge ml='1' colorScheme='yellow' float="right" name="mod">
                            Moderator Post
                        </Badge>
                        : <></>
                    }
                    <a href={"./Threads/" + props.id}><Heading size="md" name="threadTitle">{props.title}</Heading>
                        <Text fontSize="sm" color="gray.500">Posted by <Link href={"/ProfilePage/" + (author ? author.username : "")} color="teal.500" >{author ? author.username : ""}</Link> {timeAgo}</Text>
                        <Divider paddingTop="10px" /><br />
                        <Collapse startingHeight="80px" in={show} padding="10px" dangerouslySetInnerHTML={{ __html: props.desc }} name="threadDesc">
                        </Collapse>
                    </a>
                    <Button size='sm' onClick={handleToggle} mt='1rem'>
                        Show {show ? 'less' : 'all'}
                    </Button>
                </Container>
            </div>
        </LazyLoad>
    );
}