import { 
  FileText, 
  CreditCard, 
  Briefcase, 
  GraduationCap, 
  FileEdit,
  Plane, 
  RefreshCw, 
  DollarSign, 
  FileX, 
  MessageSquare 
} from 'lucide-react';

export const scholarServices = [
  {
    id: 'grade-submission',
    title: 'Grade Submission',
    description: 'Submit your grades and registration form',
    icon: FileText,
  },
  {
    id: 'stipend-tracking',
    title: 'Stipend Tracking',
    description: 'Track your stipend and allowances',
    icon: CreditCard,
  },
  {
    id: 'practical-training',
    title: 'Practical Training Program',
    description: 'Submit PTP referral and completion documents',
    icon: Briefcase,
  },
  {
    id: 'thesis-allowance',
    title: 'Thesis Allowance',
    description: 'Request thesis allowance (90%, 10%, 100%)',
    icon: GraduationCap,
  },
  {
    id: 'request-forms',
    title: 'Request Forms',
    description: 'Request letters and endorsements',
    icon: FileEdit,
  },
  {
    id: 'travel-clearance',
    title: 'Travel Clearance',
    description: 'Apply for travel clearance abroad',
    icon: Plane,
  },
  {
    id: 'shifting-transferring',
    title: 'Shifting / Transferring',
    description: 'Apply for course shifting or school transfer',
    icon: RefreshCw,
  },
  {
    id: 'reimbursement',
    title: 'Reimbursement',
    description: 'Request reimbursement for expenses',
    icon: DollarSign,
  },
  {
    id: 'leave-of-absence',
    title: 'Leave of Absence',
    description: 'Apply for leave of absence',
    icon: FileX,
  },
  {
    id: 'support-feedback',
    title: 'Support & Feedback',
    description: 'Get help or provide feedback',
    icon: MessageSquare,
  },
];
