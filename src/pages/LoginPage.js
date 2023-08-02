import React, { useState } from "react";
import { FCheckbox, FormProvider, FTextField } from "../components/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { reset } from "numeral";
import useAuth from "../hooks/useAuth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Container,
  Stack,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});
const defaultValues = {
  email: "",
  password: "",
  remember: true,
};

function LoginPage() {
  const auth = useAuth();
  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    
    const from = location.state?.from?.pathname || "/";
    console.log(from);
    let { email, password } = data;
    // console.log(email);
    try {
      await auth.login({ email, password }, () => {
        navigate(from, { replace: true });
      });
      // console.log(`isAuth after submit login ${auth.isAuthenticated}`);
    } catch (error) {
      reset();
      setError("responseError", error);
    }
  };
  return (
    <div>
      <Container maxWidth="xs">
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {!!errors.responseError && (
              <Alert severity="error">{errors.responseError.message}</Alert>
            )}
            <Alert severity="info">
              Don't have an acount? {""}
              <Link variant="subtitle2" component={RouterLink} to="/register">
                Get startted
              </Link>
            </Alert>

            <FTextField name="email" label="Email address" />
            <FTextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

<Stack
direction="row"
alignItems="center"
justifyContent="space-between"
sx={{my:2}}
>
  <FCheckbox name="remember" label="Remember me" />
  <Link component={RouterLink} variant="subtitle2" to ="/">
  Forgot password?
  </Link>
  </Stack>          

  <LoadingButton
  fullWidth
  size ="large"
  type = "submit"
  variant="contained"
  loading={isSubmitting}
  >
    Login
  </LoadingButton>
        </FormProvider>
      </Container>
    </div>
  );
}

export default LoginPage;
