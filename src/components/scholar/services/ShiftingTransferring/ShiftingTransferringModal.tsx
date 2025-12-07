'use client';

import { useState, useEffect } from 'react';
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
import { Edit, Calendar } from 'lucide-react';
import { ShiftingForm } from './ShiftingForm';
import { AdminCommentAlert } from '@/components/shared/AdminCommenAlert';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { toast } from '@/components/ui/toaster';
import type { ShiftingType } from '@/types';
import { useSubmitShifting, SubmissionData } from '@/hooks/scholars/Post/useSubmitShifting';
import { useUploadDocument } from '@/hooks/scholars/Post/useUploadDocument';

interface ShiftingTransferringModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ShiftingType;
  existingRequest?: any;
}

export function ShiftingTransferringModal({ isOpen, onClose, type, existingRequest }: ShiftingTransferringModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const status = existingRequest?.status;
  const adminComment = existingRequest?.adminComment;
  const isResubmit = status === 'Resubmit';
  
  const { submitShifting, error:submitError } = useSubmitShifting();
  const { uploadDocument, error:uploadError } = useUploadDocument();
  const storedScholar = sessionStorage.getItem('scholar');
  const scholar = storedScholar ? JSON.parse(storedScholar) : null;
  const [isEditing, setIsEditing] = useState(!existingRequest || isResubmit || status === 'Pending');

  const [newSchool, setNewSchool] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [effectivity, setEffectivity] = useState('');
  const [reason, setReason] = useState('');
  const [courseDuration, setCourseDuration] = useState('4');
  const [ojtYear, setOjtYear] = useState('');
  const [ojtSemester, setOjtSemester] = useState('');
  
  const [midyearClasses, setMidyearClasses] = useState({'1': false, '2': false, '3': false, '4': false});
  const [thesisYear, setThesisYear] = useState({'1': false, '2': false, '3': false, '4': false});

  // File States
  const [appForm, setAppForm] = useState<File | null>(null);
  const [certAdmission, setCertAdmission] = useState<File | null>(null);
  const [certSubjects, setCertSubjects] = useState<File | null>(null);
  const [certYearLevel, setCertYearLevel] = useState<File | null>(null);
  const [certGrades, setCertGrades] = useState<File | null>(null);
  const [programOfStudy, setProgramOfStudy] = useState<File | null>(null);

  const handleSubmit = async () => {
    if ((type === "Shifting Course" && !newCourse) || 
        (type === "Transferring School" && !newSchool) || 
        (type === "Shifting Course & Transferring School" && !newCourse && !newSchool)) 
    {
      toast.error('Please fill all the necessary fields.');
      return;
    }

    if (!effectivity || !reason || !midyearClasses || !thesisYear || !courseDuration || !ojtSemester || !ojtYear) {
        toast.error('Please fill all the necessary fields.');
        return;
      }
    
    if ((!appForm || !certAdmission || !certGrades || !certSubjects || !certYearLevel || !programOfStudy) && !existingRequest) {
      toast.error ('Please upload all documents.');
      return;
    }

    if (!isConfirmed) {
      toast.error('Please confirm that your uploaded documents are correct.');
      return;
    }

    setIsLoading(true);
    const loadingId = toast.loading('Submitting request...');
    const ojtData = { year: ojtYear, semester: ojtSemester };

    try {
      if (!existingRequest) {
        const { url:appFormUrl } = await uploadDocument(appForm!, `DOST/${scholar?.spas_id}/shifting/app-form`);
        const { url:certAdmissionUrl } = await uploadDocument(certAdmission!, `DOST/${scholar?.spas_id}/shifting/cert-admission`);
        const { url:certSubjectsUrl } = await uploadDocument(certSubjects!, `DOST/${scholar?.spas_id}/shifting/cert-subjects`);
        const { url:certYearLevelUrl } = await uploadDocument(certYearLevel!, `DOST/${scholar?.spas_id}/shifting/cert-year-level`);
        const { url:certGradesUrl } = await uploadDocument(certGrades!, `DOST/${scholar?.spas_id}/shifting/cert-grades`);
        const { url:programOfStudyUrl } = await uploadDocument(programOfStudy!, `DOST/${scholar?.spas_id}/shifting/program-study`);

        const data: SubmissionData = {
          spas_id: scholar?.spas_id,
          new_course: newCourse,
          new_school: newSchool,
          effectivity_of_shifting: effectivity,
          ojt: ojtData,
          reason: reason,
          application_form_file_key: appFormUrl,
          admission_cert_file_key: certAdmissionUrl, 
          accredited_sub_file_key: certSubjectsUrl, 
          new_year_level_file_key: certYearLevelUrl,
          all_grades_file_key: certGradesUrl, 
          approved_pos_file_key: programOfStudyUrl, 
          type: type,
        };

        await submitShifting(data, null);
      }
      else {
        const id = existingRequest.id;
        if(!id) { throw new Error(`Failed to update ${type} request.`); }

      const data: SubmissionData = {
        spas_id: scholar?.spas_id,
        new_course: newCourse,
        new_school: newSchool,
        effectivity_of_shifting: effectivity,
        ojt: ojtData,
        reason: reason,
        application_form_file_key: existingRequest.application_form_file_key,
        admission_cert_file_key: existingRequest.admission_cert_file_key, 
        accredited_sub_file_key: existingRequest.accredited_sub_file_key, 
        new_year_level_file_key: existingRequest.new_year_level_file_key,
        all_grades_file_key: existingRequest.all_grades_file_key, 
        approved_pos_file_key: existingRequest.approved_pos_file_key, 
        type: type,
      };

        await submitShifting(data, id);
      }

      toast.success(isResubmit ? 'Corrections submitted successfully!' : 'Shifting request submitted!');
      onClose();
    }
    catch (error: any) {
      toast.error('An error occurred. Failed to upload data.');
    }
    finally {
      toast.dismiss(loadingId);
      setIsLoading(false);
    }
  };

  const showAdminAlert = existingRequest && (status === 'Resubmit' || status === 'Approved');

  useEffect(() => {
    if (!existingRequest) return;

    setNewSchool(existingRequest.new_school);
    setNewCourse(existingRequest.new_course);
    setEffectivity(existingRequest.effectivity_of_shifting);
    setReason(existingRequest.reason);
    setCourseDuration(existingRequest.course_duration);
    setOjtYear(existingRequest.ojt.year);
    setOjtSemester(existingRequest.ojt.semester);

  }, [existingRequest]);


  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="xl">
        <ModalHeader>
          <ModalTitle>
            {existingRequest ? (isEditing ? 'Update Application' : 'View Application') : 'Application Form'}
          </ModalTitle>
          <p className="text-sm text-gray-500 font-normal mt-1">
             Type: <span className="font-semibold text-dost-title">{type}</span>
          </p>
        </ModalHeader>

        <ModalBody>
          
          {showAdminAlert && (
            <AdminCommentAlert status={status} comment={adminComment} />
          )}

          <ShiftingForm 
            type={type}
            isReadOnly={!isEditing}
            isResubmit={isResubmit}
            adminComment={adminComment}

            newSchool={newSchool}
            setNewSchool={setNewSchool}
            newCourse={newCourse}
            setNewCourse={setNewCourse}
            effectivity={effectivity}
            setEffectivity={setEffectivity}
            reason={reason}
            setReason={setReason}
            courseDuration={courseDuration}
            setCourseDuration={setCourseDuration}
            ojtYear={ojtYear}
            setOjtYear={setOjtYear}
            ojtSemester={ojtSemester}
            setOjtSemester={setOjtSemester}
            midyearClasses={midyearClasses}
            setMidyearClasses={setMidyearClasses}
            thesisYear={thesisYear}
            setThesisYear={setThesisYear}

            appForm={appForm}
            setAppForm={setAppForm}
            certAdmission={certAdmission}
            setCertAdmission={setCertAdmission}
            certSubjects={certSubjects}
            setCertSubjects={setCertSubjects}
            certYearLevel={certYearLevel}
            setCertYearLevel={setCertYearLevel}
            certGrades={certGrades}
            setCertGrades={setCertGrades}
            programOfStudy={programOfStudy}
            setProgramOfStudy={setProgramOfStudy}

            existingRequest={existingRequest}
          />

          {isEditing && (
            <div className="pt-4 border-t mt-4">
              <Checkbox
                label="I confirm that the uploaded documents are correct, clear, and authentic."
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            </div>
          )}

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
                        {formatDate(existingRequest.dateSubmitted)}
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
                   Edit Application
                 </Button>
               )}
             </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}