import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "./postSlice";
import PostCard from "./PostCard";
import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";
function PostList({ profile }) {
  const userID = profile._id;
  const [page, setPage] = useState(1);
  const { currentPagePosts, postsById, totalPosts, isLoading } = useSelector(
    (state) => state.post
  );
  const posts = currentPagePosts.map((postID) => postsById[postID]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userID) dispatch(getPosts({ userID, page }));
  }, [userID, page,dispatch]);
  return (
    <>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      <Box sx={{ display: "flex", justifycontent: "center" }}>
        {totalPosts ? (
          <LoadingButton
            variant="outlined"
            size="small"
            loading={isLoading}
            onClick={() => setPage((page) => page + 1)}
            disabled={Boolean(totalPosts) && posts.length >= totalPosts}
          >
            Load more
          </LoadingButton>
        ) : (
          <Typography variant="h6">No post yet</Typography>
        )}
      </Box>
    </>
  );
}

export default PostList;
