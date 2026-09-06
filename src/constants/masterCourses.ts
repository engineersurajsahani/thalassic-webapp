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

export const INITIAL_COURSES: Course[] = [
  { id: 1, title: "STCW Basic Safety Training",    category: "Safety",      instructor: "Capt. R. Sharma", enrolled: 412, duration: "5 days", price: "₹5,000", rating: 4.8, status: "Active",   updated: "3 days ago",  code: "BST-001",  description: "Mandatory safety training covering Personal Survival Techniques, Firefighting, First Aid, and PSSR under STCW 2010 guidelines." },
  { id: 2, title: "Advanced Fire Fighting",         category: "Safety",      instructor: "Capt. M. Nair",   enrolled: 289, duration: "3 days", price: "₹7,200", rating: 4.6, status: "Active",   updated: "1 week ago",  code: "AFF-002",  description: "Advanced training in organizing, tactics, command, and control of onboard firefighting operations." },
  { id: 3, title: "Ship Navigation & Radar",        category: "Technical",   instructor: "Capt. V. Singh",  enrolled: 194, duration: "7 days", price: "₹6,800", rating: 4.7, status: "Active",   updated: "2 days ago",  code: "SNR-003",  description: "Comprehensive bridge watchkeeping, radar plotting, ARPA operations, and electronic navigation systems." },
  { id: 4, title: "Maritime Law & Compliance",      category: "Compliance",  instructor: "Mr. A. Patel",    enrolled: 137, duration: "2 days", price: "₹3,200", rating: 4.5, status: "Active",   updated: "5 days ago",  code: "MLC-004",  description: "International maritime conventions including SOLAS, MARPOL, MLC 2006, and Port State Control compliance." },
  { id: 5, title: "Tanker Cargo Operations",        category: "Operations",  instructor: "Capt. D. Kumar",  enrolled: 98,  duration: "4 days", price: "₹9,400", rating: 4.9, status: "Active",    updated: "Today",       code: "TCO-005",  description: "Advanced safety procedures, cargo handling, inert gas systems, and pollution prevention on oil/chemical tankers." },
  { id: 6, title: "Engine Room Operations",         category: "Technical",   instructor: "Eng. S. Verma",   enrolled: 203, duration: "6 days", price: "₹8,100", rating: 4.4, status: "Active",   updated: "1 week ago",  code: "ERO-006",  description: "Marine propulsion systems, auxiliary machinery maintenance, power generation, and emergency preparedness." },
  { id: 7, title: "Medical First Aid at Sea",       category: "Safety",      instructor: "Dr. P. Rao",      enrolled: 321, duration: "3 days", price: "₹4,500", rating: 4.7, status: "Active",   updated: "4 days ago",  code: "MFA-007",  description: "Immediate first aid application, trauma care, telemedicine coordination, and medical kit administration at sea." },
  { id: 8, title: "Crowd & Crisis Management",      category: "Compliance",  instructor: "Mr. K. Joshi",    enrolled: 76,  duration: "2 days", price: "₹3,800", rating: 4.3, status: "Active",   updated: "2 weeks ago", code: "CCM-008",  description: "Passenger vessel safety, crowd psychology, emergency muster procedures, and life-saving appliance deployment." },
];

export type Institute = {
  id: string;
  name: string;
  location: string;
  rating?: number;
  contact?: string;
};

export const MOCK_INSTITUTES: Institute[] = [
  { id: "inst_1", name: "Hari Om Thalassic Maritime Training Institute", location: "Mumbai, Maharashtra", rating: 4.9, contact: "+91 22 12345678" },
  { id: "inst_2", name: "Global Seafarers Academy", location: "Kochi, Kerala", rating: 4.8, contact: "+91 484 2345678" },
  { id: "inst_3", name: "Oceanic Maritime Center", location: "Chennai, Tamil Nadu", rating: 4.7, contact: "+91 44 34567890" },
  { id: "inst_4", name: "Apex Marine Training", location: "Kolkata, West Bengal", rating: 4.8, contact: "+91 33 45678901" },
];

// Mapping of course titles to available institute IDs
export const COURSE_INSTITUTES_MAP: Record<string, string[]> = {
  "STCW Basic Safety Training": ["inst_1", "inst_2", "inst_3"],
  "Advanced Fire Fighting": ["inst_1", "inst_4"],
  "Ship Navigation & Radar": ["inst_2", "inst_3"],
  "Maritime Law & Compliance": ["inst_1", "inst_2", "inst_3", "inst_4"],
  "Tanker Cargo Operations": ["inst_1", "inst_3"],
  "Engine Room Operations": ["inst_2", "inst_4"],
  "Medical First Aid at Sea": ["inst_1", "inst_2"],
  "Crowd & Crisis Management": ["inst_3", "inst_4"],
};

// Institute specific pricing and available seats for each course
export const COURSE_INSTITUTE_PRICING: Record<string, Record<string, { price: string; seats: number; nextBatch: string }>> = {
  "STCW Basic Safety Training": {
    "inst_1": { price: "₹5,000", seats: 24, nextBatch: "15 Sep 2026" },
    "inst_2": { price: "₹5,500", seats: 18, nextBatch: "20 Sep 2026" },
    "inst_3": { price: "₹4,800", seats: 30, nextBatch: "18 Sep 2026" },
  },
  "Advanced Fire Fighting": {
    "inst_1": { price: "₹7,200", seats: 15, nextBatch: "12 Sep 2026" },
    "inst_4": { price: "₹7,800", seats: 20, nextBatch: "22 Sep 2026" },
  },
  "Ship Navigation & Radar": {
    "inst_2": { price: "₹6,800", seats: 12, nextBatch: "25 Sep 2026" },
    "inst_3": { price: "₹6,500", seats: 16, nextBatch: "16 Sep 2026" },
  },
  "Maritime Law & Compliance": {
    "inst_1": { price: "₹3,200", seats: 25, nextBatch: "14 Sep 2026" },
    "inst_2": { price: "₹3,400", seats: 20, nextBatch: "19 Sep 2026" },
    "inst_3": { price: "₹3,000", seats: 35, nextBatch: "21 Sep 2026" },
    "inst_4": { price: "₹3,500", seats: 15, nextBatch: "28 Sep 2026" },
  },
  "Tanker Cargo Operations": {
    "inst_1": { price: "₹9,400", seats: 14, nextBatch: "10 Sep 2026" },
    "inst_3": { price: "₹9,100", seats: 18, nextBatch: "24 Sep 2026" },
  },
  "Engine Room Operations": {
    "inst_2": { price: "₹8,100", seats: 18, nextBatch: "17 Sep 2026" },
    "inst_4": { price: "₹8,500", seats: 22, nextBatch: "23 Sep 2026" },
  },
  "Medical First Aid at Sea": {
    "inst_1": { price: "₹4,500", seats: 28, nextBatch: "11 Sep 2026" },
    "inst_2": { price: "₹4,800", seats: 20, nextBatch: "15 Sep 2026" },
  },
  "Crowd & Crisis Management": {
    "inst_3": { price: "₹3,800", seats: 40, nextBatch: "20 Sep 2026" },
    "inst_4": { price: "₹4,100", seats: 25, nextBatch: "27 Sep 2026" },
  },
};
