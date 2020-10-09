import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "next/link";
import MuiAlert from "@material-ui/lab/Alert";

import { useRouter } from 'next/router'
import { useForm } from "react-hook-form";
import axios from "axios";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const router = useRouter()
  const classes = useStyles();
  const { register, handleSubmit } = useForm();
  const [loginErr, setLoginErr] = useState(null);

  const onSubmit = async (data) => {
    // Call register end point
    const res = await axios.post("http://localhost:8000/login", data, {
      validateStatus: function (status) {
        return true; // default
      },
    });
    console.log(res.data)
    // User login successed
    if (res.status >= 200 && res.status < 300) {
      const { accessToken, expiresIn} = res.data.token
      // Set cookie
      document.cookie = `session=${accessToken}; expires=${expiresIn};`;
      // Redirect user to contacts page
      router.push('/contacts')
    } else {
      // User login failed
      // Set error message
      setLoginErr( `Error: ${res.data.message}`);
    }
  };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={classes.form}
            noValidate
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={register({ required: true })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={register({ required: true })}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#">Forgot password?</Link>
              </Grid>
              <Grid item>
                <Link href="/register">{"Don't have an account? Sign Up"}</Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          {
            loginErr && <Alert severity="error">{loginErr}</Alert>
          }
        </Box>
      </Container>
  );
}
