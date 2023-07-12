import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Collapse,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://riashvlmualipdicirlb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYXNodmxtdWFsaXBkaWNpcmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc2MzgwNjIsImV4cCI6MjAwMzIxNDA2Mn0._aTzU3_PMXZdpxI-_gp1JaFMevd080yGYURIubIzibE";
const supabase = createClient(supabaseUrl, supabaseKey);

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [tag, setTag] = useState("");
  const [searchCaption, setSearchCaption] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from("posts")
        .select("*")
        .select("likes_count") // Retrieve likes count
        .select("shares_count") // Retrieve shares count
        .select("comments"); // Retrieve comments

      if (searchCaption) {
        query = query.like("caption", `%${searchCaption}%`);
      }
      if (searchTag) {
        query = query.like("tag", `%${searchTag}%`);
      }

      if (sortBy === "date") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "likes") {
        query = query.order("likes_count", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  const handleEditComment = async (postId, commentId, newText) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .update({ "comments:commentId:text": newText }) // Update the comment text
        .eq("id", postId);

      if (error) {
        throw error;
      }
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          const updatedComments = post.comments.map((comment) =>
            comment.id === commentId ? { ...comment, text: newText } : comment
          );
          return { ...post, comments: updatedComments };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error editing comment:", error.message);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({
          "comments:commentId": supabase.sql(
            "array_remove(comments, commentId)"
          ),
        }) // Remove the comment
        .eq("id", postId);

      if (error) {
        throw error;
      }
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          const updatedComments = post.comments.filter(
            (comment) => comment.id !== commentId
          );
          return { ...post, comments: updatedComments };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  const handleSubmitComment = async (postId, e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("posts")
        .update({
          comments: supabase.sql(`array_append(comments, ${newComment})`),
        })
        .eq("id", postId);

      if (error) {
        throw error;
      }
      const updatedPosts = posts.map((post) =>
        post.id === postId ? { ...post, comments: data[0].comments } : post
      );
      setPosts(updatedPosts);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .update({ likes_count: supabase.sql("likes_count + 1") })
        .eq("id", postId);

      if (error) {
        throw error;
      }
      const updatedPosts = posts.map((post) =>
        post.id === postId
          ? { ...post, likes_count: data[0].likes_count }
          : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking post:", error.message);
    }
  };

  const handleShare = async (postId) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .update({ shares_count: supabase.sql("shares_count + 1") })
        .eq("id", postId);

      if (error) {
        throw error;
      }
      const updatedPosts = posts.map((post) =>
        post.id === postId
          ? { ...post, shares_count: data[0].shares_count }
          : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error sharing post:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([{ caption, image, tag }]);
      if (error) {
        throw error;
      }
      setPosts([...posts, data[0]]);
      setCaption("");
      setImage("");
      setTag("");
      setSearchCaption("");
      setSearchTag("");
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Social Forum
      </Heading>

      <Flex mt={4}>
        <FormControl>
          <FormLabel>Search by Caption</FormLabel>
          <Input
            type="text"
            value={searchCaption}
            onChange={(e) => setSearchCaption(e.target.value)}
          />
        </FormControl>

        <FormControl ml={4}>
          <FormLabel>Search by Tag</FormLabel>
          <Input
            type="text"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
          />
        </FormControl>

        <FormControl ml="auto" w={200}>
          <FormLabel>Sort By</FormLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="likes">Likes</option>
          </Select>
        </FormControl>
      </Flex>

      <form onSubmit={handleSubmit}>
        <Flex mb={4}>
          <FormControl mr={4}>
            <FormLabel>Caption</FormLabel>
            <Input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
            />
          </FormControl>
          <FormControl mr={4}>
            <FormLabel>Image URL</FormLabel>
            <Input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </FormControl>
          <FormControl mr={4}>
            <FormLabel>Tag</FormLabel>
            <Input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Submit
          </Button>
        </Flex>
      </form>

      <VStack spacing={4} align="stretch">
        {posts.map((post) => (
          <Box
            key={post.id}
            bg="white"
            boxShadow="base"
            p={4}
            borderRadius="md"
          >
            <Heading as="h2" size="lg" mb={2}>
              {post.caption}
            </Heading>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Posted by {post.author} on {post.created_at}
            </Text>
            <Text>{post.tag}</Text>
            <Flex mt={4}>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => handleLike(post.id)}
              >
                Like ({post.likes_count})
              </Button>
              <Button
                ml={2}
                colorScheme="green"
                size="sm"
                onClick={() => handleShare(post.id)}
              >
                Share ({post.shares_count})
              </Button>
            </Flex>

            <Collapse startingHeight={0} in={showComments.includes(post.id)}>
              <VStack spacing={2} mt={4} align="stretch">
                {post.comments.map((comment) => (
                  <Box key={comment.id} p={2} bg="gray.200" borderRadius="md">
                    {comment.text}
                    {(comment.author === post.author ||
                      comment.isModerator) && (
                      <Flex justify="flex-end" mt={2}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          mr={2}
                          onClick={() =>
                            handleEditComment(
                              post.id,
                              comment.id,
                              "Updated text"
                            )
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() =>
                            handleDeleteComment(post.id, comment.id)
                          }
                        >
                          Delete
                        </Button>
                      </Flex>
                    )}
                  </Box>
                ))}
              </VStack>
            </Collapse>

            <Button
              mt={2}
              size="sm"
              colorScheme="blue"
              onClick={() =>
                setShowComments((prev) =>
                  prev.includes(post.id)
                    ? prev.filter((id) => id !== post.id)
                    : [...prev, post.id]
                )
              }
            >
              {showComments.includes(post.id)
                ? "Hide Comments"
                : "Show Comments"}
            </Button>
            <form onSubmit={(e) => handleSubmitComment(post.id, e)}>
              <FormControl mt={2}>
                <FormLabel>Leave a Comment</FormLabel>
                <Input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
              </FormControl>
              <Button mt={2} type="submit" colorScheme="blue" size="sm">
                Submit Comment
              </Button>
            </form>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default HomePage;
