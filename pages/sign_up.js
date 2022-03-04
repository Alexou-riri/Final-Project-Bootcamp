// import Link from 'next/link'
import { css } from '@emotion/react';
import Layout from '../components/Layout';

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
  return (
    <Layout>
      <div>
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

              <label css={label} htmlFor="password">
                Companie:
                <input type="password" name="password" id="password" />
              </label>
              <label css={label} htmlFor="password">
                Address :
                <input type="password" name="password" id="password" />
              </label>

              <input
                type="button"
                value="Sign Up"
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
