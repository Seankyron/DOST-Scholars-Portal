'use client';

import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Calendar, Clock, FileText } from 'lucide-react';
import { MedicalPersonalForm } from './MedicalPersonalForm';
import { ExchangeStudentForm } from './ExchangeStudentForm';
import { AdminCommentAlert } from '@/components/shared/AdminCommenAlert';
import { StatusBadge } from '@/components/shared/StatusBadge'; 
import { formatDate } from '@/lib/utils/date'; 
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from '@/components/ui/toaster';
import type { LOAReason } from '@/types';
import { useUploadDocument } from '@/hooks/scholars/Post/useUploadDocument';
import { SubmissionData, useSubmitLoa } from '@/hooks/scholars/Post/useSubmitLoa';

// Helper for View Mode
function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="text-sm font-semibold text-gray-800 break-words">
        {value || 'N/A'}
      </div>
    </div>
  );
}

const getAcademicYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -1; i < 3; i++) {
        const start = currentYear + i;
        years.push(`${start}-${start + 1}`);
    }
    return years;
};

const ACADEMIC_YEARS = getAcademicYearOptions();

interface LeaveOfAbsenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: LOAReason;
  existingRequest?: any;
}

export function LeaveOfAbsenceModal({ isOpen, onClose, reason, existingRequest }: LeaveOfAbsenceModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const status = existingRequest?.status;
  const adminComment = existingRequest?.adminComment;
  const isResubmit = status === 'Resubmit';

  const [isEditing, setIsEditing] = useState(!existingRequest || isResubmit || status === 'Pending');

  // --- Data Fields ---
  const [startSemester, setStartSemester] = useState(existingRequest?.semester || '');
  const [academicYear, setAcademicYear] = useState(existingRequest?.academicYear || '');
  const [duration, setDuration] = useState(existingRequest?.duration || '');
  const [reasonText, setReasonText] = useState(existingRequest?.reasonText || existingRequest?.reason || ''); 

  // Form State (Files)
  const [appForm, setAppForm] = useState<File | null>(null);
  const [univApproval, setUnivApproval] = useState<File | null>(null);
  const [grades, setGrades] = useState<File | null>(null);
  const [medCert, setMedCert] = useState<File | null>(null);
  const [otherDocs, setOtherDocs] = useState<File | null>(null);
  const [regForm, setRegForm] = useState<File | null>(null);
  const [proofAdmission, setProofAdmission] = useState<File | null>(null);

  const storedScholar = sessionStorage.getItem('scholar');
  const scholar = storedScholar ? JSON.parse(storedScholar) : null;

  const { uploadDocument } = useUploadDocument();
  const { submitLoa } = useSubmitLoa();

  const isRequired = (keywords: string[]) => {
    if (!existingRequest) return true;
    if (status === 'Pending') return true; 
    if (isResubmit) {
        return keywords.some(k => (adminComment || '').toLowerCase().includes(k));
    }
    return false;
  };

  const handleSubmit = async () => {
    if (!startSemester || !academicYear || !duration || !reasonText.trim()) {
       toast.error('Please fill in all required fields.', {
         description: 'Start Semester, Academic Year, Duration, and Reason are required.'
       });
       return;
    }

    if (!isConfirmed) {
      toast.error('Please confirm that your documents are correct.');
      return;
    }

    // Validation logic...
    if (reason === 'Medical/Personal') {
        if (isRequired(['application', 'form', 'loa']) && !appForm && !existingRequest) {
             toast.error('Please upload the Application Form for LOA.');
             return;
        }
        if (isRequired(['university', 'approval']) && !univApproval && !existingRequest) {
             toast.error('Please upload the University Approval.');
             return;
        }
        if (isRequired(['grades', 'certification']) && !grades && !existingRequest) {
             toast.error('Please upload the Certification of Grades.');
             return;
        }
        if (isResubmit && isRequired(['medical', 'certificate', 'health']) && !medCert) {
             toast.error('Please upload the requested Medical Certificate.');
             return;
        }
    }

    if (reason === 'Exchange Student Program') {
        if (isRequired(['application', 'form', 'loa']) && !appForm && !existingRequest) {
            toast.error('Please upload the Application Form for LOA.');
            return;
        }
        if (isRequired(['grades', 'certification']) && !grades && !existingRequest) {
             toast.error('Please upload the Certification of Grades.');
             return;
        }
        if (isRequired(['registration', 'form 5']) && !regForm && !existingRequest) {
            toast.error('Please upload the Registration Form / Form 5.');
            return;
        }
        if (isRequired(['proof', 'admission', 'acceptance']) && !proofAdmission && !existingRequest) {
            toast.error('Please upload the Proof of Admission.');
            return;
        }
    }
    
    setIsLoading(true);
    const loadingID = toast.loading('Submitting request...');

    try {
      let appFormUrl = null, gradeUrl = null;
      let regFormUrl = null, proofAdmissionUrl = null;
      let univApprovalUrl = null, medCertUrl = null, otherDocsUrl = null;

      ({ url:appFormUrl } = await uploadDocument(appForm!, `DOST/${scholar.spas_id}/loa/${reason}/Application Form`));
      ({ url:gradeUrl } = await uploadDocument(grades!, `DOST/${scholar.spas_id}/loa/${reason}/Grades`));

      if (reason === 'Medical/Personal') {
        ({ url:univApprovalUrl } = await uploadDocument(univApproval!, `DOST/${scholar.spas_id}/loa/${reason}/University Approval`));
        ({ url:medCertUrl } = await uploadDocument(medCert!, `DOST/${scholar.spas_id}/loa/${reason}/Medical Certificate`));

        if (otherDocs) {
          ({ url:otherDocsUrl } = await uploadDocument(otherDocs!, `DOST/${scholar.spas_id}/loa/${reason}/Other Documents`));
        }
      }

      if (reason === 'Exchange Student Program') {  
        ({ url:regFormUrl } = await uploadDocument(regForm!, `DOST/${scholar.spas_id}/loa/${reason}/Registration Form`));
        ({ url:proofAdmissionUrl } = await uploadDocument(proofAdmission!, `DOST/${scholar.spas_id}/loa/${reason}/Proof of Admission`));
      }

      const submissionData: SubmissionData = {
        spas_id: scholar.spas_id,
        LOA_form_file_key: appFormUrl,
        required_document_file_key: {
          'Grades': gradeUrl,
          'Registration Form': regFormUrl,
          'Proof of Admission': proofAdmissionUrl,
          'University Approval': univApprovalUrl,
          'Medical Certificate': medCertUrl,
          'Other Documents': otherDocsUrl,
        },
        updated_at: new Date().toISOString(),
        status: 'Pending',
        semester: startSemester,
        academic_year: academicYear,
        duration: duration,
        reason: reasonText,
        comment: null,
        type: reason
      }

      if (!existingRequest) {
        await submitLoa(submissionData, null);
      }
      else {
        const id = existingRequest.id;
        if (!id) { throw new Error('An error occured. Failed to update request.'); }
        
        submissionData.status = 'Resubmit - Pending';
        await submitLoa(submissionData, id);
      }

      toast.success(isResubmit ? 'Resubmission successful!' : 'Application submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit application.');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingID);
    }
  };

  const showAdminAlert = existingRequest && (status === 'Resubmit' || status === 'Approved');

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="xl">
        <ModalHeader>
          <ModalTitle>
            {existingRequest ? (isEditing ? 'Update Request' : 'View Request') : 'Apply for Leave of Absence'}
          </ModalTitle>
          <p className="text-sm text-gray-500 font-normal mt-1">
            Category: <span className="font-semibold text-dost-title">{reason}</span>
          </p>
        </ModalHeader>

        <ModalBody>
          
          {showAdminAlert && (
            <AdminCommentAlert 
              status={status}
              comment={adminComment || 'No comment provided.'}
            />
          )}

          {isEditing && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
               
               {/* Semester Select */}
               <div className="space-y-2">
                  <Label className="text-gray-700">
                     Start Semester <span className="text-red-500">*</span>
                  </Label>
                  <Select value={startSemester} onValueChange={setStartSemester}>
                     <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select Semester" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="1st Semester">1st Semester</SelectItem>
                        <SelectItem value="2nd Semester">2nd Semester</SelectItem>
                        <SelectItem value="Midyear">Midyear</SelectItem>
                        <SelectItem value="Summer">Summer</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               {/* Academic Year Select */}
               <div className="space-y-2">
                  <Label className="text-gray-700">
                     Academic Year <span className="text-red-500">*</span>
                  </Label>
                  <Select value={academicYear} onValueChange={setAcademicYear}>
                     <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select A.Y." />
                     </SelectTrigger>
                     <SelectContent>
                        {ACADEMIC_YEARS.map((ay) => (
                          <SelectItem key={ay} value={ay}>{ay}</SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
               
               {/* Duration Input */}
               <Input 
                  label="Duration of Leave"
                  placeholder="e.g. 1 Year" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-white"
                  required
               />

               {/* Reason Textarea */}
               <div className="sm:col-span-3 space-y-2">
                  <Label className="text-gray-700 block">
                     Reason for Application <span className="text-red-500">*</span>
                  </Label>
                  <Textarea 
                     placeholder="Please explain the reason for your leave of absence..."
                     className="bg-white resize-none min-h-[80px]"
                     value={reasonText}
                     onChange={(e) => setReasonText(e.target.value)}
                  />
               </div>
            </div>
          )}

          {/* Document Uploads */}
          <div className={!isEditing ? "pointer-events-none opacity-100" : ""}>
             {reason === 'Medical/Personal' ? (
                <MedicalPersonalForm 
                   appForm={appForm} setAppForm={setAppForm}
                   univApproval={univApproval} setUnivApproval={setUnivApproval}
                   grades={grades} setGrades={setGrades}
                   medCert={medCert} setMedCert={setMedCert}
                   otherDocs={otherDocs} setOtherDocs={setOtherDocs}
                   isReadOnly={!isEditing}
                   isResubmit={isResubmit}
                   adminComment={adminComment}
                />
              ) : (
                <ExchangeStudentForm 
                   appForm={appForm} setAppForm={setAppForm}
                   univApproval={univApproval} setUnivApproval={setUnivApproval}
                   grades={grades} setGrades={setGrades}
                   regForm={regForm} setRegForm={setRegForm}
                   proofAdmission={proofAdmission} setProofAdmission={setProofAdmission}
                   isReadOnly={!isEditing}
                   isResubmit={isResubmit}
                   adminComment={adminComment}
                />
              )}
          </div>

          {isEditing && (
            <div className="pt-4 border-t mt-4">
              <Checkbox
                label="I confirm that the uploaded documents are correct, clear, and authentic."
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            </div>
          )}

          {/* View Mode Details */}
          {existingRequest && !isEditing && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Current Status</span>
                    <div><StatusBadge status={status} /></div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Date Submitted</span>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {formatDate(existingRequest.timestamp || existingRequest.dateSubmitted)}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Effectivity</span>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                         {startSemester} | {academicYear}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Duration</span>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                         <Clock className="h-4 w-4 text-gray-500" />
                         {duration}
                    </div>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2 border-t border-gray-200 pt-3 mt-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Reason</span>
                    <div className="flex items-start gap-2 text-sm font-normal text-gray-700 italic bg-white p-2 rounded border border-gray-100">
                         <FileText className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                         {reasonText || existingRequest.reasonText || existingRequest.reason}
                    </div>
                </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          {isEditing ? (
             <>
              <ModalClose asChild>
                <Button variant="outline" disabled={isLoading}>Cancel</Button>
              </ModalClose>
              <Button onClick={handleSubmit} isLoading={isLoading} disabled={isLoading}>
                {isResubmit ? 'Submit Corrections' : 'Submit Application'}
              </Button>
             </>
          ) : (
             <>
               <ModalClose asChild>
                 <Button variant="outline">Close</Button>
               </ModalClose>
               {status === 'Pending' && (
                 <Button onClick={() => setIsEditing(true)}>
                   <Edit className="h-4 w-4 mr-2" />
                   Edit Response
                 </Button>
               )}
             </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}