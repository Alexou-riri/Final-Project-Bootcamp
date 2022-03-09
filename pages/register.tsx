// import Link from 'next/link'
import { css } from '@emotion/react';
import Layout from '../components/Layout';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';
import { loadDefaultErrorComponents } from 'next/dist/server/load-components';
// import { responseBody } from './api/signup';

// const label = css``;
/* .tel {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
  } */

const label = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// const form = css`
//   border: 1px solid black;
// `;

type Errors = { message: string }[];

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = Router;

  return (
    <Layout>
      <Head>
        <title>Register</title>
        <meta name="description" content="Register on this website" />
      </Head>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const createUserResponse = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: username,
              password: password,
              company: company,
            }),
          });

          const createUserResponseBody = await createUserResponse.json();
          if ('errors' in createUserResponseBody) {
            setErrors(createUserResponseBody.errors);
            return;
          }
          await router.push('/login');
        }}
      >
        <label css={label}>
          User Name :
          <input
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
        </label>
        <div>
          {errors.map((error) => {
            return <div key={`error-${error.message}`}>{error.message};</div>;
          })}
        </div>

        <label css={label}>
          Password :
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </label>

        <label css={label}>
          Company:
          <input
            value={company}
            onChange={(event) => setCompany(event.currentTarget.value)}
          />
        </label>
        <button>Sign Up</button>
      </form>
    </Layout>
  );
}
