import Link from 'next/link';
import { css } from '@emotion/react';
import { User } from '../util/database';
// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { getParsedCookie } from '../util/cookies';

// import logoipsum from ' ./public/Images/logoipsum.svg';

const headerStyles = css`
  /* background: #e6eef2; */
  padding: 10px;
  /* padding-right: 30em; */
  /* display: flex;
  justify-content: flex-end; */
  margin-top: 0;
  /* position: sticky;
  position: 0; */

  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 2;
  box-shadow: 0 2px 24px 0 rgb(0 0 0 / 15%);
  background-color: #ffffff;
  animation: 500ms ease-in-out 0s normal none 1 running fadeInDown;
  /* padding-top: 0px;
  padding-bottom: 0px; */

  div {
    margin-right: 34px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .logo {
      margin-inline-end: auto;
    }
  }

  /* > a:first-child {
    /* display: flex; */
  /* justify-content: flex-start; */
  /* text-decoration: none;
    text-transform: none; */
  /* align-items: center; */
  /* border: 1px solid red;}  */
`;

const link = css`
  color: #00b8c2;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.15em;
  /* text-shadow: 1px 1px 1px black; */
  cursor: pointer;
  display: inline-block;
  padding: 15px 20px;
  /* position: relative; */

  /* a + a {
    margin-left: 20px;
    cursor: pointer;
    transition: transform 0.2s ease-out;
  }
  a:after {
    background: none repeat scroll 0 0 transparent;
    bottom: 0;
    content: '';
    display: block;
    height: 2px;
    left: 50%;
    position: absolute;
    background: red;
    transition: width 0.3s ease 0s, left 0.3s ease 0s;
    width: 0;
  }
  a:hover:after {
    width: 100%;
    left: 0;
  } */
`;

const sign = css`
  cursor: pointer;
  border: 0;
  border-radius: 4px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0 10px;
  width: 100px;
  padding: 10px 30px;
  box-shadow: 0 0 10px #00b8c2;
  transition: 0.4s;
  color: white;
  background-color: #00b8c2;

  &:hover {
    color: #00b8c2;
    box-shadow: 0 0 20px #00b8c2;
    background-color: white;
    border: solid 1px #00b8c2;
  }
`;

const login = css`
  cursor: pointer;
  border: 0;
  border-radius: 4px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0 10px;
  width: 100px;
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

const username = css`
  display: flex;
  border: 1px solid red;
  justify-content: flex-start;
`;

// const imageLogo = css`
//   display: flex;
//   margin-left: 20px;
// `;

// const { cart } = useState;
type Props = {
  userObject?: User;
  userCompany?: string;
};

export default function Header(props: Props) {
  // const cookieValue = getParsedCookie('cart') || [];
  // console.log('CookieValue', cookieValue);
  // const totalQuantity = cookieValue.reduce((previousValue, currentValue) => {
  //   return previousValue + currentValue.items;
  // }, 0);
  // console.log('totalQuantity', totalQuantity);
  // const productCart = getProductCart();
  // const [itemQuantity, setItemQuantity] = useState(null);
  // useEffect(() => {
  //   setItemQuantity(productCart.length);
  // }, [productCart]);

  // const [sumCartItems, setSumCartItems] = useState(0);
  // const currentCookies = getParsedCookie('cart');
  // console.log('current cookie', currentCookies);
  // useEffect(() => {
  //   if (currentCookies !== undefined) {
  //   }
  // });

  return (
    <header css={headerStyles}>
      <div>
        <div className="logo">
          <Link href="/">
            <a>
              <img src="/icon-192.png" alt="Logo" height={80} width={80} />
            </a>
          </Link>
        </div>
        <div>
          {props.userObject && (
            <div css={username}>
              <Link href="../users/dashboard">
                <a css={link}>{props.userCompany}</a>
              </Link>
            </div>
          )}
          {props.userObject ? (
            <a css={link} href="/logout">
              Log Out
            </a>
          ) : (
            <>
              <Link href="/login">
                <a css={login}>Login</a>
              </Link>
              <Link href="/register">
                <a css={sign}> Sign Up</a>
              </Link>
            </>
          )}

          <Link href="/about">
            <a css={link}>About</a>

            {/* <select></select> */}
          </Link>
          {/* menu deroulant? */}
          <Link href="/contact">
            {/* {cart.cartItems.length > 0 ? } */}
            {/* <a>Cart - {isNaN(totalQuantity) ? '0' : totalQuantity}</a> */}
            <a css={link}>Contact</a>
          </Link>
        </div>
      </div>
    </header>
  );
}

// export function getServerSideProps(context) {
//   const addedHouseOncookies = context.req.cookies.cart || '[]';
//   const cart = JSON.parse(addedHouseOncookies);

//   return {
//     props: {
//       addedHouse: cart,
//     },
//   };
// }
