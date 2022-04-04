// import Link from 'next/link'
import { css } from '@emotion/react';
import Layout from '../components/Layout';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';

import { getValidSessionByToken } from '../util/database';
import { GetServerSidePropsContext } from 'next';
import { RegisterResponseBody } from './api/register';
import { createCsrfToken } from '../util/auth';

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
  margin: auto;
  padding-bottom: 10px;
`;

const register = css`
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
const form = css`
  border: 1px solid black;
  box-shadow: 0px 1px 12px rgba(0, 0, 0, 0.25);
  margin-bottom: 10rem;
  margin-left: 40%;
  margin-right: 40%;
  padding: 2rem;
  border-radius: 10px;
  background-color: #00b8c232;
  select {
    border: none;
  }

  input {
    border: none;
    outline: none;
  }
  ::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.65);
  }
  ::-webkit-input-placeholder .input-line:focus + ::input-placeholder {
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
`;

const select = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  padding-bottom: 10px;
`;

const option = css`
  color: red;
`;

const image = css`
  display: flex;
  margin: auto;
  justify-content: center;
  align-items: center;
`;
// const form = css`
//   border: 1px solid black;
// `;

type Errors = { message: string }[];

type Props = {
  refreshUserProfile: () => void;
  userObject: { company: string };
  csrfToken: string;
};

export default function Register(props: Props) {
  // const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = Router;

  const [userPermission, setUserPermission] = useState(1);

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Register</title>
        <meta name="description" content="Register on this website" />
      </Head>

      <form
        css={form}
        onSubmit={async (event) => {
          event.preventDefault();
          const registerResponse = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              company: company,
              password: password,
              csrfToken: props.csrfToken,
              userPermission: userPermission,
            }),
          });
          const registerResponseBody =
            (await registerResponse.json()) as RegisterResponseBody;
          if ('errors' in registerResponseBody) {
            setErrors(registerResponseBody.errors);
            return;
          }
          props.refreshUserProfile();

          await router.push('/login');
        }}
      >
        <label css={label}>
          <input
            className="input-line full-width"
            placeholder="Company Name"
            value={company}
            onChange={(event) => setCompany(event.currentTarget.value)}
          />
        </label>

        <label css={label}>
          <input
            className="input-line full-width"
            placeholder="Password"
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

        <label htmlFor="userPermission" css={label}>
          <select
            className="input-line full-width"
            placeholder="Please choose"
            css={select}
            id="userPermission"
            value={userPermission}
            onChange={(event) => {
              setUserPermission(parseInt(event.currentTarget.value));
            }}
          >
            <option css={option} value="1">
              I am a client
            </option>
            <option value="2">I am a sub company</option>
          </select>
        </label>

        <button css={register}>Sign Up</button>
      </form>
      <img src="/register.svg" alt="register" css={image} />
    </Layout>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // 1. check if there is a token and is valid from the cookie
  const token = context.req.cookies.sessionToken;

  if (token) {
    // 2. check if the token its valid and redirect
    const session = await getValidSessionByToken(token);

    if (session) {
      console.log(session);
      return {
        redirect: {
          // À Changer
          destination: `/users/login`,
          permanent: false,
        },
      };
    }
  }

  // 3. otherwise render the page

  return {
    props: {
      csrfToken: createCsrfToken(),
    },
  };
}
