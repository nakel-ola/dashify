export type ModifyOperation = (
  | 'RENAME'
  | 'TYPE'
  | 'ADD DEFAULT'
  | 'REMOVE DEFAULT'
  | 'ADD NOT NULL'
  | 'REMOVE NOT NULL'
  | 'ADD FOREIGN KEY'
  | 'REMOVE FOREIGN KEY'
  | 'UPDATE FOREIGN KEY'
)[];
