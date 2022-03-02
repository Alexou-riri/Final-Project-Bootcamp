import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <p>
        <Link href="/home">
          <a>Home</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>

        {/* menu deroulant? */}
        <Link href="/contact">
          <a>Contact</a>
        </Link>
      </p>
    </header>
  );
}
