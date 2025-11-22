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

import { useState } from "react";

interface ReimbursementData {
  id: number;
  scholarName: string;
  type: string;
  university: string;
  reimbursement: string;
  status: string;
  dateSubmitted: string;

  yearSem: string;
  academicYear: string;
  program: string;
  reimbursementType: string;
  reason: string;
  receipt: string;
}

function FileDisplay({ fileName }: { fileName: string }) {
  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">Receipt</Label>

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

export default function ReimbursementModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: ReimbursementData | null;
}) {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);
  const [comments, setComments] = useState("");

  if (!data) return null;

  const handleApprove = () => {
    toast.success("Reimbursement Approved");
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
            <ModalTitle>Reimbursement Details</ModalTitle>
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
                    <Label>Scholarship Type</Label>
                    <p className="p-2">{data.type}</p>
                    </div>

                    <div>
                    <Label>Batch / Year Awarded</Label>
                    <p className="p-2">{data.academicYear}</p>
                    </div>

                    <div>
                    <Label>School / University</Label>
                    <p className="p-2">{data.university}</p>
                    </div>

                    <div>
                    <Label>Program / Course</Label>
                    <p className="p-2">{data.program}</p>
                    </div>
                </div>
                </section>

              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submission Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <Label>Year & Semester</Label>
                      <p className="p-2">{data.yearSem}</p>
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
                      <Label>Reimbursement Type</Label>
                      <p className="p-2">{data.reimbursementType}</p>
                    </div>

                    <div className="col-span-2">
                      <Label>Brief Reason</Label>
                      <p className="p-2">{data.reason}</p>
                    </div>

                    <div className="col-span-2">
                      <FileDisplay fileName={data.receipt} />
                    </div>
                  </div>
                </section>

            <section className="w-full">
              <Label className="text-sm font-semibold text-gray-700">Comments</Label>
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
        title="Approve Reimbursement"
        description="Are you sure you want to approve this reimbursement?"
        confirmText="Yes, approve"
        variant="info"
      />

      <ConfirmDialog
        isOpen={isResubmitOpen}
        onClose={() => setIsResubmitOpen(false)}
        onConfirm={handleResubmit}
        title="Request Resubmission"
        description="Are you sure you want to request resubmission?"
        confirmText="Yes, request"
        variant="danger"
      />
    </>
  );
}
