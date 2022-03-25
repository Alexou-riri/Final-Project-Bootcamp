// import Link from 'next/link'
import { css } from '@emotion/react';

const footer = css`
  background: #e6f4f1;
  text-align: center;
  padding-top: 4px;
  /* position: absolute; */
  left: 0;
  bottom: 0;
  width: 100%;
  /* margin-top: 50px; */

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
          <h4>PalChange - All right not reserved</h4>
        </div>
        <hr />
        <div className="contact">
          <div>
            <p>contact :</p>
            <p> 1 rue de la fleur 10000 Cheverny</p>
            <p>06 641234567</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
