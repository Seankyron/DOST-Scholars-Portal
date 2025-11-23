'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, Download } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export default function CompletionModal({ isOpen, onClose, data }: CompletionModalProps) {
  const scholarInfo = data?.scholarInfo;
  const placement = data?.placement;
  const submission = data?.submission;

  if (!isOpen || !data || !scholarInfo) return null;

  const [comment, setComment] = useState('');

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="4xl">
        <ModalHeader>
          <ModalTitle className="text-center w-full text-dost-title text-2xl font-bold">
            PTP Completion Details
          </ModalTitle>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="space-y-3 border-r pr-4">
              <h2 className="text-lg font-semibold text-dost-title border-b pb-2">Scholar Information</h2>

              <Info label="Name" value={scholarInfo.name} />
              <Info label="Contact Number" value={scholarInfo.contact} />
              <Info label="Date of Birth" value={scholarInfo.dob} />
              <Info label="Complete Address" value={scholarInfo.address} />
            </section>

            <section className="space-y-3 border-r px-4">
              <h2 className="text-lg font-semibold text-dost-title border-b pb-2">Year of Award & Study Placement</h2>

              <Info label="Scholarship Type" value={placement.scholarshipType} />
              <Info label="Batch / Year Awarded" value={placement.batch} />
              <Info label="School / University" value={placement.university} />
              <Info label="Program / Course" value={placement.program} />

              <div className="mt-4">
                <h2 className="text-lg font-semibold text-dost-title border-b pb-2">Submission Details</h2>

                <Info label="Year & Semester" value={submission.yearSem} />
                <Info label="Academic Year" value={submission.academicYear} />
                <Info label="Date Submitted" value={submission.dateSubmitted} />

                <div>
                  <Label className="text-sm font-medium text-gray-700">Plan:</Label>
                  <p className="text-sm text-gray-800 whitespace-pre-line">{submission.plan}</p>
                </div>
              </div>
            </section>

            <section className="space-y-4 pl-4">
              <h2 className="text-lg font-semibold text-dost-title border-b pb-2">Submitted Documents</h2>

              <DocumentItem label="Daily Time Record (DTR):" fileName={submission.dtr} />
              <DocumentItem label="Form 126:" fileName={submission.form126} />
              <DocumentItem label="Form 127:" fileName={submission.form127} />
              <DocumentItem label="Form 128:" fileName={submission.form128} />

              
            </section>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3">
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => console.log('Request Resubmission Clicked')}>REQUEST RESUBMISSION</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => console.log('Approve Clicked')}>APPROVE</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function DocumentItem({ label, fileName, needsResubmit = false }: { label: string; fileName: string; needsResubmit?: boolean; }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        {needsResubmit && <span className="text-xs font-medium text-red-600">To Resubmit</span>}
      </div>

      <div className="flex items-center justify-between p-3 pl-4 border rounded-lg bg-gray-50">
        <span className="text-sm font-medium text-gray-800 truncate">{fileName}</span>

        <div className="flex items-center gap-1.5 ml-2">
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0" title="View"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0" title="Download"><Download className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
