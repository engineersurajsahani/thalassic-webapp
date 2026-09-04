export interface Institute {
  id: string;
  name: string;
  code?: string;
  idtNumber: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  schedule: string;
  batchDates?: string[];
  facilities?: string;
}

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
  trainingType?: string;
  deliveryMode?: string;
  institutes?: Institute[];
  availableInstitutesCount?: number;
}

export interface CourseEnrollment {
  id: string;
  status: 'active' | 'ongoing' | 'on_hold' | 'completed';
  purchaseDate: string;
  course: Course;
  courseId: string;
  progress: number;
  trainingType?: string;
  institute?: Institute;
  batchSchedule?: string;
  enrollmentDetails?: {
    batchId: string;
    reportingAddress: string;
    coordinatorContact: string;
    coordinatorEmail: string;
    facilities?: string;
    onHoldNotice?: string | null;
  };
}

