export type EventClass =
  | 'ACTION'
  | 'RESOLUTION'
  | 'DM_EVENT'
  | 'SCENE_CHANGE'
  | 'MK_NOTE'
  | 'COMMENT'
  | 'COMMENT_ACTION'
  | 'STATUS_CHANGE'
  | 'MILESTONE'
  | 'SESSION_MARKER';

export interface Character {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  portrait?: string;
  conditions: string[];
  entityType: 'CH' | 'Mu' | 'Mo' | 'Sy' | 'Hy';
}

export interface Event {
  id: string;
  timestamp: string;
  class: EventClass;
  content: string;
  characterId?: string;
}

export interface Asset {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  caption?: string;
}
