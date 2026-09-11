export type PostType = "achievement" | "activity" | "announcement";

export type Post = {
  id: string;
  type: PostType;
  child: string | null;
  time: string;
  audience: string;
  body: string;
  photoCaption?: string;
  likes: number;
  comments: number;
};

export const currentUser = {
  name: "Caro Giménez",
  role: "Maestra",
  room: "Soles",
  initial: "C",
};

export const room = {
  name: "Soles",
  childrenCount: 12,
  dateLabel: "martes 17 jun",
};

export const posts: Post[] = [
  {
    id: "1",
    type: "achievement",
    child: "Mateo",
    time: "14:20",
    audience: "familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
  },
  {
    id: "2",
    type: "activity",
    child: "Mateo",
    time: "09:40",
    audience: "familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    photoCaption: "pintando con témperas",
    likes: 5,
    comments: 2,
  },
  {
    id: "3",
    type: "announcement",
    child: null,
    time: "07:50",
    audience: "toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
  },
];
