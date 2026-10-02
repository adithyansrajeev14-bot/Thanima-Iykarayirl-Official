export type PaymentMode = 'Cash' | 'GPay / UPI' | 'Bank Transfer' | 'Cheque' | 'Card';

export type PaymentStatus = 'PAID' | 'PARTIAL' | 'PENDING';

export interface PaymentInstallment {
  id: string;
  date: string;
  amount: number;
  paymentMode: PaymentMode;
  referenceNo?: string;
  notes?: string;
  receivedBy?: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  createdAt: string;
  date: string;
  studentName: string;
  phone: string;
  email?: string;
  address?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;

  courseId: string;
  courseName: string;
  vehicleType: string;
  batchTiming?: string;
  learningLicenseNumber?: string;
  applicationNo?: string;
  rtoOffice?: string;
  instructorName?: string;

  courseFee: number;
  rtoGovtFee: number;
  discount: number;
  totalAmount: number;
  amountPaid: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  installments: PaymentInstallment[];

  notes?: string;
  status: 'Active' | 'Completed' | 'Cancelled';
}

export interface CustomWebsiteImages {
  heroImage?: string;
  groundTrackImage?: string;
  twoWheelerImage?: string;
  successImage?: string;
}

export interface SchoolSettings {
  name: string;
  tagline: string;
  address: string;
  city: string;
  pincode: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappPhone: string;
  email: string;
  upiId: string;
  upiName: string;
  rtoOffice: string;
  terms: string[];
  googleMapsUrl?: string;
  customImages?: CustomWebsiteImages;
}

export interface CoursePackage {
  id: string;
  name: string;
  category: 'LMV' | 'MCWG' | 'COMBO' | 'REFRESHER' | 'SPECIAL';
  vehicleType: string;
  description: string;
  defaultFee: number;
  defaultRtoFee: number;
  durationDays: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'fleet' | 'ground' | 'twowheeler' | 'success';
  image: string;
  description: string;
  tag: string;
  createdAt?: string;
}

export interface GoogleReview {
  id: string;
  authorName: string;
  authorPhoto?: string;
  rating: number;
  relativeTime: string;
  date: string;
  text: string;
  verified: boolean;
  likes: number;
  highlight?: string;
  batch?: string;
}
