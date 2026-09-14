import { useState, useEffect } from 'react'

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [submittedTerm, setSubmittedTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [evolutionSteps, setEvolutionSteps] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [pokemonSpecies, setPokemonSpecies] = useState(null);
    const fetchPokemon = async (term) => {
        setLoading(true);
        setError(null);
        try {
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${term}/`);
            if (!pokemonResponse.ok) {
                throw new Error('Error en la solicitud');
            }
            const pokemon = await pokemonResponse.json();
            const speciesResponse = await fetch(pokemon.species.url);
            if (!speciesResponse.ok) {
                throw new Error('Error en la solicitud');
            }
            const species = await speciesResponse.json();
            const evolutionResponse = await fetch(species.evolution_chain.url);
            if (!evolutionResponse.ok) {
                throw new Error('Error en la solicitud');
            }
            const evolutionData = await evolutionResponse.json();

            const evolutionNames = [];
            const evolutionStepsData = [];
            const collectEvolutions = (chain, evolutionDetails = null) => {
                evolutionNames.push(chain.species.name);
                if (evolutionDetails) {
                    evolutionStepsData.push(evolutionDetails);
                }
                chain.evolves_to.forEach((evolution) =>
                    collectEvolutions(evolution, evolution.evolution_details[0])
                );
            };
            collectEvolutions(evolutionData.chain);

            const evolutionResults = await Promise.all(
                evolutionNames.map(async (name) => {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
                    if (!response.ok) {
                        throw new Error('Error en la solicitud');
                    }
                    return response.json();
                })
            );
            setSearchResults(evolutionResults);
            setEvolutionSteps(evolutionStepsData);
        } catch (error) {
            setError(error.message);
            setEvolutionSteps([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const term = submittedTerm.trim().toLowerCase();

        if (!term) {
            setSearchResults([]);
            setError(null);
            setLoading(false);
            return;
        }

        fetchPokemon(term);
    }, [submittedTerm]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmittedTerm(searchTerm);
    };

    function translateToSpanish(pokemon) {
        const typeTranslations = {
            normal: 'normal',
            fire: 'fuego',
            water: 'agua',
            electric: 'eléctrico',
            grass: 'planta',
            ice: 'hielo',
            fighting: 'lucha',
            poison: 'veneno',
            ground: 'tierra',
            flying: 'volador',
            psychic: 'psíquico',
            bug: 'bicho',
            rock: 'roca',
            ghost: 'fantasma',
            dragon: 'dragón',
            dark: 'siniestro',
            steel: 'acero'
        };

        return typeTranslations[pokemon] || pokemon;
    }

    function typeColor(type) {
        const typeColors = {
            normal: 'bg-[#A8A77A]',
            fire: 'bg-[#EE8130]',
            water: 'bg-[#6390F0]',
            electric: 'bg-[#F7D02C]',
            grass: 'bg-[#7AC74C]',
            ice: 'bg-[#96D9D6]',
            fighting: 'bg-[#C22E28]',
            poison: 'bg-[#A33EA1]',
            ground: 'bg-[#E2BF65]',
            flying: 'bg-[#A98FF3]',
            psychic: 'bg-[#F95587]',
            bug: 'bg-[#A6B91A]',
            rock: 'bg-[#B6A136]',
            ghost: 'bg-[#735797]',
            dragon: 'bg-[#6F35FC]',
            dark: 'bg-[#705746]',
            steel: 'bg-[#B7B7CE]',
            fairy: 'bg-[#D685AD]'
        };
        return typeColors[type] || 'bg-gray-400';
    }

    function evolutionMethod(details) {
        if (!details) return 'Evoluciona';
        if (details.min_level) return `Nivel ${details.min_level}`;
        if (details.item) return `Usando ${details.item.name.replaceAll('-', ' ')}`;
        if (details.trigger?.name === 'trade') return 'Intercambio';
        if (details.min_happiness) return `Amistad ${details.min_happiness}`;
        if (details.time_of_day) return `Durante ${details.time_of_day}`;
        return 'Condición especial';
    }

    function playPokemonCry(pokemon) {
        if (pokemon.cries?.latest) {
            new Audio(pokemon.cries.latest).play().catch(() => {});
        }
    };

    async function openModal(pokemon) {
        playPokemonCry(pokemon);
        setSelectedPokemon(pokemon);
        try {
            const res = await fetch(pokemon.species.url);
            if (res.ok) {
                const data = await res.json();
                setPokemonSpecies(data);
            }
        } catch {
            setPokemonSpecies(null);
        }
    }

    function closeModal() {
        setSelectedPokemon(null);
        setPokemonSpecies(null);
    }

    function statName(name) {
        const names = { hp: 'HP', attack: 'Ataque', defense: 'Defensa', 'special-attack': 'At. Esp.', 'special-defense': 'Df. Esp.', speed: 'Velocidad' };
        return names[name] || name;
    }

    function genderDisplay(rate) {
        if (rate === -1) return 'Sin género';
        const female = (rate / 8) * 100;
        const male = 100 - female;
        return `♂ ${male}% / ♀ ${female}%`;
    }

    function growthRateName(name) {
        const names = { slow: 'Lenta', medium: 'Media', 'medium-fast': 'Media-rápida', fast: 'Rápida', 'slow-then-very-fast': 'Lenta-luego-muy-rápida', 'fast-then-very-slow': 'Rápida-luego-muy-lenta' };
        return names[name] || name;
    }

    function habitatName(name) {
        const names = { cave: 'Cueva', forest: 'Bosque', grassland: 'Pradera', mountain: 'Montaña', 'rough-terrain': 'Terreno abrupto', sea: 'Mar', lake: 'Lago', urban: 'Urbano', unknown: 'Desconocido' };
        return names[name] || name;
    }

    function shapeName(name) {
        const names = { ball: 'Bola', squiggle: 'Serpiente', fish: 'Pez', arms: 'Brazos', blob: 'Blob', upright: 'Bípedo', 'bug-wings': 'Alas de insecto', wings: 'Alas', head: 'Cabeza', humanoid: 'Humanoide', tentacles: 'Tentáculos', quadruped: 'Cuadrúpedo' };
        return names[name] || name;
    }

    function eggGroupName(name) {
        const names = { monster: 'Monster', bug: 'Bicho', dragon: 'Dragón', fairy: 'Hada', ditto: 'Ditto', undiscovered: 'Indescubierto', genderless: 'Sin género', ground: 'Ground', water1: 'Agua 1', water2: 'Agua 2', water3: 'Agua 3', mineral: 'Mineral', plant: 'Planta', amorphous: 'Amorfo', flying: 'Volador', 'human-like': 'Humanoide' };
        return names[name] || name;
    }

    function Generation(pokemonId) {
        if (pokemonId >= 1 && pokemonId <= 151) {
            return '1';
        } else if (pokemonId >= 152 && pokemonId <= 251) {
            return '2';
        } else if (pokemonId >= 252 && pokemonId <= 386) {
            return '3';
        } else if (pokemonId >= 387 && pokemonId <= 500) {
            return '4';
        } else if (pokemonId >= 501 && pokemonId <= 649) {
            return '5';
        } else if (pokemonId >= 650 && pokemonId <= 721) {
            return '6';
        } else if (pokemonId >= 722 && pokemonId <= 807) {
            return '7';
        } else if (pokemonId >= 808 && pokemonId <= 898) {
            return '8';
        }
        return 'Unknown';
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-xl border-4 border-slate-950 bg-[#fff8e7] p-6 shadow-[8px_8px_0_#172033]">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca un Pokémon"
                className="w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ffcb05]"
            />
            <button type="submit" className="w-full cursor-pointer rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-5 py-3 text-lg font-black uppercase text-slate-950 shadow-[4px_4px_0_#172033] transition hover:-translate-y-1 hover:bg-[#ffd740] hover:shadow-[6px_6px_0_#172033]">
                Buscar
            </button>
            {loading && <p>Cargando...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && searchResults.length > 0 && (
                <div className="flex w-full flex-col items-center overflow-x-auto py-2">
                    {searchResults.map((pokemon, index) => (
                <div key={`${pokemon.id}-evolution`} className="flex w-full flex-col items-center">
                    {index > 0 && (
                        <div className="my-5 w-full max-w-sm rounded-3xl border-4 border-slate-950 bg-[#fff8e7] px-5 py-4 text-center shadow-[6px_6px_0_#172033]">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                                Método de evolución
                            </p>

                            <div className="my-2 text-3xl font-black text-slate-950">
                                ↓
                            </div>

                            <p className="rounded-xl border-2 border-slate-950 bg-[#ffcb05] px-4 py-3 text-sm font-black uppercase text-slate-950">
                                {evolutionMethod(evolutionSteps[index - 1])}
                            </p>
                        </div>
                    )}
                <div
                    onClick={() => openModal(pokemon)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openModal(pokemon);
                        }
                    }}
                    className="pokemon-card group w-full max-w-sm cursor-pointer overflow-hidden rounded-4xl border-4 border-slate-950 bg-[#fff8e7] shadow-[8px_8px_0_#172033] transition duration-200 hover:-translate-y-1 hover:shadow-[12px_12px_0_#172033]"
                >
                    <div className="flex items-start justify-between border-b-4 border-slate-950 bg-[#ffcb05] px-5 py-4">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-700">Pokédex</p>
                            <h2 className="text-3xl font-black capitalize leading-none text-slate-950">{pokemon.name}</h2>
                        </div>
                        <span className="rounded-full border-2 border-slate-950 bg-white px-3 py-1 text-sm font-black text-slate-950">#{pokemon.id}</span>
                    </div>
                    <div className="relative flex justify-center gap-4 overflow-hidden bg-[#e85d4a] px-6 py-7">
                        <img className="relative z-10 h-36 w-36 rounded-2xl border-4 border-slate-950 bg-white object-contain p-2 shadow-[4px_4px_0_#172033]" src={pokemon.sprites.front_default} alt={pokemon.name} />
                        {pokemon.sprites.front_shiny && (
                            <img className="relative z-10 h-36 w-36 rounded-2xl border-4 border-slate-950 bg-[#fff8dc] object-contain p-2 shadow-[4px_4px_0_#172033]" src={pokemon.sprites.front_shiny} alt={`${pokemon.name} shiny`} />
                        )}
                    </div>
                    <div className="flex items-center justify-between gap-3 px-5 py-4">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                            {pokemon.types.length === 1 ? 'Tipo' : 'Tipos'} · Gen. {Generation(pokemon.id)}
                        </p>
                        <div className="flex flex-wrap justify-end gap-2">
                            {pokemon.types.map((type) => (
                                <span key={type.type.name} className={`rounded-lg border-2 border-slate-950 ${typeColor(type.type.name)} px-3 py-1 text-xs font-black uppercase text-white shadow-[2px_2px_0_#172033]`}>
                                    {translateToSpanish(type.type.name)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                </div>
                    ))}
                </div>
            )}
            {selectedPokemon && (
                <div
                    onClick={closeModal}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-4xl border-4 border-slate-950 bg-[#fff8e7] shadow-[12px_12px_0_#172033] scrollbar-thin"
                    >
                        <div className="sticky top-0 z-30 flex items-center justify-between border-b-4 border-slate-950 bg-[#ffcb05] px-6 py-5">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-700">Pokédex</p>
                                <h2 className="text-3xl font-black capitalize leading-none text-slate-950">{selectedPokemon.name}</h2>
                                {pokemonSpecies && (
                                    <p className="mt-2 text-sm font-black text-slate-700">
                                        {pokemonSpecies.genera?.find((g) => g.language.name === 'es')?.genus || pokemonSpecies.genera?.find((g) => g.language.name === 'en')?.genus}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="rounded-full border-2 border-slate-950 bg-white px-3 py-1 text-sm font-black text-slate-950">#{selectedPokemon.id}</span>
                                <button
                                    onClick={closeModal}
                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-slate-950 bg-white text-sm font-black text-slate-950 hover:bg-slate-100"
                                >
                                    X
                                </button>
                            </div>
                        </div>

                        <div className="relative z-0 flex justify-center gap-4 overflow-hidden bg-[#e85d4a] px-6 py-7">
                            {selectedPokemon.sprites.other?.['official-artwork']?.front_default ? (
                                <>
                                    <img className="relative z-10 h-40 w-40 rounded-2xl border-4 border-slate-950 bg-white object-contain p-2 shadow-[4px_4px_0_#172033]" src={selectedPokemon.sprites.other['official-artwork'].front_default} alt={selectedPokemon.name} />
                                    {selectedPokemon.sprites.other['official-artwork'].front_shiny && (
                                        <img className="relative z-10 h-40 w-40 rounded-2xl border-4 border-slate-950 bg-[#fff8dc] object-contain p-2 shadow-[4px_4px_0_#172033]" src={selectedPokemon.sprites.other['official-artwork'].front_shiny} alt={`${selectedPokemon.name} shiny`} />
                                    )}
                                </>
                            ) : (
                                <>
                                    <img className="relative z-10 h-40 w-40 rounded-2xl border-4 border-slate-950 bg-white object-contain p-2 shadow-[4px_4px_0_#172033]" src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} />
                                    {selectedPokemon.sprites.front_shiny && (
                                        <img className="relative z-10 h-40 w-40 rounded-2xl border-4 border-slate-950 bg-[#fff8dc] object-contain p-2 shadow-[4px_4px_0_#172033]" src={selectedPokemon.sprites.front_shiny} alt={`${selectedPokemon.name} shiny`} />
                                    )}
                                </>
                            )}
                        </div>

                        {pokemonSpecies && (
                            <div className="border-b-2 border-slate-200 px-6 py-6">
                                <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Descripción</p>
                                <p className="text-sm font-bold leading-relaxed text-slate-800">
                                    {pokemonSpecies.flavor_text_entries?.find((e) => e.language.name === 'es')?.flavor_text?.replace(/\n|\f/g, ' ') || pokemonSpecies.flavor_text_entries?.find((e) => e.language.name === 'en')?.flavor_text?.replace(/\n|\f/g, ' ')}
                                </p>
                            </div>
                        )}

                        <div className="border-b-2 border-slate-200 px-6 py-6">
                            <p className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Tipos</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedPokemon.types.map((type) => (
                                    <span key={type.type.name} className={`rounded-lg border-2 border-slate-950 ${typeColor(type.type.name)} px-3 py-1 text-xs font-black uppercase text-white shadow-[2px_2px_0_#172033]`}>
                                        {translateToSpanish(type.type.name)}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="border-b-2 border-slate-200 px-6 py-6">
                            <p className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Estadísticas</p>
                            <div className="flex flex-col gap-4">
                                {selectedPokemon.stats.map((s) => (
                                    <div key={s.stat.name} className="flex items-center gap-3">
                                        <span className="w-20 text-xs font-black uppercase text-slate-600">{statName(s.stat.name)}</span>
                                        <div className="relative h-5 flex-1 overflow-hidden rounded-lg border-2 border-slate-950 bg-slate-200">
                                            <div className="absolute inset-y-0 left-0 bg-[#ffcb05]" style={{ width: `${(s.base_stat / 255) * 100}%` }} />
                                        </div>
                                        <span className="w-8 text-right text-xs font-black text-slate-950">{s.base_stat}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-xs font-black text-slate-500">Exp Base: {selectedPokemon.base_experience}</p>
                        </div>

                        <div className="border-b-2 border-slate-200 px-6 py-6">
                            <p className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Datos Físicos</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-center shadow-[2px_2px_0_#172033]">
                                    <p className="text-[10px] font-black uppercase text-slate-500">Altura</p>
                                    <p className="text-sm font-black text-slate-950">{(selectedPokemon.height / 10).toFixed(1)} m</p>
                                </div>
                                <div className="rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-center shadow-[2px_2px_0_#172033]">
                                    <p className="text-[10px] font-black uppercase text-slate-500">Peso</p>
                                    <p className="text-sm font-black text-slate-950">{(selectedPokemon.weight / 10).toFixed(1)} kg</p>
                                </div>
                                {pokemonSpecies && (
                                    <>
                                        <div className="rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-center shadow-[2px_2px_0_#172033]">
                                            <p className="text-[10px] font-black uppercase text-slate-500">Forma</p>
                                            <p className="text-sm font-black capitalize text-slate-950">{shapeName(pokemonSpecies.shape?.name)}</p>
                                        </div>
                                        <div className="rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-center shadow-[2px_2px_0_#172033]">
                                            <p className="text-[10px] font-black uppercase text-slate-500">Color</p>
                                            <p className="text-sm font-black capitalize text-slate-950">{pokemonSpecies.color?.name}</p>
                                        </div>
                                        {pokemonSpecies.habitat && (
                                            <div className="col-span-2 rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-center shadow-[2px_2px_0_#172033]">
                                                <p className="text-[10px] font-black uppercase text-slate-500">Hábitat</p>
                                                <p className="text-sm font-black capitalize text-slate-950">{habitatName(pokemonSpecies.habitat.name)}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="border-b-2 border-slate-200 px-6 py-6">
                            <p className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Habilidades</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedPokemon.abilities.map((a) => (
                                    <span key={a.ability.name} className={`rounded-lg border-2 border-slate-950 px-3 py-1 text-xs font-black shadow-[2px_2px_0_#172033] ${a.is_hidden ? 'border-dashed bg-slate-200 text-slate-600' : 'bg-white text-slate-950'}`}>
                                        {a.ability.name.replaceAll('-', ' ')}
                                        {a.is_hidden && ' (oculta)'}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {pokemonSpecies && (
                            <div className="border-b-2 border-slate-200 px-6 py-6">
                                <p className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Reproducción</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-center shadow-[2px_2px_0_#172033]">
                                        <p className="text-[10px] font-black uppercase text-slate-500">Género</p>
                                        <p className="text-xs font-black text-slate-950">{genderDisplay(pokemonSpecies.gender_rate)}</p>
                                    </div>
                                    <div className="rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-center shadow-[2px_2px_0_#172033]">
                                        <p className="text-[10px] font-black uppercase text-slate-500">Felicidad</p>
                                        <p className="text-sm font-black text-slate-950">{pokemonSpecies.base_happiness}</p>
                                    </div>
                                    <div className="col-span-2 rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-center shadow-[2px_2px_0_#172033]">
                                        <p className="text-[10px] font-black uppercase text-slate-500">Grupo Huevo</p>
                                        <p className="text-sm font-black capitalize text-slate-950">{pokemonSpecies.egg_groups?.map((e) => eggGroupName(e.name)).join(', ')}</p>
                                    </div>
                                    {pokemonSpecies.hatch_counter && (
                                        <div className="col-span-2 rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-center shadow-[2px_2px_0_#172033]">
                                            <p className="text-[10px] font-black uppercase text-slate-500">Pasos para eclosionar</p>
                                            <p className="text-sm font-black text-slate-950">{(pokemonSpecies.hatch_counter * 257).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {pokemonSpecies && (
                            <div className="border-b-2 border-slate-200 px-6 py-6">
                                <p className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Captura y Crecimiento</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-center shadow-[2px_2px_0_#172033]">
                                        <p className="text-[10px] font-black uppercase text-slate-500">Tasa Captura</p>
                                        <p className="text-sm font-black text-slate-950">{pokemonSpecies.capture_rate}</p>
                                    </div>
                                    <div className="rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-center shadow-[2px_2px_0_#172033]">
                                        <p className="text-[10px] font-black uppercase text-slate-500">Crecimiento</p>
                                        <p className="text-sm font-black text-slate-950">{growthRateName(pokemonSpecies.growth_rate?.name)}</p>
                                    </div>
                                    {pokemonSpecies.evolves_from_species && (
                                        <div className="col-span-2 rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-center shadow-[2px_2px_0_#172033]">
                                            <p className="text-[10px] font-black uppercase text-slate-500">Evoluciona de</p>
                                            <p className="text-sm font-black capitalize text-slate-950">{pokemonSpecies.evolves_from_species.name}</p>
                                        </div>
                                    )}
                                    <div className="col-span-2 flex justify-center gap-2">
                                        {pokemonSpecies.is_legendary && <span className="rounded-lg border-2 border-slate-950 bg-[#ffd700] px-3 py-1 text-xs font-black uppercase text-slate-950 shadow-[2px_2px_0_#172033]">Legendario</span>}
                                        {pokemonSpecies.is_mythical && <span className="rounded-lg border-2 border-slate-950 bg-purple-400 px-3 py-1 text-xs font-black uppercase text-white shadow-[2px_2px_0_#172033]">Mítico</span>}
                                        {pokemonSpecies.is_baby && <span className="rounded-lg border-2 border-slate-950 bg-pink-300 px-3 py-1 text-xs font-black uppercase text-slate-950 shadow-[2px_2px_0_#172033]">Bebé</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedPokemon.held_items?.length > 0 && (
                            <div className="border-b-2 border-slate-200 px-6 py-6">
                                <p className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Objetos Sostenidos</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPokemon.held_items.map((hi) => (
                                        <span key={hi.item.name} className="rounded-lg border-2 border-slate-950 bg-white px-3 py-1 text-xs font-black shadow-[2px_2px_0_#172033]">
                                            {hi.item.name.replaceAll('-', ' ')}
                                            <span className="ml-1 text-slate-500">({hi.version_details[0]?.rarity}%)</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedPokemon.moves?.length > 0 && (
                            <div className="border-b-2 border-slate-200 px-6 py-6">
                                <p className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Movimientos ({selectedPokemon.moves.length})</p>
                                <div className="max-h-40 overflow-y-auto rounded-xl border-2 border-slate-950 bg-white p-3 shadow-[2px_2px_0_#172033] scrollbar-thin">
                                    <div className="flex flex-wrap gap-1">
                                        {selectedPokemon.moves.map((m) => (
                                            <span key={m.move.name} className="rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                                                {m.move.name.replaceAll('-', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="px-6 py-6">
                            <button
                                onClick={() => playPokemonCry(selectedPokemon)}
                                className="w-full cursor-pointer rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-5 py-3 text-lg font-black uppercase text-slate-950 shadow-[4px_4px_0_#172033] transition hover:-translate-y-1 hover:bg-[#ffd740] hover:shadow-[6px_6px_0_#172033]"
                            >
                                ▶ Reproducir grito
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );

}


export default Search;