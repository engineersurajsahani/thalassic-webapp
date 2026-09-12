export type Course = {
  id: number;
  title: string;
  category: string;
  instructor: string;
  enrolled: number;
  duration: string;
  price: string;
  rating: number;
  status: string;
  updated: string;
  code?: string;
  description?: string;
};

export const INITIAL_COURSES: Course[] = [];

export type Institute = {
  id: string;
  name: string;
  location: string;
  rating?: number;
  contact?: string;
};

export const MOCK_INSTITUTES: Institute[] = [];

// Mapping of course titles to available institute IDs
export const COURSE_INSTITUTES_MAP: Record<string, string[]> = {};

// Institute specific pricing and available seats for each course
export const COURSE_INSTITUTE_PRICING: Record<
  string,
  Record<string, { price: string; seats: number; nextBatch: string }>
> = {};
