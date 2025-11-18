"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from "@/components/ui/modal";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, Download } from "lucide-react";

interface TravelClearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    scholarName: string;
    contactNumber: string;
    dob: string;
    address: string;

    scholarshipType: string;
    batchYear: string;
    school: string;
    program: string;

    destination: string;
    arrival: string;
    requestLetter?: string;
    causeOfDelay?: string;
    guaranteeLetter?: string;
    completedForm?: string;
  };
}

export default function TravelClearanceModal({
  isOpen,
  onClose,
  data,
}: TravelClearanceModalProps) {
  if (!data) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="4xl">
        {/* HEADER */}
        <ModalHeader>
          <ModalTitle className="text-center w-full text-dost-title text-2xl font-bold">
            Travel Clearance Details
          </ModalTitle>
        </ModalHeader>

        {/* BODY */}
        <ModalBody className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* LEFT: Scholar Information */}
            <section className="space-y-3 border-r pr-4">
              <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                Scholar Information
              </h2>

              <Info label="Name" value={data.scholarName} />
              <Info label="Contact Number" value={data.contactNumber} />
              <Info label="Date of Birth" value={data.dob} />
              <Info label="Complete Address" value={data.address} />
            </section>

            {/* CENTER: Award & Placement */}
            <section className="space-y-3 border-r px-4">
              <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                Year of Award & Study Placement
              </h2>

              <Info label="Scholarship Type" value={data.scholarshipType} />
              <Info label="Batch / Year Awarded" value={data.batchYear} />
              <Info label="School / University" value={data.school} />
              <Info label="Program / Course" value={data.program} />
            </section>

            {/* RIGHT: Travel Details + Documents */}
            <section className="space-y-4 pl-4">
              <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                Travel Details
              </h2>

              <Info label="Destination" value={data.destination} />
              <Info label="Arrival" value={data.arrival} />

              <h2 className="text-lg font-semibold text-dost-title border-b pb-2 mt-4">
                Submitted Documents
              </h2>

              <DocumentItem label="Request Letter" fileName={data.requestLetter} />
              <DocumentItem label="Cause of Delay" fileName={data.causeOfDelay} />
              <DocumentItem label="Guarantee Letter" fileName={data.guaranteeLetter} />
              <DocumentItem
                label="Completed Request Form"
                fileName={data.completedForm}
              />
            </section>

          </div>
        </ModalBody>

        {/* FOOTER */}
        <ModalFooter className="flex justify-end gap-3">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}



function Info({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || "—"}</p>
    </div>
  );
}

function DocumentItem({
  label,
  fileName,
}: {
  label: string;
  fileName?: string;
}) {
  const hasFile = !!fileName;

 return (
    <div>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>

      <div className="border rounded-lg bg-gray-50 mt-1 p-3 flex items-center justify-between">
        {hasFile ? (
          <>
            <span className="text-sm font-medium text-gray-800 truncate">
              {fileName}
            </span>

            <div className="flex items-center gap-1.5 ml-2">
              <Button variant="ghost" size="sm" className="w-7 h-7 p-0" title="View">
                <Eye className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" className="w-7 h-7 p-0" title="Download">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <span className="text-sm text-gray-600">No file submitted</span>
        )}
      </div>
    </div>
  );
}