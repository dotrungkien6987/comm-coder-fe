import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteComment, sendCommentReaction } from "./commentSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuth from "../../hooks/useAuth";
function CommentReaction({ comment }) {
  const dispatch = useDispatch();
  const {user} = useAuth();
  const handleClick = (emoji) => {
    dispatch(sendCommentReaction({ commentId: comment._id, emoji }));
     };

  //dialogDelete
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    console.log("comment", comment);
    dispatch(deleteComment(comment));
    handleCloseDialog();
  };

  return (
    <Stack direction="row" alignItems="center">
      {comment.author._id === user._id && (
        <>
          <IconButton
            onClick={() => handleClickOpen()}
            sx={{ color: "primary.second" }}
          >
            <DeleteIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Dialog
            open={open}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Warning!"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this Post?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDelete} color="primary" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <Box sx={{ flexGrow: 1 }} />
      <IconButton
        onClick={() => handleClick("like")}
        sx={{ color: "primary.main" }}
      >
        <ThumbUpRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Typography variant="body2" mr={1}>
        {comment?.reactions?.like}
      </Typography>

      <IconButton
        onClick={() => handleClick("dislike")}
        sx={{ color: "error.main" }}
      >
        <ThumbDownAltRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Typography variant="body2">{comment?.reactions?.dislike}</Typography>
    </Stack>
  );
}

export default CommentReaction;
