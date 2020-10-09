import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import ImportContacts from "@material-ui/icons/ImportContacts";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Layout from "../components/layout";
import Link from "next/link";
import MuiAlert from "@material-ui/lab/Alert";

import { useForm } from "react-hook-form";
import axios from "axios";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function StatusAlert(props) {
  const status = props.status;
  if (!status) {
    return "";
  }
  if (status.success) {
    return <Alert severity="success">{status.msg}</Alert>;
  } else {
    return <Alert severity="error">{status.msg}</Alert>;
  }
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
    backgroundColor: theme.palette.primary.light,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Edit() {
const contact = localStorage.getItem('editContact');
    console.log(contact);
  const classes = useStyles();
  const [resStatus, setResStatus] = useState(null);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const jwt = document.cookie.split('=')[1];
    // Call register end point
    const res = await axios.post("http://localhost:8000/contacts/", data,  {
      validateStatus: function (status) {
        return true; // default
      },
      headers: {'Authorization': `Bearer ${jwt}`}
    });

    console.log(res)

    // User register successed
    if (res.status >= 200 && res.status < 300) {
      // Set success message
      setResStatus({ success: 1, msg: `Contact was created successfully!` });
    } else {
      // User register failed
      // Set error message
      setResStatus({
        success: 0,
        msg: `Error: ${res.data.message}.`,
      });
    }
  };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <ImportContacts />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create new contact
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={classes.form}
            noValidate
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  inputRef={register({ required: true })}
  >{firstName}</TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  inputRef={register({ required: true })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  inputRef={register({ required: true })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  id="phoneNumber"
                  inputRef={register({ required: true })}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/contacts" variant="body2">
                  Go back
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <StatusAlert status={resStatus} />
        </Box>
      </Container>
  );
}
