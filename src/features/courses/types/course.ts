export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  duration: string;
  level: string;
  icon: string;
  category: 'basic' | 'advanced' | 'refresher' | 'additional';
  image: string;
  fees: string;
  documentsRequired: string[];
  rating?: number;
  ratingCount?: number;
}
