import Head from 'next/head'
import Container from '@material-ui/core/Container';

function Layout({ children }) {
  return (
    <Container>
      {" "}
      <Head>
        <title>Blocksi</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>
      {children}
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </Container>
  );
}

export default Layout;
