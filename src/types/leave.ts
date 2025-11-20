export type LeaveData = {
  id: number;
  scholarName: string;
  type: string;
  university: string;
  reason: string;
  status: string;
  dateSubmitted: string;
  academicYear: string;
  semester: string;

  applicationForm?: string;
  universityApproval?: string;
  certificateGrades?: string;
  medicalCertificate?: string;
  supportingDocument?: string;

  remarks?: string;
};
