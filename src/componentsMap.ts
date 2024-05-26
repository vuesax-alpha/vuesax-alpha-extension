export interface ComponentDescriptor {
  path: string;
  attrs?: string[];
  characterDelta?: number;
  closeSelf?: boolean;
}

export const componentsMap: Record<string, ComponentDescriptor> = {
  button: {
    path: "",
    attrs: ['type="primary"'],
  },
  "button-group": {
    path: "",
  },
  alert: {
    path: "/alert",
  },
  input: {
    path: "/input",
    attrs: ['v-model=""'],
    closeSelf: true,
    characterDelta: -3,
  },
  checkbox: {
    path: "/checkbox",
    attrs: ['v-model=""'],
    characterDelta: -2,
  },
  "checkbox-group": {
    path: "/checkbox",
    attrs: ['v-model=""'],
    characterDelta: -2,
  },
  switch: {
    path: "/switch",
    attrs: ['v-model=""'],
    closeSelf: true,
    characterDelta: -3,
  },
  select: {
    path: "/select",
    attrs: ['v-model=""'],
    characterDelta: -2,
  },
  avatar: {
    path: "/avatar",
  },
  "avatar-group": {
    path: "/avatar",
    attrs: ['max=""'],
    characterDelta: -2,
  },
  radio: {
    path: "/radio",
    attrs: ['v-model=""', 'value=""'],
    characterDelta: -11,
  },
  tooltip: {
    path: "/tooltip",
  },
  dialog: {
    path: "/dialog",
    attrs: ['v-model=""'],
    characterDelta: -2,
  },
  pagination: {
    path: "/pagination",
    attrs: [
      ':current-page=""',
      ":layout=\"['total', 'prev', 'pager', 'next', 'jumper', 'sizes']\"",
      ":total='50'",
    ],
    closeSelf: true,
    characterDelta: -79,
  },
  table: {
    path: "/table",
  },
  navbar: {
    path: "/navbar",
    attrs: ['v-model=""'],
    characterDelta: -2,
  },
  sidebar: {
    path: "/sidebar",
    attrs: ['v-model=""'],
    characterDelta: -2,
  },
  card: {
    path: "/card",
  },
  "time-select": {
    path: "/time-select",
    attrs: ['v-model=""'],
    characterDelta: -2,
  },
  scrollbar: {
    path: "/scrollbar",
  },
  rate: {
    path: "/rate",
    attrs: ['v-model=""'],
    closeSelf: true,
    characterDelta: -3,
  },
  badge: {
    path: "/badge",
    attrs: ['type="primary"'],
  },
};
