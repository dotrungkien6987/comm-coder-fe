import React, { useEffect } from "react";

import { Pagination, Stack, Typography } from "@mui/material";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getComments } from "./commentSlice";
import CommentCard from "./CommentCard";
import LoadingScreen from "../../components/LoadingScreen";
import { COMMENTS_PER_POST } from "../../app/config";

function CommentList({ postId }) {
  const {
    commentsByPost,
    commentsById,
    totalComments,
    isLoading,
    currentPage,
  } = useSelector(
    (state) => ({
      commentsByPost: state.comment.commentsByPost[postId],
      commentsById: state.comment.commentsById,
      totalComments: state.comment.totalCommentsByPost[postId],
      isLoading: state.comment.isLoading,
      currentPage: state.comment.currentPageByPost[postId] || 1,
    }),
    shallowEqual
  );
  const totalPages = Math.ceil(totalComments / COMMENTS_PER_POST);
 
  
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(`postID in UseEfect is`, postId);
    if (postId) dispatch(getComments({ postId }));
  }, [postId, dispatch]);

  let renderComments;

  if (commentsByPost) {
    const comments = commentsByPost.map((commentId) => commentsById[commentId]);
    renderComments = (
      <Stack spacing={1.5}>
        {comments.map((comment) => (
          <CommentCard key={comment._id} comment={comment} />
        ))}
      </Stack>
    );
  } else if (isLoading) {
    renderComments = <LoadingScreen />;
  }

  return (
    // <h6>commentList</h6>
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle" sx={{ color: "text.secondary" }}>
          {totalComments > 1
            ? `${totalComments} comments`
            : totalComments === 1
            ? `${totalComments} comment`
            : "No comment"}
        </Typography>
        {totalComments > COMMENTS_PER_POST && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => dispatch(getComments({ postId, page }))}
          />
        )}
      </Stack>
      {renderComments}
    </Stack>
  );
}

export default CommentList;
