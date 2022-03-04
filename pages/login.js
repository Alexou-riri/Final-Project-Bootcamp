// import Link from 'next/link'
import { css } from '@emotion/react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

const label = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;

// const form = css`
//   border: 1px solid black;
// `;

export default function Login() {
  return (
    <Layout>
      <div className={styles.main}>
        <div>
          <div>
            <form id="form_id" method="post" name="myform">
              <label css={label} name="user_name" htmlFor="username">
                User Name :
                <input name="username" id="username" />
              </label>

              <label css={label} htmlFor="password">
                Password :
                <input type="password" name="password" id="password" />
              </label>

              <input
                type="button"
                value="Login"
                id="submit"
                // onclick="validate()"
              />
            </form>
          </div>
          <hr />
        </div>
      </div>
    </Layout>
  );
}
