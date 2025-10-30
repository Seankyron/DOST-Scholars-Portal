// Export all types from scholar first (base types)
export * from './scholar';

// Export specific types from other modules to avoid conflicts
export type { SemesterAvailability } from './curriculum';

export type {
  SubmissionStatus,
  BaseSubmission,
  GradeSubmission,
  StipendTracking,
  PTPPlan,
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
} from './services';

export type {
  DashboardStats,
  PendingAccount,
  EventBanner,
} from './admin';