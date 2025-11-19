"use client";

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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Eye, Download, MessageSquarePlus } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';
import { formatDate } from '@/lib/utils/date';

// ---------- Reusable Info Item ----------
function InfoItem({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
  );
}

// ---------- Reusable File Display Box ----------
function FileDisplay({ label, fileName }: { label: string; fileName: string }) {
  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="flex items-center justify-between p-3 pl-4 border rounded-lg bg-gray-50 mt-1">
        <span className="text-sm font-medium text-gray-800 truncate">{fileName || 'No File'}</span>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0" title="View">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0" title="Download">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ThesisAllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  percentage: string;   // passed without trailing '%'
  data: {
    scholarInfo: {
      name: string;
      contactNumber: string;
      dateOfBirth: string;
      completeAddress: string;
    };
    placementInfo: {
      scholarshipType: string;
      batch: string;
      university: string;
      program: string;
    };
    submissionInfo: {
      yearSemester: string;
      academicYear: string;
      dateSubmitted: string;
    };
    files: {
      registrationForm: string;
      thesisProposal: string;
      approvalSheet: string;
    };
  };
}

export function ThesisAllowanceModal({
  isOpen,
  onClose,
  percentage,
  data,
}: ThesisAllowanceModalProps) {
  const [adminComment, setAdminComment] = useState('');
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);

  const { scholarInfo, placementInfo, submissionInfo, files } = data;

  const PREBUILT_COMMENTS = [
    "Missing/Incorrect Registration Form.",
    "Thesis Proposal Abstract is incomplete.",
    "Approval Sheet unclear or blurry.",
    "Incorrect document uploaded.",
    "Please re-upload complete and clear files.",
  ];

  // ----- Approve Action -----
  const handleApprove = () => {
    toast.success("Thesis Allowance Approved");
    setIsApproveOpen(false);
    onClose();
  };

  // ----- Request Resubmission -----
  const handleResubmit = () => {
    if (!adminComment.trim()) {
      toast.error("Please add a comment before requesting resubmission.");
      return;
    }
    toast.warning("Resubmission Requested");
    setIsResubmitOpen(false);
    onClose();
  };

  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="4xl">
          <ModalHeader>
            <ModalTitle>Thesis Allowance Details ({percentage}%)</ModalTitle>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LEFT: Scholar Info */}
              <div className="space-y-6">
                <section>
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Scholar Information
                  </h2>
                  <div className="space-y-3 pt-2">
                    <InfoItem label="Name" value={scholarInfo.name} />
                    <InfoItem label="Contact Number" value={scholarInfo.contactNumber} />
                    <InfoItem label="Date of Birth" value={scholarInfo.dateOfBirth} />
                    <InfoItem label="Complete Address" value={scholarInfo.completeAddress} />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Year of Award and Study Placement
                  </h2>
                  <div className="space-y-3 pt-2">
                    <InfoItem label="Scholarship Type" value={placementInfo.scholarshipType} />
                    <InfoItem label="Batch / Year Awarded" value={placementInfo.batch} />
                    <InfoItem label="School / University" value={placementInfo.university} />
                    <InfoItem label="Program / Course" value={placementInfo.program} />
                  </div>
                </section>
              </div>

              {/* RIGHT: Submission & Files */}
              <div className="space-y-6">
                <section>
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submission Details
                  </h2>
                  <div className="space-y-3 pt-2">
                    <InfoItem label="Year & Semester" value={submissionInfo.yearSemester} />
                    <InfoItem label="Academic Year" value={submissionInfo.academicYear} />
                    <InfoItem
                      label="Date Submitted"
                      value={formatDate(submissionInfo.dateSubmitted)}
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <FileDisplay
                    label="Registration Form or Form 5:"
                    fileName={files.registrationForm}
                  />
                  <FileDisplay
                    label="Thesis Proposal (Abstract):"
                    fileName={files.thesisProposal}
                  />
                  <FileDisplay
                    label="Approval Sheet:"
                    fileName={files.approvalSheet}
                  />
                </section>
              </div>
            </div>

            {/* COMMENTS */}
            <section className="pt-4 border-t">
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Comments
              </Label>

              <Textarea
                placeholder="Add comments for the scholar..."
                className="min-h-[120px]"
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
              />

              <div className="flex flex-wrap gap-1.5 mt-2">
                {PREBUILT_COMMENTS.map((text, i) => (
                  <Button
                    key={i}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1 px-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => setAdminComment((prev) => prev + (prev ? "\n- " : "- ") + text)}
                  >
                    <MessageSquarePlus className="h-3 w-3 mr-1.5" />
                    {text}
                  </Button>
                ))}
              </div>
            </section>
          </ModalBody>

          <ModalFooter>

            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setIsResubmitOpen(true)}
            >
              REQUEST RESUBMISSION
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setIsApproveOpen(true)}
            >
              APPROVE
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirm dialogs */}
      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Thesis Allowance"
        description="Are you sure you want to approve this Thesis Allowance request?"
        confirmText="Yes, approve"
        variant="info"
      />

      <ConfirmDialog
        isOpen={isResubmitOpen}
        onClose={() => setIsResubmitOpen(false)}
        onConfirm={handleResubmit}
        title="Request Resubmission"
        description="Are you sure you want to request a resubmission? Make sure your comment is clear."
        confirmText="Yes, request resubmission"
        variant="danger"
      />
    </>
  );
}
