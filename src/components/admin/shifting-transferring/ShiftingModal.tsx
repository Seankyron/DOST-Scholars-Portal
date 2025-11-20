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

function FileDisplay({ label, fileName }: { label: string; fileName: string }) {
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

interface ShiftingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    files: {
      applicationForm: string;
      certAdmission: string;
      certAccreditedSubjects: string;
      certYearLevel: string;
      certGrades: string;
      programStudy: string;
    };
  };
}

export function ShiftingModal({ isOpen, onClose, data }: ShiftingModalProps) {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);
  const [comments, setComments] = useState("");

  const {
    files = {
      applicationForm: "",
      certAdmission: "",
      certAccreditedSubjects: "",
      certYearLevel: "",
      certGrades: "",
      programStudy: "",
    },
  } = data || {};

  const handleApprove = () => {
    toast.success("Application Approved");
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
            <ModalTitle>Documents Submitted</ModalTitle>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto p-6 space-y-10">

            {/* =============== 2-COLUMN WRAPPER LIKE THESIS MODAL =============== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              {/* LEFT SECTION ====================================== */}
              <div className="space-y-8">

                {/* SCHOLAR INFO */}
                <section>
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Scholar Information
                  </h2>

                  <div className="space-y-3 pt-2">
                    <div>
                      <Label>Name</Label>
                      <p className="p-2">
                        Juan Dela Cruz</p>
                    </div>

                    <div>
                      <Label>Contact Number</Label>
                      <p className="p-2">
                        09123456789</p>
                    </div>

                    <div>
                      <Label>Date of Birth</Label>
                      <p className="p-2">
                        1999-05-12</p>
                    </div>

                    <div>
                      <Label>Complete Address</Label>
                      <p className="p-2">
                        Brgy. Example, City, Province
                      </p>
                    </div>
                  </div>
                </section>

                {/* YEAR OF AWARD / PLACEMENT */}
                <section>
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Year of Award and Study Placement
                  </h2>

                  <div className="space-y-3 pt-2">
                    <div>
                      <Label>Scholarship Type</Label>
                      <p className="p-2">
                        JLSS</p>
                    </div>

                    <div>
                      <Label>Batch / Year Awarded</Label>
                      <p className="p-2">
                        2022</p>
                    </div>

                    <div>
                      <Label>School / University</Label>
                      <p className="p-2">
                        Polytechnic University
                      </p>
                    </div>

                    <div>
                      <Label>Program / Course</Label>
                      <p className="p-2">
                        BS Information Technology
                      </p>
                    </div>
                  </div>
                </section>

              </div>

              {/* RIGHT SECTION ====================================== */}
              <div className="space-y-8">

                {/* SUBMISSION DETAILS */}
                <section>
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submission Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">

                    <div>
                      <Label>Year & Semester</Label>
                      <p className="p-2">2025 - 1st Sem</p>
                    </div>

                    <div>
                      <Label>Academic Year</Label>
                      <p className="p-2">2025-2026</p>
                    </div>

                    <div>
                      <Label>Date Submitted</Label>
                      <p className="p-2">Nov 18, 2025</p>
                    </div>

                    <div>
                      <Label>Reason</Label>
                      <p className="p-2">Shifting</p>
                    </div>

                    <div>
                      <Label>New School</Label>
                      <p className="p-2">
                        FEU Institute of Tech
                      </p>
                    </div>

                    <div>
                      <Label>New Course</Label>
                      <p className="p-2">
                        BS Computer Science
                      </p>
                    </div>

                    <div>
                      <Label>Effectivity</Label>
                      <p className="p-2">2026 1st Sem</p>
                    </div>

                    <div>
                      <Label>OJT (New Course)</Label>
                      <p className="p-2">Required</p>
                    </div>

                  </div>
                </section>

              </div>
            </div>

            {/* FILES SECTION (UNCHANGED) */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileDisplay label="Application Form:" fileName={files.applicationForm} />
                <FileDisplay label="Certification of Admission:" fileName={files.certAdmission} />
                <FileDisplay
                  label="Certification of Accredited Subjects:"
                  fileName={files.certAccreditedSubjects}
                />
                <FileDisplay
                  label="Certification of Year Level:"
                  fileName={files.certYearLevel}
                />
                <FileDisplay label="Certification of Grades:" fileName={files.certGrades} />
                <FileDisplay
                  label="Approved Program of Study:"
                  fileName={files.programStudy}
                />
              </div>
            </section>

            {/* COMMENTS (UNCHANGED) */}
            <section className="w-full">
              <Label className="text-sm font-semibold text-gray-700">Comments</Label>
              <textarea
                className="w-full mt-2 p-3 border rounded-lg text-sm"
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter remarks or instructions for the scholar..."
              />
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

      {/* Confirm Approve */}
      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Application"
        description="Are you sure you want to approve this application?"
        confirmText="Yes, approve"
        variant="info"
      />

      {/* Confirm Resubmit */}
      <ConfirmDialog
        isOpen={isResubmitOpen}
        onClose={() => setIsResubmitOpen(false)}
        onConfirm={handleResubmit}
        title="Request Resubmission"
        description="Are you sure you want to request resubmission?"
        confirmText="Yes, request resubmission"
        variant="danger"
      />
    </>
  );
}
