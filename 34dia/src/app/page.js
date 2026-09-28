import Launch from "../components/LaunchPage/Launch";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
     <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
      <p className="text-lg mb-8">This is the main landing page of the application.</p>
      <Link href="/Posts/1" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors duration-200 mt-4">Post 1</Link>
    </div>
     <Launch />
    </>
  );
}