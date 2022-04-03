// import Link from 'next/link'
import { css } from '@emotion/react';
import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import Router, { useRouter } from 'next/router';
import { getValidSessionByToken } from '../util/database';
import { GetServerSidePropsContext } from 'next';
import { createCsrfToken } from '../util/auth';
import { LoginResponseBody } from './api/login';

const form = css`
  border: 1px solid black;
  box-shadow: 0px 1px 12px rgba(0, 0, 0, 0.25);
  margin-bottom: 10rem;
  margin-left: 40%;
  margin-right: 40%;
  padding: 2rem;
  border-radius: 10px;
  background-color: #00b8c232;

  /* padding-left: 25px;
  padding-right: 25px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-flow: column;
  -ms-flex-flow: column;
  flex-flow: column;
  z-index: 5; */

  input {
    border: none;
    outline: none;
  }
  :-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.65);
  }
  :-webkit-input-placeholder .input-line:focus + :input-placeholder {
    color: #fff;
  }
  .input-line:focus {
    outline: none;
    border-color: #fff;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
  }
  .input-line {
    background: none;
    margin-bottom: 10px;
    line-height: 2.4em;
    color: black;
    font-family: 'Oxygen';
    font-weight: 500;
    letter-spacing: 0px;
    letter-spacing: 0.02rem;
    font-size: 19px;
    font-size: 1.2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.65);
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
  }
  .full-width {
    width: 100%;
  }

  /* background-image: url(pal_closeup.jpg) */
`;
const label = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  padding-bottom: 10px;
`;

const login = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  margin-top: 34px;
  cursor: pointer;

  border-radius: 4px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 10px 30px;
  box-shadow: 0 0 10px #00b8c2;
  transition: 0.4s;
  color: #00b8c2;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid #00b8c2;

  &:hover {
    color: white;
    box-shadow: 0 0 20px #00b8c2;
    background-color: #00b8c2;
  }
`;

const image = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: auto;
  /* margin-top: 60px; */
  /* border: 1px solid red; */
`;
// const form = css`
//   border: 1px solid black;
// `;

type Errors = { message: string }[];

export type Props = {
  refreshUserProfile: () => void;
  userObject: { company: string };
  csrfToken: string;
};

export default function Login(props: Props) {
  // const [username, setUsername] = useState('');
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
        css={form}
        onSubmit={async (event) => {
          event.preventDefault();
          const loginResponse = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              company: company,
              password: password,
              csrfToken: props.csrfToken,
            }),
          });
          // get response from API, then check for errors
          const loginResponseBody =
            (await loginResponse.json()) as LoginResponseBody;
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
          <input
            className="input-line full-width"
            value={company}
            placeholder="Company Name"
            onChange={(event) => setCompany(event.currentTarget.value)}
          />
        </label>

        <label css={label}>
          <input
            className="input-line full-width"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </label>
        <div css={label}>
          {errors.map((error) => {
            return <div key={`error-${error.message}`}>{error.message};</div>;
          })}
        </div>
        <button css={login}>Log In</button>
      </form>
      <img src="/login.svg" alt="login" css={image} />
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
    props: {
      csrfToken: createCsrfToken(),
    },
  };
}
