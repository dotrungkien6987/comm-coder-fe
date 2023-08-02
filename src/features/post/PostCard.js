import React, { useState } from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  MenuItem,
  Divider,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostReaction from "./PostReaction";
import CommentList from "../comment/CommentList";
import CommentForm from "../comment/CommentForm";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { deletePost } from "./postSlice";
import PostFormEdit from "./PostFormEdit";

function PostCard({ post }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useAuth();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();
  const handleEdit = () => {
    setOpenEdit(true);
    console.log("Edit post");
    setAnchorEl(null);
  };

  const handleRemove = () => {
    console.log("Remove post");
    dispatch(deletePost(post._id));
    setAnchorEl(null);
    setOpen(false);
  };

  //dialogDelete
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  //dialog Edit Post
  const [openEdit, setOpenEdit] = useState(false);

    const handleClickOpenEditPostForm = () => {
    setOpenEdit(true);
  };

  const handleCloseEditPostForm = () => {
    setOpenEdit(false);
  };

  const handleSaveEditPostForm = () => {
    // Code to save changes goes here
    setOpenEdit(false);
  };

  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          user._id === post.author._id && (
            <div>
              <IconButton onClick={handleClick}>
                <MoreVertIcon sx={{ fontSize: 30 }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <Divider />
                <MenuItem onClick={handleClickOpen}> Remove</MenuItem>
              </Menu>
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
                  <Button onClick={handleRemove} color="primary" autoFocus>
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
              <PostFormEdit 
              open = {openEdit}
              handleClose={handleCloseEditPostForm} 
        handleSave={handleSaveEditPostForm} 
       post={post}
              />
            </div>
          )
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography> {post.content}</Typography>
        {post.image && (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img src={post.image} alt="post" />
          </Box>
        )}
        {console.log(`post Prop Post Reation from PostCard`, post)}
        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
    </Card>
  );
}

export default PostCard;
