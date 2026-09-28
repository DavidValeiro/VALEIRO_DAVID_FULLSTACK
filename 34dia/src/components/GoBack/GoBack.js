'use client'

import { usePathname, useRouter } from "next/navigation";

export default function GoBack() {
  const pathname = usePathname();
  const router = useRouter();

  function goUp() {
    const segments = pathname.split("/").filter(Boolean);
    segments.pop();
    router.push("/" + segments.join("/"));
  }

  return (
    <button
      type="button"
      onClick={goUp}
      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
    >
      Go Back
    </button>
  );
}