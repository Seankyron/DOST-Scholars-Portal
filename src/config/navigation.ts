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
  FileEdit 
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
      { label: 'Grade Submissions', href: '/admin/grade-submissions', icon: FileText },
      { label: 'Stipend Tracking', href: '/admin/stipend-tracking', icon: CreditCard },
      { label: 'Practical Training', href: '/admin/practical-training', icon: Briefcase },
      { label: 'Thesis Allowance', href: '/admin/thesis-allowance', icon: GraduationCap },
      { label: 'Travel Clearance', href: '/admin/travel-clearance', icon: Plane },
      { label: 'Shifting/Transferring', href: '/admin/shifting-transferring', icon: RefreshCw },
      { label: 'Reimbursement', href: '/admin/reimbursement', icon: DollarSign },
      { label: 'Leave of Absence', href: '/admin/leave-of-absence', icon: FileX },
      { label: 'Request Forms', href: '/admin/request-forms', icon: FileEdit },
      { label: 'Support & Feedback', href: '/admin/support-feedback', icon: MessageSquare },
    ],
  },
];