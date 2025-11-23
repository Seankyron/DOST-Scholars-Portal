export * from './scholar';

export type { SemesterAvailability } from './curriculum';

export type {
  SubmissionStatus,
  BaseSubmission,
  GradeSubmission,
  StipendTracking,
  PTPPlan,
  Allowance,
  PracticalTrainingReferral,
  PracticalTrainingCompletion,
  ThesisPercentage,
  ThesisAllowance,
  TravelPurpose,
  TravelClearance,
  ShiftingType,
  ShiftingTransferring,
  Reimbursement,
  LOAReason,
  LeaveOfAbsence,
  RequestForm,
  SupportFeedback,
  StipendPeriodStatus, // <-- ADDED
  StipendSemesterAvailability, // <-- ADDED
} from './services';

export type {
  DashboardStats,
  PendingAccount,
  EventBanner,
} from './admin';