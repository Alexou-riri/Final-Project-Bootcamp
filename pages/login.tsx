// import Link from 'next/link'
import { css } from '@emotion/react';
import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import Router, { useRouter } from 'next/router';
import { getValidSessionByToken } from '../util/database';
import { GetServerSidePropsContext } from 'next';

const label = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;

// const form = css`
//   border: 1px solid black;
// `;

type Errors = { message: string }[];

export type Props = {
  refreshUserProfile: () => void;
  userObject: { username: string };
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = Router;
  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login on this website" />
      </Head>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const loginResponse = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: username,
              password: password,
            }),
          });

          const loginResponseBody = await loginResponse.json();
          if ('errors' in loginResponseBody) {
            setErrors(loginResponseBody.errors);
            return;
          }

          // redirect to dashboard when login complete and without errors
          // clear the errors message
          setErrors([]);

          props.refreshUserProfile();
          await router.push(`/users/${loginResponseBody.user.id}`);
        }}
      >
        <label css={label}>
          User Name :
          <input
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
        </label>

        <label css={label}>
          Password :
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </label>
        <div>
          {errors.map((error) => {
            return <div key={`error-${error.message}`}>{error.message};</div>;
          })}
        </div>
        <button>Log In</button>
      </form>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // // Redirect from HTTP to HTTPS on Heroku
  // if (
  //   context.req.headers.host &&
  //   context.req.headers['x-forwarded-proto'] &&
  //   context.req.headers['x-forwarded-proto'] !== 'https'
  // ) {
  //   return {
  //     redirect: {
  //       destination: `https://${context.req.headers.host}/login`,
  //       permanent: true,
  //     },
  //   };
  // }

  // 1. check if there is a token and is valid from the cookie
  const token = context.req.cookies.sessionToken;

  if (token) {
    // 2. check if the token is valid and redirect
    const session = await getValidSessionByToken(token);

    if (session) {
      console.log(session);
      return {
        redirect: {
          // À changer
          destination: `/users/dashboard`,
          permanent: false,
          props: { message: `You are already registered !` },
        },
      };
    }
  }

  // 3. Otherwise, generate CSRF token and render the page
  return {
    props: {},
  };
}
