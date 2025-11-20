"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "@/components/ui/toaster";

import { useState } from "react";

export interface RequestFormData {
  scholarName: string;
  type: string;
  university: string;
  status: string;

  academicYear: string;
  semester: string;

  requestForm: string;
  briefReason: string;
  comments: string;
  dateSubmitted: string;
}

export default function RequestFormModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: RequestFormData | null;
}) {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);
  const [adminComments, setAdminComments] = useState("");

  if (!data) return null;

  const handleApprove = () => {
    toast.success("Request Form Approved");
    setIsApproveOpen(false);
    onClose();
  };

  const handleResubmit = () => {
    toast.warning("Resubmission Requested");
    setIsResubmitOpen(false);
    onClose();
  };

  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="4xl">
          <ModalHeader>
            <ModalTitle>Request Form Details</ModalTitle>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto p-6 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <div className="space-y-8">
                
                {/* SCHOLAR INFO */}
                <section>
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Scholar Information
                  </h2>

                  <div className="space-y-3 pt-2">
                    <div>
                      <Label>Name</Label>
                      <p className="p-2">{data.scholarName}</p>
                    </div>

                    <div>
                      <Label>Scholarship Type</Label>
                      <p className="p-2">{data.type}</p>
                    </div>

                    <div>
                      <Label>University</Label>
                      <p className="p-2">{data.university}</p>
                    </div>

                    <div>
                      <Label>Status</Label>
                      <p className="p-2">{data.status}</p>
                    </div>
                  </div>
                </section>

                {/* YEAR OF AWARD & STUDY PLACEMENT */}
                <section>
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Year of Award & Study Placement
                  </h2>

                  <div className="space-y-3 pt-2">
                    <div>
                      <Label>Academic Year</Label>
                      <p className="p-2">{data.academicYear}</p>
                    </div>

                    <div>
                      <Label>Year & Semester</Label>
                      <p className="p-2">{data.semester}</p>
                    </div>
                  </div>
                </section>

              </div>

              <div className="space-y-8">

                {/* SUBMISSION DETAILS */}
                <section>
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submission Details
                  </h2>

                  <div className="space-y-4 pt-2">

                    <div>
                      <Label>Year & Semester</Label>
                      <p className="p-2">{data.semester}</p>
                    </div>

                    <div>
                      <Label>Academic Year</Label>
                      <p className="p-2">{data.academicYear}</p>
                    </div>

                    <div>
                      <Label>Date Submitted</Label>
                      <p className="p-2">{data.dateSubmitted}</p>
                    </div>

                    <div>
                      <Label>Request Form</Label>
                      <p className="p-2">{data.requestForm}</p>
                    </div>

                    <div>
                      <Label>Brief Reason</Label>
                      <p className="p-2 whitespace-pre-line">
                        {data.briefReason}
                      </p>
                    </div>

                

                  </div>
                </section>

                <section className="w-full">
                  <Label className="text-sm font-semibold text-gray-700">
                    Comments
                  </Label>
                  <textarea
                    className="w-full mt-2 p-3 border rounded-lg text-sm"
                    rows={4}
                    value={adminComments}
                    onChange={(e) => setAdminComments(e.target.value)}
                    placeholder="Enter remarks or instructions..."
                  />
                </section>

              </div>
            </div>
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

      {/* CONFIRM APPROVE */}
      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Request Form"
        description="Are you sure you want to approve this request form?"
        confirmText="Yes, approve"
        variant="info"
      />

      <ConfirmDialog
        isOpen={isResubmitOpen}
        onClose={() => setIsResubmitOpen(false)}
        onConfirm={handleResubmit}
        title="Request Resubmission"
        description="Are you sure you want to request resubmission for this request form?"
        confirmText="Yes, request"
        variant="danger"
      />
    </>
  );
}
