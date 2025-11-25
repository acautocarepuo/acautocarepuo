export type ViewState = 'EXTERIOR' | 'ENGINE' | 'AC_SYSTEM';

export type Language = 'en' | 'ms';

export type AppMode = '3D' | 'ISSUES' | 'CHAT';

export interface PartData {
  id: string;
  name: string;
  description: string;
  color: string;
  type: 'general' | 'ac';
  commonProblems: string[];
}

export interface CameraTarget {
  position: [number, number, number];
  target: [number, number, number];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
