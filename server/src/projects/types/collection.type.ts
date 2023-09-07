export type Collection = {
  name: string;
  icon: string | null;
  fields: Fields[];
  widgets?: Widgets[];
};

export type Fields = {
  name: string;
  type: string;
};

export type Widgets = any;
