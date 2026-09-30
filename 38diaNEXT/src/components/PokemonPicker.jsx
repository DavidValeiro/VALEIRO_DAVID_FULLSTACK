'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GENERATIONS, POKE_API, getSpriteUrl, idFromUrl } from '@/lib/pokemon';

const TILE_H = 112;
const GRID_GAP = 12;
const ROW_H = TILE_H + GRID_GAP;
const MAX_TILES = 160;

let pokemonListCache = null;
const CACHE_KEY = 'pec05_poke_list';

async function loadPokemonList() {
  if (pokemonListCache) return pokemonListCache;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      pokemonListCache = JSON.parse(raw);
      return pokemonListCache;
    }
  } catch {
    /* ignore */
  }
  const res = await fetch(`${POKE_API}/pokemon?limit=1025&offset=0`);
  const data = await res.json();
  const list = data.results.map((p) => ({ id: Number(idFromUrl(p.url)), name: p.name }));
  pokemonListCache = list;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
  return list;
}

export default function PokemonPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadPokemonList().catch(() => setOpen(true));
  }, []);

  const toggleShiny = () => {
    if (!value) return;
    onChange({ ...value, shiny: !value.shiny });
  };

  const remove = () => onChange(null);

  return (
    <div className="rounded-2xl border-4 border-slate-950 bg-white p-4 shadow-[4px_4px_0_#172033]">
      <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Pokémon</p>

      <div className="mt-1">
        {value ? (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-slate-950 bg-[#fff8e7] p-3 shadow-[3px_3px_0_#172033]">
            <img
              src={getSpriteUrl(value.id, value.shiny)}
              className="pixel-art h-16 w-16 shrink-0 rounded-lg border-2 border-slate-950 bg-white object-contain p-1"
              alt={value.name}
            />
            <div className="min-w-0 flex-1 basis-40">
              <p className="text-sm font-black capitalize leading-snug text-slate-950">
                {value.name} <span className="text-xs text-slate-500">#{value.id}</span>
              </p>
              <p className="text-xs font-black uppercase text-slate-500">
                {value.shiny ? 'Shiny' : 'Normal'}
              </p>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <button
                type="button"
                onClick={toggleShiny}
                className="cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-3 py-2 text-xs font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#172033] sm:flex-none"
              >
                {value.shiny ? 'Hacer normal' : 'Hacer shiny'}
              </button>
              <button
                type="button"
                onClick={remove}
                className="cursor-pointer rounded-xl border-4 border-slate-950 bg-[#e85d4a] px-3 py-2 text-xs font-black uppercase text-white shadow-[3px_3px_0_#172033] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#172033] sm:flex-none"
              >
                Quitar
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-black text-slate-500">Sin Pokémon elegido.</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 w-full cursor-pointer rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-4 py-2 font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033] transition hover:-translate-y-0.5 hover:bg-[#ffd740] hover:shadow-[5px_5px_0_#172033]"
      >
        Abrir galería de Pokémon
      </button>

      {open &&
        createPortal(
          <Modal
            onClose={() => setOpen(false)}
            onSelect={(pokemon) => {
              onChange(pokemon);
              setOpen(false);
            }}
          />,
          document.body
        )}
    </div>
  );
}

function Modal({ onClose, onSelect }) {
  const [entering, setEntering] = useState(true);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genIndex, setGenIndex] = useState(0);
  const [filter, setFilter] = useState('');
  const [cols, setCols] = useState(8);
  const [range, setRange] = useState({ start: 0, end: 0, topPad: 0, botPad: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    function computeCols() {
      const md = window.matchMedia('(min-width: 768px)');
      const sm = window.matchMedia('(min-width: 640px)');
      return md.matches ? 8 : sm.matches ? 6 : 4;
    }
    const mdMq = window.matchMedia('(min-width: 768px)');
    const smMq = window.matchMedia('(min-width: 640px)');
    const handler = () => setCols(computeCols());
    setCols(computeCols());
    mdMq.addEventListener('change', handler);
    smMq.addEventListener('change', handler);
    return () => {
      mdMq.removeEventListener('change', handler);
      smMq.removeEventListener('change', handler);
    };
  }, []);

  useEffect(() => {
    let active = true;
    loadPokemonList()
      .then((loaded) => {
        if (active) setList(loaded);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) {
      const gen = GENERATIONS[genIndex];
      return list.filter((pokemon) => pokemon.id >= gen.from && pokemon.id <= gen.to);
    }
    return list.filter((pokemon) => pokemon.name.includes(term) || String(pokemon.id) === term);
  }, [list, filter, genIndex]);

  const capped = useMemo(() => visible.slice(0, MAX_TILES), [visible]);
  const totalRows = Math.ceil(capped.length / cols);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
    updateRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genIndex, filter]);

  useEffect(updateRange, [capped, cols, totalRows]);

  function updateRange() {
    const el = containerRef.current;
    if (!el || totalRows === 0) {
      setRange({ start: 0, end: 0, topPad: 0, botPad: 0 });
      return;
    }
    const viewportRows = Math.ceil(el.clientHeight / ROW_H);
    const topRow = Math.max(0, Math.min(totalRows - 1, Math.floor(el.scrollTop / ROW_H) - viewportRows));
    const bottomRow = Math.max(
      topRow + 1,
      Math.min(totalRows, Math.ceil((el.scrollTop + el.clientHeight) / ROW_H) + viewportRows)
    );
    setRange({
      start: topRow * cols,
      end: bottomRow * cols,
      topPad: topRow * ROW_H,
      botPad: Math.max(0, (totalRows - bottomRow) * ROW_H)
    });
  }

  return (
    <div
      onClick={onClose}
      className={`modal-fade fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 ${
        entering ? 'will-change-opacity' : ''
      }`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        onAnimationEnd={() => setEntering(false)}
        className="slide-from-top backface-visibility-hidden will-change-transform contain-paint flex h-[85vh] max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-4xl border-4 border-slate-950 bg-[#fff8e7] shadow-[10px_10px_0_#172033]"
      >
        <div className="flex items-center justify-between border-b-4 border-slate-950 bg-[#ffcb05] px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">PokeDex</p>
            <h2 className="text-2xl font-black uppercase leading-none text-slate-950">Galería de Pokémon</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-slate-950 bg-white text-sm font-black text-slate-950 hover:bg-slate-100"
          >
            X
          </button>
        </div>

        <div className="border-b-4 border-slate-950 bg-white px-5 py-3">
          <input
            type="text"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filtrar por nombre o número…"
            className="w-full rounded-xl border-4 border-slate-950 bg-white px-4 py-2 font-black shadow-[3px_3px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ffcb05]"
          />
        </div>

        <div className="flex flex-wrap gap-2 border-b-4 border-slate-950 bg-white px-5 py-3">
          {GENERATIONS.map((gen, index) => (
            <button
              key={gen.label}
              type="button"
              onClick={() => setGenIndex(index)}
              className={`cursor-pointer rounded-xl border-4 border-slate-950 px-3 py-1 text-sm font-black uppercase shadow-[2px_2px_0_#172033] transition ${
                index === genIndex
                  ? 'bg-[#ffcb05] text-slate-950'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Gen {gen.label}
            </button>
          ))}
        </div>

        <div
          ref={containerRef}
          onScroll={updateRange}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4"
        >
          {loading || entering ? (
            <p className="text-sm font-black text-slate-500">Cargando Pokédex…</p>
          ) : (
            <>
              {range.topPad > 0 && <div style={{ height: range.topPad }} aria-hidden="true" />}
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
                {capped.slice(range.start, range.end).map((pokemon) => (
                  <button
                    key={pokemon.id}
                    type="button"
                    onClick={() => onSelect({ id: pokemon.id, name: pokemon.name, shiny: false })}
                    className="poke-tile flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-slate-950 bg-white p-2 shadow-[2px_2px_0_#172033] transition hover:-translate-y-0.5 hover:bg-[#ffcb05]"
                  >
                    <img
                      src={getSpriteUrl(pokemon.id, false)}
                      loading="lazy"
                      decoding="async"
                      className="pixel-art h-14 w-14 object-contain"
                      alt={pokemon.name}
                    />
                    <span className="text-[10px] font-black text-slate-500">#{pokemon.id}</span>
                    <span className="w-full truncate text-center text-[10px] font-black capitalize text-slate-950">
                      {pokemon.name}
                    </span>
                  </button>
                ))}
              </div>
              {range.botPad > 0 && <div style={{ height: range.botPad }} aria-hidden="true" />}
            </>
          )}
          {!loading && capped.length === 0 && <p className="text-sm font-black text-slate-500">Sin resultados.</p>}
          {!loading && visible.length > MAX_TILES && (
            <p className="mt-3 text-center text-xs font-black uppercase text-slate-400">
              Mostrando los primeros {MAX_TILES} · afina el filtro
            </p>
          )}
        </div>
      </div>
    </div>
  );
}