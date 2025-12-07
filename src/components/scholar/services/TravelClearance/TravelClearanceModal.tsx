'use client';

import { useState, useMemo } from 'react';
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
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { toast } from '@/components/ui/toaster';
import { AdminCommentAlert } from '@/components/shared/AdminCommenAlert';
import type { TravelPurpose } from '@/types/services';
import { differenceInCalendarDays } from 'date-fns'; 
import { useSubmitTravelClearance, SubmissionData } from '@/hooks/scholars/Post/useSubmitTravelClearance';
import { OfficialBusinessForm } from './OfficialBusinessForm';
import { OtherPurposesForm } from './OtherPurposesForm';
import { useUploadDocument } from '@/hooks/scholars/Post/useUploadDocument';

interface TravelClearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  purpose: TravelPurpose;
  existingRequest?: any;
}

export function TravelClearanceModal({ isOpen, onClose, purpose, existingRequest }: TravelClearanceModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (existingRequest) purpose = existingRequest.type;

  // Derived State
  const status = existingRequest?.status;
  const adminComment = existingRequest?.adminComment;
  const isResubmit = status === 'Resubmit';
  const [isEditing, setIsEditing] = useState(!existingRequest || isResubmit || status === 'Pending');

  // Form Fields State
  const [destination, setDestination] = useState(existingRequest?.destination || '');
  const [departureDate, setDepartureDate] = useState(existingRequest?.departure || '');
  const [returnDate, setReturnDate] = useState(existingRequest?.arrival || '');
  const [delayReason, setDelayReason] = useState(existingRequest?.delayReason || ''); // New State

  // File States
  const [requestLetter, setRequestLetter] = useState<File | null>(null);
  const [requestForm, setRequestForm] = useState<File | null>(null);
  const [guaranteeLetter, setGuaranteeLetter] = useState<File | null>(null);
  const [deedOfUndertaking, setDeedOfUndertaking] = useState<File | null>(null);
  const [coMakerEmploy, setCoMakerEmploy] = useState<File | null>(null);
  const [coMakerId, setCoMakerId] = useState<File | null>(null);

  const { submitTravelClearance, error:submitError } = useSubmitTravelClearance();
  const { uploadDocument } = useUploadDocument();
  const storedScholar = sessionStorage.getItem('scholar');
  const scholar = storedScholar ? JSON.parse(storedScholar) : null;

  // --- Logic to check if submission is late (< 14 days) ---
  const isLateFiling = useMemo(() => {
    if (!departureDate) return false;
    const today = new Date();
    const departure = new Date(departureDate);
    const diffDays = differenceInCalendarDays(departure, today);
    return diffDays < 14;
  }, [departureDate]);

  const handleSubmit = async () => {
    if (!isConfirmed) {
      toast.error('Please confirm that your documents are correct.');
      return;
    }
    
    if (!destination || !departureDate || !returnDate) {
      toast.error('Please fill in all travel details.');
      return;
    }

    // Require delay reason if filing late
    if (isLateFiling && !delayReason.trim()) {
      toast.error('Please provide a reason for the late submission.');
      return;
    }

    if ((purpose === 'Official Business Travel') && !existingRequest) {
      if (!requestLetter || !requestForm || !guaranteeLetter) {
        toast.error('Please upload all required document.');
        return;
      }
    }
    else {
      if ((!requestLetter || !requestForm || !deedOfUndertaking || !coMakerEmploy || !coMakerId) && !existingRequest) {
        toast.error('Please upload all required document.');
        return;
      }
    }

    setIsLoading(true);
    try {
      let requestFormUrl;
      let requestLetterUrl;
      let guaranteeLetterUrl = null;
      let deedOfUndertakingUrl = null;
      let coMakerEmployUrl = null;
      let coMakerIdUrl = null;

      if (!existingRequest) {
        ({ url:requestFormUrl } = await uploadDocument(requestForm!, `DOST/${scholar?.spas_id}/travel-clearance/request-form`));
        ({ url: requestLetterUrl } = await uploadDocument(requestLetter!,`DOST/${scholar?.spas_id}/travel-clearance/request-letter`));

        if (purpose === 'Official Business Travel') {
          ({ url:guaranteeLetterUrl } = await uploadDocument(guaranteeLetter!, `DOST/${scholar?.spas_id}/travel-clearance/guarantee-letter`));

          if(guaranteeLetterUrl === null) {
            throw new Error('Failed to upload Guarantee Letter.');
          }
        }
        else {
          ({ url: deedOfUndertakingUrl } = await uploadDocument(deedOfUndertaking!, `DOST/${scholar?.spas_id}/travel-clearance/deed-of-undertaking`));
          ({ url: coMakerEmployUrl } = await uploadDocument(coMakerEmploy!, `DOST/${scholar?.spas_id}/travel-clearance/co-maker-employ`));
          ({ url: coMakerIdUrl } = await uploadDocument(coMakerId!, `DOST/${scholar?.spas_id}/travel-clearance/deed-of-co-maker-id`));

          if (!deedOfUndertakingUrl || !coMakerEmployUrl || !coMakerIdUrl) {
            throw new Error('Failed to upload document.');
          }
        }

        const data: SubmissionData = {
          spas_id: scholar?.spas_id,
          departure: departureDate,
          arrival: returnDate,
          request_letter_file_key: requestLetterUrl,
          guarantee_letter_file_key: guaranteeLetterUrl, 
          completed_request_form_file_key: requestFormUrl,
          cause_of_submission_delay: delayReason,
          requested_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'Pending',
          deed_of_undertaking_file_key: deedOfUndertakingUrl,
          employment_file_key: coMakerEmployUrl,
          valid_id_file_key: coMakerIdUrl,
          type: purpose,
          destination: destination
        }

        await submitTravelClearance(data, null);
      }
      else {
        const id = existingRequest.id;
        if (!id) { throw new Error(`Failed to update ${purpose} request.`); }

        const data: SubmissionData = {
          spas_id: scholar?.spas_id,
          departure: departureDate,
          arrival: returnDate,
          request_letter_file_key: requestLetterUrl ?? existingRequest.request_letter_file_key,
          guarantee_letter_file_key: guaranteeLetterUrl ?? existingRequest.guarantee_letter_file_key, 
          completed_request_form_file_key: requestFormUrl ?? existingRequest.completed_request_form_file_key,
          cause_of_submission_delay: delayReason ?? existingRequest.cause_of_submission_delay,
          requested_at: existingRequest.requested_at,
          updated_at: new Date().toISOString(),
          status: 'Pending',
          deed_of_undertaking_file_key: deedOfUndertakingUrl ?? existingRequest.deed_of_undertaking_file_key,
          employment_file_key: coMakerEmployUrl ?? existingRequest.employment_file_key,
          valid_id_file_key: coMakerIdUrl ?? existingRequest.valid_id_file_key,
          type: purpose,
          destination: destination
        }

        await submitTravelClearance(data, id);
      }

      if (submitError) throw new Error(`Failed to submit ${purpose} request.`);

      toast.success(isResubmit ? 'Corrections submitted successfully!' : 'Travel clearance request submitted!');
      onClose();
    } catch (error) {
      toast.error('Submission failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const showAdminAlert = existingRequest && (status === 'Resubmit' || status === 'Approved');

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="xl">
        <ModalHeader>
          <ModalTitle>
            {existingRequest ? (isEditing ? 'Update Request' : 'View Request') : 'Request Travel Clearance'}
          </ModalTitle>
          <p className="text-sm text-gray-500 font-normal mt-1">
            Purpose: <span className="font-semibold text-dost-title">{purpose}</span>
          </p>
        </ModalHeader>

        <ModalBody>
          
          {showAdminAlert && (
            <AdminCommentAlert status={status} comment={adminComment || 'No comment provided.'} />
          )}

          {purpose === 'Official Business Travel' ? (
            <OfficialBusinessForm
              destination={destination} setDestination={setDestination}
              departureDate={departureDate} setDepartureDate={setDepartureDate}
              returnDate={returnDate} setReturnDate={setReturnDate}
              
              // New Props for Delay Logic
              isLateFiling={isLateFiling}
              delayReason={delayReason}
              setDelayReason={setDelayReason}

              requestLetter={requestLetter} setRequestLetter={setRequestLetter}
              requestForm={requestForm} setRequestForm={setRequestForm}
              guaranteeLetter={guaranteeLetter} setGuaranteeLetter={setGuaranteeLetter}
              isReadOnly={!isEditing}
              isResubmit={isResubmit}
              adminComment={adminComment}
            />
          ) : (
            <OtherPurposesForm 
              destination={destination} setDestination={setDestination}
              departureDate={departureDate} setDepartureDate={setDepartureDate}
              returnDate={returnDate} setReturnDate={setReturnDate}

              // New Props for Delay Logic
              isLateFiling={isLateFiling}
              delayReason={delayReason}
              setDelayReason={setDelayReason}

              requestLetter={requestLetter} setRequestLetter={setRequestLetter}
              requestForm={requestForm} setRequestForm={setRequestForm}
              deedOfUndertaking={deedOfUndertaking} setDeedOfUndertaking={setDeedOfUndertaking}
              coMakerEmploy={coMakerEmploy} setCoMakerEmploy={setCoMakerEmploy}
              coMakerId={coMakerId} setCoMakerId={setCoMakerId}
              isReadOnly={!isEditing}
              isResubmit={isResubmit}
              adminComment={adminComment}
            />
          )}

          {isEditing && (
            <div className="pt-4 border-t mt-4">
              <Checkbox
                label="I confirm that the information provided is true and correct."
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
                {isResubmit ? 'Submit Corrections' : 'Submit Request'}
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