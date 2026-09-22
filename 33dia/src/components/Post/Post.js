import Link from "next/link";

function  Post({ post, href }) {
  return (
    <>
      {post.map((p, index) => {
        const card = (
          <div key={index} className="border p-4 mb-4 rounded shadow m-4 shadow-gray-300 w-[75%]">
            <h2 className="text-xl font-bold">{p.title}</h2>
            <p className="text-gray-600">{p.content}</p>
            <p className="text-sm text-gray-500">By {p.author}</p>
          </div>
        );

        return href ? (
          <Link key={index} href={href(p)} className="block">
            {card}
          </Link>
        ) : (
          card
        );
      })}
    </>
  );
}

export default Post;