import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from './ErrorPage';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(false);

    fetch(`https://dummyjson.com/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) return <ErrorPage />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-8">
      {loading ? (
        <h1 className="text-2xl font-semibold text-gray-600">Cargando el post...</h1>
      ) : (
        <article className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
          <p className="text-lg text-gray-600">{post.body}</p>
        </article>
      )}
    </div>
  );
};

export default Post;