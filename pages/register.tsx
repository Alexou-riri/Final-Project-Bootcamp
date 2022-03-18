// import Link from 'next/link'
import { css } from '@emotion/react';
import Layout from '../components/Layout';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';
import { loadDefaultErrorComponents } from 'next/dist/server/load-components';
import { Props } from './login';
import { getValidSessionByToken } from '../util/database';
import { GetServerSidePropsContext } from 'next';

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
        onSubmit={async (event) => {
          event.preventDefault();
          const createUserResponse = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              company: company,
              password: password,
              userPermission: userPermission,
            }),
          });
          const createUserResponseBody = await createUserResponse.json();
          if ('errors' in createUserResponseBody) {
            setErrors(createUserResponseBody.errors);
            return;
          }
          // props.refreshUserProfile();
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

        <label htmlFor="userPermission">
          Please choose:
          <select
            id="userPermission"
            value={userPermission}
            onChange={(event) => {
              setUserPermission(parseInt(event.currentTarget.value));
            }}
          >
            <option value="1">I am a client</option>
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
        <button>Sign Up</button>
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
          destination: `/users/dashboard`,
          permanent: false,
        },
      };
    }
  }

  // 3. otherwise render the page

  return {
    props: {},
  };
}
