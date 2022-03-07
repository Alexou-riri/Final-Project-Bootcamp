// import Link from 'next/link'
import { css } from '@emotion/react';
import Layout from '../components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

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

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');

  return (
    <Layout>
      <Head>
        <title>Register</title>
        <meta name="description" content="Register on this website" />
      </Head>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const signupResponse = await fetch('/api/signup', {
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
        }}
      >
        <label css={label} htmlFor="username">
          User Name :
          <input
            value={username}
            id="username"
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
        </label>

        <label css={label} htmlFor="password">
          Password :
          <input
            type="password"
            value={password}
            id="password"
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </label>

        <label css={label} htmlFor="company">
          Company:
          <input
            value={company}
            id="company"
            onChange={(event) => setCompany(event.currentTarget.value)}
          />
        </label>
        <button>Sign Up</button>
      </form>
    </Layout>
  );
}
