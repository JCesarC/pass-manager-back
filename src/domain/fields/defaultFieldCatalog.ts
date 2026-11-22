export const DEFAULT_FIELD_TYPES = ['text', 'password', 'url', 'email'] as const;

export type DefaultFieldType = (typeof DEFAULT_FIELD_TYPES)[number];

export const DEFAULT_FIELDS: ReadonlyArray<{ name: string; type: DefaultFieldType }> = [
  { name: 'Username', type: 'text' },
  { name: 'Password', type: 'password' },
  { name: 'Website', type: 'url' },
  { name: 'Email', type: 'email' },
  { name: 'Recovery code', type: 'password' },
  { name: 'Security question', type: 'text' },
];
