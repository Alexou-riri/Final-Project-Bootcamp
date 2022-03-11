import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Layout from '../../components/Layout';
import { getUserById, getValidSessionByToken, User } from '../../util/database';

type Props = {
  user: User;
};

export default function ProtectedDashboard(props: Props) {
  return (
    <Layout>
      <h1> Here is your dashboard {props.user.username} </h1>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // 1. check if there is a token and is valid from the cookie
  const token = context.req.cookies.sessionToken;

  if (token) {
    // 2. check if the token is valid and redirect
    const session = await getValidSessionByToken(token);

    if (session) {
      const user = await getUserById(session.userId);
      console.log(user);
      return {
        props: { user: user },
      };
    }

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}
