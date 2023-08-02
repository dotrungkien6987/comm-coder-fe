import React, { useCallback, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FTextField, FUploadImage, FormProvider } from "../../components/form";

import {
  Box,
  Stack,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Card,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createPost, editPost } from "./postSlice";

const yupSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});

function PostFormEdit({
  open,
  post,
  handleClose,
  handleSave,
  formData,
  handleChange,
}) {
  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: { content: post.content, image: post.image },
  });
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const dispatch = useDispatch();

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const onSubmit = (data) => {
    console.log("data", data);
    const { content, image } = { ...data };
    dispatch(editPost(post, content, image));
    handleClose();
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            width: "1000px", // Or any other width you want
            height: "600px", // Or any other height you want
          },
        }}
      >
        <DialogTitle id="form-dialog-title">Edit your post</DialogTitle>
        <DialogContent>
          <Card sx={{ p: 3 }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <FTextField
                  name="content"
                  multiline
                  fullWidth
                  rows={4}
                  placeholder="share what you are thinking here ..."
                  sx={{
                    "& fieldset": {
                      borderWidth: "1px !important",
                      borderColor: alpha("#919EAB", 0.32),
                    },
                  }}
                />

                <FUploadImage
                  name="image"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="small"
                    loading={isSubmitting}
                  >
                    Post
                  </LoadingButton>
                </Box>
              </Stack>
            </FormProvider>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PostFormEdit;
