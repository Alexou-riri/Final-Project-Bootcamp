// import Link from 'next/link'
import { css } from '@emotion/react';
import Layout from '../components/Layout';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';
import { loadDefaultErrorComponents } from 'next/dist/server/load-components';
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
  margin-bottom: 26rem;
  margin-left: 40%;
  margin-right: 40%;
  padding: 2rem;
  border-radius: 10px;
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

  // const formSubmit = async (event: any) => {
  //   event.preventDefault();
  //   if (role === 'client') {
  //     const createUserResponse = await fetch('/api/register', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         password: password,
  //         company: company,
  //         // role: client,
  //       }),
  //     });

  //     const createUserResponseBody = await createUserResponse.json();
  //     if ('errors' in createUserResponseBody) {
  //       setErrors(createUserResponseBody.errors);
  //       return;
  //     }
  //     props.refreshUserProfile();
  //     await router.push('/login');
  //   } else {
  //     event.preventDefault();
  //     const createUserResponse = await fetch('/api/register', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         password: password,
  //         company: company,
  //         // role: sub,
  //       }),
  //     });
  //     const createUserResponseBody = await createUserResponse.json();
  //     if ('errors' in createUserResponseBody) {
  //       setErrors(createUserResponseBody.errors);
  //       return;
  //     }
  //     props.refreshUserProfile();
  //     await router.push('/login');
  //   }
  // };

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
          Company Name :
          <input
            value={company}
            onChange={(event) => setCompany(event.currentTarget.value)}
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

        <label htmlFor="userPermission" css={label}>
          Please choose:
          <select
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

        {/* <label css={label}>
          Company:
          <input
            value={company}
            onChange={(event) => setCompany(event.currentTarget.value)}
          />
        </label> */}
        <button css={register}>Sign Up</button>
      </form>
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
