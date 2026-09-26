const detalleGaleria = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDDrkjVxul6pKXisqXvFc0syYGPP5JiPVAL5KrfWATiicre4pG-1kzHvVp2Md9pEf1pOOgGuy31g4WkNEZQ4LoPEPP1DXFIorp8cgFqnQ_7GU4VIGbtYaDnC6qFGknZMk-sILQuyUkzFYhuPF_AEQ3DuGehyrxhnW118JuaT7_C4EaCnJOcVro1FiKO_XUU5mCvOaX5hmvdwrcLix679AS82ejBgknIJll4A7aNazAbMiFC_7pHjnGtoUeh1dI5ToWeipC05UdGyXY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYWDGHLpVrvpbA-M3cnFgchE7VpXO10S1IOjq7HNdWNy8k5bGR-n7cBHUhhX6U9Ia70cjhf5PHAYOJHK1tDPN0crb52JkRN-Q9g3A4mzL8p1Nluk8hpJoXCgSQzzZoD-kgcWyjBLnBlDXXCBhu-kWDA2tt-5qQAKtPSELXK6_4SjjyLH0htM76AB90P9PiYD7gNx4NBTL49JOj-yY1AM4YzIM1D5WBrWSaUDmY0KVr5sQ4O1ZC1gkgkHPiWYPSnkYSDO7Rp5is3PE",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBWGy0Pv_zButF5u6GGveHxDlG-JNoN7or8KDXK1klKvFAY5CnYPybJLAYZDN8AbEm4IWK6cttYhmgwsDa39ETUI9gRYWuoZNEnurWCB0ZB-mOv5C9HCkf8CrtdoDjKN2LpU0qGPgSVy-SgM0NCp2PlxoAHn5cmErtE1gBYT1g4VwUxhmFOpDr9_003SooccyId6KomDdfi6JrvmRLyifBOLI_sA2UGkzEDKNs2SQ60lTyA9IGaZ2PlgPM8b0jVdxHOcZqrFQ66r-I",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCuoWHRaWazb2zVYGlwCAKvI7Pelwl_NVY3A_XzuKjKtvAo02qI_BgGp1Q-m4VFwB0xUssthDZ1ah2FFJQakkwzQuU6E1BpmgpVkrFSxcZasvdqvvUChD78wI9PHGaTnX_u2hZEiBYoYKuSXPvofwUm-_ytXeT0Fer_DXMp5fRpyArqP4idDwMXVF9SZElgs-NMi3p-r53oEBkP5QN6rZni4TeTiLWZzrPU9YAgr5A_WwpipRDCi6CoQAi8iK1NinbE5EbBcId22bc",
];

const editarProductoImagen =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAqVwI7hE5THn9PAetw35dZV2L1IyntddFgI53qjq20ZuhOxPlYSk25sNiE4TuTf8eLP5W6Zm_Tt27y7S85S_W5dPanT_JOoo1xLgXtQV7M5in6tSDhbZ3XQo7AulpFdM56SkRnEHTG8DDQrZVXKaMbJ8LJCQQDAKxH5E_PmIHURwO0X4_tkshMk0tTPnRagK-6gZV7qIE-e2argIPaCJaQzrAUHeGfMl66MtresPe4OfTxPrj8EWCPj8uBXJIwQZQxWVHLd23V-5A";

const eliminarProductoImagen =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAobyoEmtY7kDz_gB7c8A6gc1kk66tqW4IhEptQEQD2aGIy7YC0-ZytTJvXkiGUq34SMYT3thnOxcFHspXUPdZD6gU2RAtMpY9OaPCs6QrGA1ZSoZVUNnFKX_RrcmtioarLTFnmpsOIO_bfV5HZQG4-3nv7uQwaz4g-4gbkWhjn0OLImuePzL0ThQa9DYcvDHVDRrniS9HXvj7Yszpfd7L2AsMPZdnKT-Mp4waANS-YX_4xcx53oMnJU24OwxZs-MvK0zawSvpwcgo";

const anadirProductoImagen =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA424B33LFCn_L-iM6thd8q6ymhCnRGMbcBwnjNqxhnpt-ju7ULeGkCCdAOkV_wraALedq3HFh23FH1gbVg5wVpYVm27xdB7hWzxdVexGJvAGyCZbp7jhwoeoZQu1FfkqWUvQXM0u2PnSoHZN5KvagGKeha8CVoHl3wBMMpRm0xHIXMgLz5t03GBrcoViZ9CSqEXC1ZqaP9FQtvmxTFV_6ZxWGHCbMgqh7Zkg3aviREu_WD6w13PWb6G3N1rUcFZxayxf6DMsK3kOI";

const catalogue = [
  {
    id: 0,
    title: "HEPTIC MK-9 Precision",
    subtitle: "Advanced Mechanical Feedback",
    price: 249.0,
    compareAtPrice: 299.0,
    badge: "NEW",
    category: "Periféricos / Teclados",
    description:
      "Diseñado para la precisión. El HEPTIC MK-9 monta switches con respuesta háptica propia, chasis de aluminio mecanizado y conectividad inalámbrica sin latencia. Pensado para profesionales que exigen perfeccion táctil en un entorno oscuro de alto rendimiento.",
    rating: 4.5,
    reviews: 128,
    specs: [
      { icon: "keyboard_capslock", label: "Switch", value: "Haptic-Linear" },
      { icon: "bolt", label: "Latencia", value: "0.5 ms" },
      { icon: "battery_charging_full", label: "Batería", value: "120 h" },
      { icon: "settings_input_component", label: "Conexión", value: "Triple-Mode" },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqYcqNlmKcOSVJus21Lu5BtQeSxJA7a-CHz2DPQ1aZzZTPixOUzoPShF9v-wHRsOZM6vTCmJhr9pdrx-m-hQjlv7Nsrs7vnkA0Fe2TjlKKzQNIMX4q4Lg6arYUitw_JPw_X82XF6qacme8RgWAT4S5ubl-7MrnJzzmbyn9F8d70Z7lvxEro8Bj84hHjv24T8MSxgtHG5viJ7zdMCPaMCpnt6WsYzcMdSfUqGdNtXjH7ZTFsQVh_TYVtYfmkZQivheqv3ce45C4JOc",
    extraImages: detalleGaleria,
  },
  {
    id: 1,
    title: "Vector M-1 Optical",
    subtitle: "Zero-Latency Motion Tech",
    price: 159.0,
    badge: "NEW",
    category: "Periféricos / Ratones",
    description:
      "Sensor óptico de alta resolución y caja de 58 gramos pensada para sesiones largas. El Vector M-1 elimina el microfiltro y el cable para entregar un seguimiento sin aceleración ni suavizado, con una huella mínima sobre la superficie.",
    rating: 4,
    reviews: 96,
    specs: [
      { icon: "mouse", label: "Sensor", value: "26.000 DPI" },
      { icon: "bolt", label: "Latencia", value: "0.4 ms" },
      { icon: "battery_charging_full", label: "Batería", value: "70 h" },
      { icon: "settings_input_component", label: "Conexión", value: "Wireless" },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhhCqYz98c5GK0BxCPaRnA6FZr5pctDQtW9NFC6VGevlijJoZ55dbOMqi9TAYEFmuPzospBhtzitTJNiQJLw6EkI96SQv2K3dgk4ZrwgMjbeLBnu5QJ_H_m4Hrtigp5W8BS3pBG376BwLk42OhsHIUpKss_RFd0lL3U49JEHjIR-Y7bGoMUTafZ1rwUx5cporVpprKC5-iiVYNAk2hkw4wb8knIFMkk6v9p9s67O6k6sNAV-SQ-YvXLDRof7a7jW6lIKokpe7wcgg",
    extraImages: [editarProductoImagen],
  },
  {
    id: 2,
    title: "Axis Pro Controller",
    subtitle: "CAD & Engineering Specialized",
    price: 319.0,
    category: "Periféricos / Mandos",
    description:
      "Mando de 14 botones con 8 remapeables, dos joysticks con tensión calibrada y gatillos analógicos de recorrido completo. El Axis Pro está validado contra CAD, simulación y edición, con perfil por aplicación y respuesta inmediata.",
    rating: 4.5,
    reviews: 74,
    specs: [
      { icon: "sports_esports", label: "Botones", value: "14 Remapeables" },
      { icon: "tune", label: "Perfiles", value: "4 Guardados" },
      { icon: "bolt", label: "Latencia", value: "1.0 ms" },
      { icon: "settings_input_component", label: "Conexión", value: "USB-C / RF" },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxFtAL9os8ngkcD_VHI7L9z4yaF75B2jUFb8NvkFxedygU9FYWqykCR3_RRVIzuKAXGJcbFaRehtmGc0k1XlzqR9KCI-_ILRPbxKts9CAR_mAIt_lddeSTcjv7Mn9D2faMnKSvkSu_sq8Yic2M0B9A-sy7hi6lJZmX85RTSUQGnDpH1gZRCNUhEdVrsIydyGzdxdrX1KllEnRnt0Qlz9Vbjw5Ij4zRwcAe4bhKY8AgxHR4Lexs9_qHZsqdWPd4L4RcDtua3AcmUeA",
    extraImages: [eliminarProductoImagen],
  },
  {
    id: 3,
    title: "Acoustics H-2 Studio",
    subtitle: "Precision Spatial Audio",
    price: 289.0,
    compareAtPrice: 329.0,
    category: "Periféricos / Audio",
    description:
      "Drivers de 50 mm con diafragma de berilio y cancelación activa de ruido híbrida. El Acoustics H-2 ofrece un sonido espacial de 7.1 virtual con un scene graph por aplicación, ideal para monitorización y mezclas largas.",
    rating: 4,
    reviews: 152,
    specs: [
      { icon: "graphic_eq", label: "Driver", value: "50 mm" },
      { icon: "spatial_audio", label: "Audio", value: "7.1 Virtual" },
      { icon: "battery_charging_full", label: "Autonomía", value: "40 h" },
      { icon: "settings_input_component", label: "Conexión", value: "Tri-Mode" },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-cENeHyJsPrt2_5TQcdY3zlGVmm5Ds4UcACDVoXzCy6bTAUHiP0eD9Pz2rvRByRt5eq76PKC1DGtv5HdStNrF9h0PPuAvy-nSyaYvYnB8BZyXqaZ3mVXXjxOlJiXaHLFj7ETnLRv2KQT1bCZpcR5SrZw-r4tUxEcMs-803lr_dBPHUIjBBjZW2g1PkftHCHAiRGrTE6xkbvW_WM4jPDk5HdNHHgqVpquvi2OLO9mVEJ9e0TJ_aPmyEEiory7D5n83HmSlzg2fNaY",
    extraImages: [anadirProductoImagen],
  },
  {
    id: 4,
    title: "Macro Dial Gen 2",
    subtitle: "Workflow Optimization Tool",
    price: 129.0,
    badge: "NEW",
    category: "Periféricos / Herramientas",
    description:
      "Dial de 32 pasos con pantalla OLED y cinco slots de perfil. El Macro Dial Gen 2 se coloca sobre el escritorio y ejecuta macros, cambios de volumen o switching de escenas sin sacar las manos del teclado.",
    rating: 4.5,
    reviews: 58,
    specs: [
      { icon: "tune", label: "Pasos", value: "32 Detents" },
      { icon: "bolt", label: "Respuesta", value: "0.2 ms" },
      { icon: "memory", label: "Memoria", value: "5 Slots" },
      { icon: "sensors", label: "Sensor", value: "Trackball" },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCY1ZbK4fiQAHtVzlfk1Z4f6Yd_SLqJvglvSJw7QP4X_aC_MTSzT-hDvbWAa9r2OarBE19XSFZ1rvZcEEM6jW8TcV1Hnqf1bpbWuj4BOTorLDUbpuTL9TC6EdYgh4yMkD3Lrl1u_Sx2nut4o7gelvP4mw7HYRiaSsWfm-_p-7nYmmNQlzfO3CzFCKVQStR9UiK8NJ_1XPxYbRHNK9GOnxtQBdv7JQ9Q5hvQs6etIDazgb_QYXMdX7JjA5hT486cbBL5_Db-PN-xGE8",
    extraImages: [editarProductoImagen],
  },
  {
    id: 5,
    title: "Surface Pro 1200",
    subtitle: "Technical Texture Surface",
    price: 65.0,
    category: "Periféricos / Alfombrillas",
    description:
      "Alfombrilla de 1200 x 900 mm con microtextura calibrada y base de goma reciclada. La Surface Pro 1200 mantiene el control en movimientos rápidos y está tratada con una capa IP54 que repele líquidos y polvo.",
    rating: 3.5,
    reviews: 211,
    specs: [
      { icon: "texture", label: "Superficie", value: "Micro-textura" },
      { icon: "aspect_ratio", label: "Tamaño", value: "1200 x 900 mm" },
      { icon: "layers", label: "Grosor", value: "4 mm" },
      { icon: "water_drop", label: "Resistencia", value: "IP54" },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBEgjdg5CNmhvJAJdMpJYOTO2W22ZN9jfWJafp6VJVxn6OzVCqd8V-WPQ2-FNcoMHlTqpUXrUZ7dHrRrSJgIqKq7zW2kVWtjjZ6QF9V4yaHfJc6A5fDGlxFLXoAhvGJhlUzltjG7uVL8ejPJA458fz9IbwX4Ln3wp67vSEUmgnyIZ-2zSMaOIyFcge6ndcXEgvttxsFSUKhBIoA7c66Qel1EFsO3yLMFQYumi9AzGuEHGnJkohYP01QFS8yPd_glov62sbpAy_O3I",
    extraImages: [eliminarProductoImagen],
  },
];

export const products = catalogue.map(({ extraImages, ...product }) => ({
  ...product,
  images: [product.image, ...(extraImages ?? [])],
}));
