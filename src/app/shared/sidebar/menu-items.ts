import { RouteInfo } from "./sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: "",
    title: "Personal",
    icon: "",
    class: "nav-small-cap",
    label: "",
    labelClass: "",
    extralink: true,
    submenu: [],
    permission:"super_admin"
  },
  {
    path: "/tablero",
    title: "Tablero",
    icon: "mdi mdi-gauge",
    class: "",
    label: "",
    labelClass: "",
    extralink: false,
    submenu: [],
    permission:""
  },
  {
    path: "/usuario",
    title: "Usuarios",
    icon: "fas fa-users",
    class: "",
    label: "",
    labelClass: "",
    extralink: false,
    submenu: [],
    permission:"administrador"
  },
  {
    path: "/contrato",
    title: "Contratos",
    icon: "fas fa-file-invoice",
    class: "",
    label: "",
    labelClass: "",
    extralink: false,
    submenu: [],
    permission:""
  },
  {
    path: "/lectura",
    title: "Lecturas",
    icon: "fas fa-pen",
    class: "",
    label: "",
    labelClass: "",
    extralink: false,
    submenu: [],
    permission:""
  },
  {
    path: "/parametros",
    title: "Parametros",
    icon: "fas fa-cogs",
    class: "",
    label: "",
    labelClass: "",
    extralink: false,
    submenu: [],
    permission:""
  },
  {
    path: "/reportes",
    title: "Reportes",
    icon: "fas fa-chart-line",
    class: "",
    label: "",
    labelClass: "",
    extralink: false,
    submenu: [],
    permission:"administrador"
  },
  // {
  //   path: "",
  //   title: "UI Components",
  //   icon: "",
  //   class: "nav-small-cap",
  //   label: "",
  //   labelClass: "",
  //   extralink: true,
  //   submenu: [],
  // },
  // {
  //   path: "/component/accordion",
  //   title: "Accordion",
  //   icon: "mdi mdi-equal",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "/component/alert",
  //   title: "Alert",
  //   icon: "mdi mdi-message-bulleted",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "/component/carousel",
  //   title: "Carousel",
  //   icon: "mdi mdi-view-carousel",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "/component/dropdown",
  //   title: "Dropdown",
  //   icon: "mdi mdi-arrange-bring-to-front",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "/component/modal",
  //   title: "Modal",
  //   icon: "mdi mdi-tablet",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "/component/pagination",
  //   title: "Pagination",
  //   icon: "mdi mdi-backburger",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "/component/poptool",
  //   title: "Popover & Tooltip",
  //   icon: "mdi mdi-image-filter-vintage",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "/component/progressbar",
  //   title: "Progressbar",
  //   icon: "mdi mdi-poll",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "/component/rating",
  //   title: "Ratings",
  //   icon: "mdi mdi-bandcamp",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "/component/tabs",
  //   title: "Tabs",
  //   icon: "mdi mdi-sort-variant",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "/component/timepicker",
  //   title: "Timepicker",
  //   icon: "mdi mdi-calendar-clock",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "/component/buttons",
  //   title: "Button",
  //   icon: "mdi mdi-toggle-switch",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "/component/cards",
  //   title: "Card",
  //   icon: "mdi mdi-blur-radial",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "/component/toast",
  //   title: "Toast",
  //   icon: "mdi mdi-message-reply-text",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
].map((x) => {
  x.path = "/app" + x.path;
  return x;
});
