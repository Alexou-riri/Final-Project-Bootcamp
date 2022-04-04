import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import {
  getUserById,
  // getValidSessionByToken,
  User,
  Session,
} from '../../util/database';
import { css } from '@emotion/react';

type Props = {
  user?: User;
};

const welcome = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 40px;
  }

  a {
    font-size: 20px;
  }

  img {
    margin-top: 80px;
  }
`;

const link = css`
  color: #00b8c2;
  text-transform: uppercase;
  text-decoration: none;
  /* letter-spacing: 0.15em; */
  /* text-shadow: 1px 1px 1px black; */
  cursor: pointer;
  display: flex;
  /* margin-top: 100px; */
  padding: 15px 20px;
  transition: 0.4s;
  &:hover {
    transform: scale(1.1);
  }
`;

export default function UserDetail(props: Props) {
  if (!props.user) {
    // TODO: You would probably want to also send
    // a 404 HTTP status code (not found)
    return (
      <Layout>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <h1>User not found</h1>
        Try again
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>
          User #{props.user.id}, Company: {props.user.company}
        </title>
        <meta
          name="description"
          content={`User #${props.user.id} is from the company ${props.user.company}`}
        />
      </Head>
      <div css={welcome}>
        <h1>
          Company {''}
          {props.user.company}
        </h1>

        <div>
          <Link href="/users/dashboard">
            <a css={link}>- To your dashboard -</a>
          </Link>{' '}
        </div>
        <img src="/looking_information.svg" alt="go to the dashboard" />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{ user?: User; session?: Session }>> {
  const userId = context.query.userId;

  // User id is not correct type
  if (!userId || Array.isArray(userId)) {
    return { props: {} };
  }

  const user = await getUserById(parseInt(userId));

  if (!user) {
    context.res.statusCode = 404;
    return {
      // notFound: true, // also works, but generates a generic error page
      props: {},
    };
  }
  // // 1. check if there is a token and is valid from the cookie
  // const token = context.req.cookies.sessionToken;

  // if (token) {
  //   // 2. check if the token is valid and redirect
  //   const session = await getValidSessionByToken(token);

  //   if (session) {
  //     console.log(session);
  //     return {
  //       props: { user: user, session: session },
  //     };
  //   }
  //   return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false,
  //     },
  //   };
  // }
  // // 3. Otherwise, generate CSRF token and render the page

  return {
    props: {
      user: user,
    },
  };
}
