import Post from "@components/Post/Post";
import { posts } from "../../../data/posts";
import { notFound } from "next/navigation";
import GoBack from "@components/GoBack/GoBack";

export default async function PostDetailPage({ params }) {
  const { id } = await params;
  const post = posts.find((p) => p.id === Number(id));

  if (!post) {
    notFound();
  }

  return (
    <>
      <Post post={[post]} />
      <GoBack />
    </>
  );
}