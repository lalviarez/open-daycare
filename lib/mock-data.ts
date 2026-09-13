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
  dateLabel: "martes 17 jun",
};

export type Room = { name: string };

export const rooms: Room[] = [
  { name: "Soles" },
  { name: "Lunas" },
  { name: "Estrellas" },
];

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

export type AvatarColor = "sky" | "blue" | "pink" | "mint" | "yellow" | "purple";
export type ParentStatus = "active" | "pending";

export type Parent = {
  name: string;
  role: string;
  status: ParentStatus;
  avatarColor: AvatarColor;
};

export type Child = {
  id: string;
  name: string;
  ageLabel: string;
  birthDateLabel: string;
  enrollmentLabel: string;
  roomName: string;
  allergyTags: string[];
  allergyNotes: string;
  avatarColor: AvatarColor;
  parents: Parent[];
};

export const children: Child[] = [
  {
    id: "mateo-fernandez",
    name: "Mateo Fernández",
    ageLabel: "3 años",
    birthDateLabel: "12 mar 2022",
    enrollmentLabel: "feb 2025",
    roomName: "Soles",
    allergyTags: ["MANÍ"],
    allergyNotes:
      "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    avatarColor: "sky",
    parents: [
      {
        name: "Lucía Fernández",
        role: "Mamá",
        status: "active",
        avatarColor: "purple",
      },
      {
        name: "Diego Fernández",
        role: "Papá",
        status: "pending",
        avatarColor: "blue",
      },
    ],
  },
  {
    id: "sofia-mendez",
    name: "Sofía Méndez",
    ageLabel: "2 años",
    birthDateLabel: "15 may 2023",
    enrollmentLabel: "mar 2025",
    roomName: "Soles",
    allergyTags: [],
    allergyNotes: "",
    avatarColor: "pink",
    parents: [
      {
        name: "Ana Méndez",
        role: "Mamá",
        status: "active",
        avatarColor: "yellow",
      },
    ],
  },
  {
    id: "benjamin-ruiz",
    name: "Benjamín Ruiz",
    ageLabel: "3 años",
    birthDateLabel: "8 ene 2022",
    enrollmentLabel: "feb 2025",
    roomName: "Soles",
    allergyTags: [],
    allergyNotes: "",
    avatarColor: "mint",
    parents: [
      {
        name: "Laura Ruiz",
        role: "Mamá",
        status: "active",
        avatarColor: "pink",
      },
      {
        name: "Martín Ruiz",
        role: "Papá",
        status: "pending",
        avatarColor: "sky",
      },
    ],
  },
  {
    id: "valentina-soto",
    name: "Valentina Soto",
    ageLabel: "2 años",
    birthDateLabel: "22 ago 2023",
    enrollmentLabel: "abr 2025",
    roomName: "Soles",
    allergyTags: [],
    allergyNotes: "",
    avatarColor: "yellow",
    parents: [],
  },
  {
    id: "tomas-diaz",
    name: "Tomás Díaz",
    ageLabel: "3 años",
    birthDateLabel: "3 nov 2022",
    enrollmentLabel: "feb 2025",
    roomName: "Soles",
    allergyTags: ["LACTOSA"],
    allergyNotes:
      "Alergia a la lactosa. Evitar leche de vaca y derivados; usa fórmula sin lactosa.",
    avatarColor: "purple",
    parents: [
      {
        name: "Paula Díaz",
        role: "Mamá",
        status: "active",
        avatarColor: "mint",
      },
    ],
  },
  {
    id: "emma-castro",
    name: "Emma Castro",
    ageLabel: "2 años",
    birthDateLabel: "11 jul 2023",
    enrollmentLabel: "mar 2025",
    roomName: "Soles",
    allergyTags: [],
    allergyNotes: "",
    avatarColor: "pink",
    parents: [
      {
        name: "Camila Castro",
        role: "Mamá",
        status: "active",
        avatarColor: "purple",
      },
    ],
  },
  {
    id: "lucas-romero",
    name: "Lucas Romero",
    ageLabel: "3 años",
    birthDateLabel: "29 abr 2022",
    enrollmentLabel: "feb 2025",
    roomName: "Soles",
    allergyTags: [],
    allergyNotes: "",
    avatarColor: "sky",
    parents: [
      {
        name: "Florencia Romero",
        role: "Mamá",
        status: "active",
        avatarColor: "blue",
      },
    ],
  },
  {
    id: "olivia-vega",
    name: "Olivia Vega",
    ageLabel: "2 años",
    birthDateLabel: "6 dic 2023",
    enrollmentLabel: "mar 2025",
    roomName: "Soles",
    allergyTags: [],
    allergyNotes: "",
    avatarColor: "mint",
    parents: [
      {
        name: "Mariana Vega",
        role: "Mamá",
        status: "pending",
        avatarColor: "yellow",
      },
    ],
  },
];

export type UserRole = "staff" | "family";

export type User = {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  roleLabel: string;
};

export const users: User[] = [
  {
    email: "caro@opendaycare.com",
    password: "guarderia2026",
    role: "staff",
    name: "Caro Giménez",
    roleLabel: "Maestra",
  },
  {
    email: "lucia.fernandez@gmail.com",
    password: "familia2026",
    role: "family",
    name: "Lucía Fernández",
    roleLabel: "Mamá de Mateo",
  },
];

export type Invitation = {
  code: string;
  parentName: string;
  parentRole: string;
  email: string;
  childId: string;
};

export const invitations: Invitation[] = [
  {
    code: "7K4P9",
    parentName: "Diego Fernández",
    parentRole: "Papá",
    email: "diego.fernandez@gmail.com",
    childId: "mateo-fernandez",
  },
];
