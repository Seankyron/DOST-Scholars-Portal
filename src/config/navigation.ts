import { 
  LayoutDashboard, 
  Users, 
  CheckCircle, 
  Calendar,
  FileText,
  CreditCard,
  Briefcase,
  GraduationCap,
  Plane,
  RefreshCw,
  DollarSign,
  FileX,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export const scholarNavigation = [
  { label: 'Home', value: 'home' },
  { label: 'Directories', value: 'directories' },
  { label: 'Downloadables', value: 'downloadables' },
  { label: 'FAQs', value: 'faqs' },
];

export const adminNavigation = [
  { 
    label: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    label: 'Scholars', 
    href: '/admin/scholars', 
    icon: Users 
  },
  { 
    label: 'Verification', 
    href: '/admin/verification', 
    icon: CheckCircle 
  },
  { 
    label: 'Events', 
    href: '/admin/events', 
    icon: Calendar 
  },
  {
    label: 'Services',
    icon: FileText,
    children: [
      { label: 'Grade Submissions', href: '/admin/grade-submissions' },
      { label: 'Stipend Tracking', href: '/admin/stipend-tracking' },
      { label: 'Practical Training', href: '/admin/practical-training' },
      { label: 'Thesis Allowance', href: '/admin/thesis-allowance' },
      { label: 'Travel Clearance', href: '/admin/travel-clearance' },
      { label: 'Shifting/Transferring', href: '/admin/shifting-transferring' },
      { label: 'Reimbursement', href: '/admin/reimbursement' },
      { label: 'Leave of Absence', href: '/admin/leave-of-absence' },
      { label: 'Request Forms', href: '/admin/request-forms' },
      { label: 'Support & Feedback', href: '/admin/support-feedback' },
    ],
  },
];