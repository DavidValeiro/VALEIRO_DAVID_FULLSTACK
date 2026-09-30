import Link from 'next/link';
import { formatDate, initials } from '@/lib/format';
import { getSpriteUrl } from '@/lib/pokemon';

export default function PostCard({ post }) {
  const commentsCount = post.comments?.length ?? 0;
  const author = post.author || {};
  const pokemon = author.pokemon;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border-4 border-slate-950 bg-[#fff8e7] shadow-[6px_6px_0_#172033]">
      {post.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image}
          alt={post.title}
          className="h-48 w-full border-b-4 border-slate-950 bg-slate-100 object-cover"
        />
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-3">
          {pokemon?.id ? (
            <img
              src={getSpriteUrl(pokemon.id, !!pokemon.shiny)}
              alt={pokemon.name}
              title={pokemon.name}
              className="pixel-art size-10 shrink-0 rounded-xl border-2 border-slate-950 bg-white object-contain p-0.5"
            />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-950 bg-[#ffcb05] text-xs font-black text-slate-950">
              {initials(author.name)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-900">{author.name || 'Autor desconocido'}</p>
            <p className="text-xs font-bold text-slate-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        <div className="relative">
          <h2 className="line-clamp-1 text-base font-black uppercase leading-6 text-slate-950">
            <Link href={`/posts/${post._id}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2.5 bg-linear-to-t from-[#fff8e7] to-transparent"
          />
        </div>

        <p className="line-clamp-3 min-h-[4.5rem] text-sm font-bold leading-6 text-slate-600">
          {post.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="rounded-full border-2 border-slate-950 bg-white px-3 py-1 text-xs font-black text-slate-700">
            {commentsCount === 1 ? '1 comentario' : `${commentsCount} comentarios`}
          </span>
          <Link
            href={`/posts/${post._id}`}
            className="rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-3 py-1.5 text-xs font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033] transition hover:-translate-y-0.5 hover:bg-[#ffd740]"
          >
            Ver publicación
          </Link>
        </div>
      </div>
    </article>
  );
}