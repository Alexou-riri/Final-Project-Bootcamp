// import Link from 'next/link'
import { css } from '@emotion/react';

const footer = css`
  background: #049ca9;
  /* #e6f7f8; */
  text-align: center;
  padding-top: 4px;
  padding-bottom: 4px;
  /* position: absolute; */
  left: 0;
  bottom: 0;
  width: 100%;
  /* margin-top: 50px; */

  /* right: 0;
  bottom: 0;
  left: 0; */
`;

export default function Footer() {
  return (
    <footer css={footer}>
      <div>
        <h4>Where Are My Pallets? - Alexandra Rieux</h4>
      </div>
    </footer>
  );
}
