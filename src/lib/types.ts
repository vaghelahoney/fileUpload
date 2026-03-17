// Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: Date;
}

// Submissions
export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'In Review' | 'Paid' | 'Report Sent' | 'Pending';
  date: string;
  payment: string;
  answers?: FormAnswer[];
  submissionDate?: string;
}

export interface FormAnswer {
  question: string;
  answer: string;
}

// Payments
export interface Payment {
  txnId: string;
  submissionId: string;
  name: string;
  email: string;
  amount: string;
  status: 'Success' | 'Pending' | 'Failed';
  date: string;
}

export interface PaymentDetails {
  txnId: string;
  submissionId: string;
  payerName: string;
  payerEmail: string;
  payerPhone: string;
  amount: string;
  status: 'Success' | 'Pending' | 'Failed';
  date: string;
  time: string;
  paymentMethod: string;
  cardLast4: string;
}

// Email Templates
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  lastUpdated: string;
}

export interface EmailNotificationSettings {
  selfEmailEnabled: boolean;
  respondentEmailEnabled: boolean;
}

// Dashboard KPI
export interface KPI {
  title: string;
  value: string;
  icon: string;
  color: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
}
