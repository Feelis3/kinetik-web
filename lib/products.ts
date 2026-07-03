export type Product = {
  id: string;
  name: string;
  category: string;
  division: string;
  price: number;
  salePrice?: number;
  image: string;
  swatches: string[];
  badge?: string;
};

export const products: Product[] = [
  {
    id: "aero-01",
    division: "Carrera",
    name: "AERO-01",
    category: "Carrera / Placa de Carbono",
    price: 240,
    image: "/img/sneakers/sneaker-1.jpg",
    swatches: ["#FFFFFF", "#0A0A0B", "#6E6E73"],
    badge: "Novedad",
  },
  {
    id: "void-runner",
    division: "Trail",
    name: "VOID RUNNER",
    category: "Entreno Diario",
    price: 180,
    salePrice: 144,
    image: "/img/sneakers/sneaker-2.jpg",
    swatches: ["#0A0A0B", "#F5F5F5"],
  },
  {
    id: "pulse-trail",
    division: "Trail",
    name: "PULSE TRAIL",
    category: "Todoterreno",
    price: 210,
    image: "/img/sneakers/sneaker-3.jpg",
    swatches: ["#3A3A3E", "#9E9EA0", "#0A0A0B"],
    badge: "Reciclado",
  },
  {
    id: "strata-low",
    division: "Lifestyle",
    name: "STRATA LOW",
    category: "Lifestyle",
    price: 160,
    image: "/img/sneakers/sneaker-4.jpg",
    swatches: ["#F5F5F5", "#0A0A0B", "#6E6E73"],
  },
  {
    id: "kinetik-fk",
    division: "Carrera",
    name: "KINETIK FK",
    category: "Flyknit / Tempo",
    price: 195,
    image: "/img/sneakers/sneaker-5.jpg",
    swatches: ["#0A0A0B", "#FFFFFF"],
    badge: "Exclusivo Socios",
  },
  {
    id: "ghost-court",
    division: "Pista",
    name: "GHOST COURT",
    category: "Pista / Herencia",
    price: 150,
    salePrice: 99,
    image: "/img/sneakers/sneaker-6.jpg",
    swatches: ["#F5F5F5", "#9E9EA0"],
  },
  {
    id: "torque-mid",
    division: "Carrera",
    name: "TORQUE MID",
    category: "Entrenamiento",
    price: 175,
    image: "/img/sneakers/sneaker-7.jpg",
    swatches: ["#0A0A0B", "#6E6E73", "#F5F5F5"],
  },
  {
    id: "drift-x",
    division: "Lifestyle",
    name: "DRIFT X",
    category: "Descanso / Chancla",
    price: 110,
    image: "/img/sneakers/sneaker-8.jpg",
    swatches: ["#3A3A3E", "#0A0A0B"],
    badge: "Próximamente",
  },
];

export type Collection = {
  id: string;
  title: string;
  meta: string;
  image: string;
  division: string;
};

export const collections: Collection[] = [
  { id: "race", title: "División Carrera", meta: "07 modelos", image: "/img/editorial/img2.webp", division: "Carrera" },
  { id: "trail", title: "Lab de Trail", meta: "05 modelos", image: "/img/editorial/img7.webp", division: "Trail" },
  { id: "court", title: "Herencia de Pista", meta: "09 modelos", image: "/img/editorial/img12.webp", division: "Pista" },
  { id: "studio", title: "Estudio / Descanso", meta: "04 modelos", image: "/img/editorial/img18.webp", division: "Lifestyle" },
];

export const categories: { label: string; image: string }[] = [
  { label: "Running", image: "/img/editorial/img3.webp" },
  { label: "Entrenamiento", image: "/img/editorial/img9.webp" },
  { label: "Lifestyle", image: "/img/editorial/img15.webp" },
  { label: "Trail", image: "/img/editorial/img21.webp" },
  { label: "Pista", image: "/img/editorial/img27.webp" },
  { label: "Descanso", image: "/img/editorial/img30.webp" },
];
