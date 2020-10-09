import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import ImportContacts from "@material-ui/icons/ImportContacts";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";  
import { useRouter } from "next/router";
import axios from "axios";
import MuiAlert from "@material-ui/lab/Alert";
import Link from "next/link";
import * as _ from 'lodash'

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Contacts() {
  const classes = useStyles();
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  const getContacts = async () => {
    const jwt = document.cookie.split('=')[1];
    // Call register end point
    const res = await axios.get("http://localhost:8000/contacts/",  {
      validateStatus: function (status) {
        return true; // default
      },
      headers: {'Authorization': `Bearer ${jwt}`}
    });

    // Get request was successful
    if (res.status >= 200 && res.status < 300) {
      // Check if contact and res.data are same
      if(!_.isEqual(res.data, contacts)){
        // If not update state
        setContacts(res.data)
      }
    } else {
      // Autentication error
      setError( `Error: ${res.data.message}. Please sign in.`)
    }
  };

 // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Get all user contacts
    getContacts()
  });

  const logout = () => {
    // delete cookie
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    // Redirect user to index page
    router.push("/");
  };

  const createContact = () => {
    // Redirect user to index page
    router.push("/create");
  };

  const viewContact = (contact) => {
    alert(JSON.stringify(contact))
  };

  const editContact = (_id) => {
    router.push('/edit', {query: { _id }});
  };

  const deleteContact = async (_id) => {
    const jwt = document.cookie.split('=')[1];
    // Call register end point
    const res = await axios.delete(`http://localhost:8000/contacts/${_id}`,  {
      validateStatus: function (status) {
        return true; // default
      },
      headers: {'Authorization': `Bearer ${jwt}`}
    });

    // Get request was successful
    if (res.status >= 200 && res.status < 300 && res.data > 0) {
      // Update contacts
      getContacts();
    
    } else {
      // Autentication error
      setError( `Error: Could not delete contact.`)
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <ImportContacts className={classes.icon} edge="start" />
          <Typography variant="h6" color="inherit" noWrap>
            Contact list
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Contact list
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              List of all your contacts. If you want to view contact details
              click view button in contact card. For contact editing click edit
              button.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button onClick={createContact} variant="contained" color="primary">
                    Create new contact
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={logout} variant="outlined" color="primary">
                    Logout
                  </Button>
                </Grid>
              </Grid>
            </div>
            { error && (
              <Grid container spacing={2} justify="center">
                <Grid item>
                <Alert severity="error">{error}</Alert>
              </Grid>
              <Grid item justify="center" style={{alignItems: 'center',display: 'flex'}}>
                <Link href="/login" variant="body2">
                  Login
                </Link>
              </Grid>
            </Grid>
            )}
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {contacts.map((contact, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg"
                    title="User profile picture"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {contact.firstName} {contact.lastName}
                    </Typography>
                    <Typography>
                      Email: {contact.email}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick={viewContact.bind(this, contact)} size="small" color="primary">
                      View
                    </Button>
                    <Button onClick={editContact.bind(this, contact._id)} size="small" color="primary">
                      Edit
                    </Button>
                    <Button onClick={deleteContact.bind(this, contact._id)} size="small" color="primary">
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}
