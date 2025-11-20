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
import { Eye, Download } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "@/components/ui/toaster";
import { LeaveData } from "@/types/leave";


import { useState } from "react";


function FileDisplay({ label, fileName }: { label: string; fileName?: string }) {
  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>

      <div className="flex items-center justify-between p-3 pl-4 border rounded-lg bg-gray-50 mt-1">
        <span className="text-sm font-medium text-gray-800 truncate">
          {fileName || "No File"}
        </span>

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


export default function LeaveModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: LeaveData | null;
}) {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);
  const [comments, setComments] = useState("");

  if (!data) return null;

  const handleApprove = () => {
    toast.success("Leave of Absence Approved");
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
            <ModalTitle>Leave of Absence Details</ModalTitle>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto p-6 space-y-10">
            {/* GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* LEFT COLUMN */}
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

                    <div>
                      <Label>Reason</Label>
                      <p className="p-2">{data.reason}</p>
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

                  <div className="grid grid-cols-1 gap-4 pt-2">

                    <div>
                      <Label>Date Submitted</Label>
                      <p className="p-2">{data.dateSubmitted}</p>
                    </div>

                    <FileDisplay
                      label="Application Form"
                      fileName={data.applicationForm}
                    />

                    <FileDisplay
                      label="University Approval of LOA"
                      fileName={data.universityApproval}
                    />

                    <FileDisplay
                      label="Certificate of Grades"
                      fileName={data.certificateGrades}
                    />

                    <FileDisplay
                      label="Medical Certificate"
                      fileName={data.medicalCertificate}
                    />

                    <FileDisplay
                      label="Supporting Document"
                      fileName={data.supportingDocument}
                    />
                  </div>
                </section>

                {/* COMMENTS */}
                <section className="w-full">
                  <Label className="text-sm font-semibold text-gray-700">
                    Comments
                  </Label>
                  <textarea
                    className="w-full mt-2 p-3 border rounded-lg text-sm"
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
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

      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Leave of Absence"
        description="Are you sure you want to approve this LOA request?"
        confirmText="Yes, approve"
        variant="info"
      />

      <ConfirmDialog
        isOpen={isResubmitOpen}
        onClose={() => setIsResubmitOpen(false)}
        onConfirm={handleResubmit}
        title="Request Resubmission"
        description="Are you sure you want to request resubmission for this LOA?"
        confirmText="Yes, request"
        variant="danger"
      />
    </>
  );
}
