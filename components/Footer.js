// import Link from 'next/link'
import { css } from '@emotion/react';

const footer = css`
  background: rgba(49, 27, 1, 0.31);
  text-align: center;
  padding-top: 4px;
  /* position: absolute; */
  left: 0;
  bottom: 0;
  width: 100%;

  /* right: 0;
  bottom: 0;
  left: 0; */

  .contact {
    display: flex;
    flex-direction: column;
    /* justify-content: flex-end; */
    gap: 4px;
    /* padding-right: 50px; */
    padding-bottom: 10px;
  }
  /* .tel {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
  } */
`;

export default function Footer() {
  return (
    <footer css={footer}>
      <div>
        <div>
          <h4>House of castles</h4>
          <h5>All right not reserved</h5>
        </div>
        <hr />
        <div className="contact">
          <div>
            <p>contact :</p>
            <p> 1 rue de la fleur 10000 Cheverny</p>
          </div>
          <p>06 641234567</p>
        </div>
      </div>
    </footer>
  );
}
