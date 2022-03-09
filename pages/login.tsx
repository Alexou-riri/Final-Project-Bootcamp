// import Link from 'next/link'
import { css } from '@emotion/react';
import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import Router, { useRouter } from 'next/router';

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

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = Router;
  return (
    <Layout>
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
