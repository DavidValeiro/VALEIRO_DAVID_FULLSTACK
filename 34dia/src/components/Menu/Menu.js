import Link from "next/link";

export default function Menu() {
  return (
    <nav aria-label="Top">
      <ul className="flex items-center space-x-4 p-4">
        <li className="hover:-translate-y-0.5 hover:font-bold transition-all duration-200"><Link href="/">Home</Link></li>
        <li className="hover:-translate-y-0.5 hover:font-bold transition-all duration-200"><Link href="/About">About</Link></li>
        <li className="hover:-translate-y-0.5 hover:font-bold transition-all duration-200"><Link href="/Contact">Contact</Link></li>
        <li className="hover:-translate-y-0.5 hover:font-bold transition-all duration-200"><Link href="/Posts">Posts</Link></li>
      </ul>
    </nav>
  );
}