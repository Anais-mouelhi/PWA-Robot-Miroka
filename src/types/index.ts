export type MediaType = 'audio' | 'video' | 'none';

export interface Challenge {
  question: string;
  choices: string[];
  answer: number; // index de la bonne réponse
}

export interface Module {
  id: string;
  number: number;
  name: string;
  description: string;
  mediaType: MediaType;
  mediaUrl?: string;
  images: string[];
  position: { x: number; y: number }; // % dans la salle
  color: string;
  challenge?: Challenge;
}
