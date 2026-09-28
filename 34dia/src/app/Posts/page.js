import Post from "@components/Post/Post";
import { posts } from "../../data/posts";
import GoBack from "@components/GoBack/GoBack";

export default function PostsPage() {
  return (
    <>
      <h1>Posts</h1>
      <Post post={posts} href={(p) => `/Posts/${p.id}`} />
      <GoBack />
    </>
  );
}