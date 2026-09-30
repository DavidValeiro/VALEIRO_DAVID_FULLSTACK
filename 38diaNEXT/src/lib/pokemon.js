export const POKE_API = 'https://pokeapi.co/api/v2';
export const SPRITE_CDN = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function getSpriteUrl(id, shiny = false) {
  return `${SPRITE_CDN}/${shiny ? 'shiny/' : ''}${id}.png`;
}

export const GENERATIONS = [
  { label: 'I', from: 1, to: 151 },
  { label: 'II', from: 152, to: 251 },
  { label: 'III', from: 252, to: 386 },
  { label: 'IV', from: 387, to: 493 },
  { label: 'V', from: 494, to: 649 },
  { label: 'VI', from: 650, to: 721 },
  { label: 'VII', from: 722, to: 809 },
  { label: 'VIII', from: 810, to: 905 },
  { label: 'IX', from: 906, to: 1025 }
];

export function idFromUrl(url) {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}