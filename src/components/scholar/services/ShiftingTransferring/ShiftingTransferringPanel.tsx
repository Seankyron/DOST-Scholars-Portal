'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, FileText, RefreshCw, Download, CheckCircle2, ArrowRightLeft, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShiftingTransferringModal } from './ShiftingTransferringModal';
import { RecentShiftingRequests } from './RecentShiftingRequests';
import { ShiftingOptionSelector } from './ShiftingOptionSelector'; 
import type { ShiftingType } from '@/types';

export function ShiftingTransferringPanel() {
  const [selectedType, setSelectedType] = useState<ShiftingType | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectType = (type: ShiftingType) => {
    setSelectedType(type);
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  const handleViewRequest = (request: any) => {
    setSelectedType(request.type);
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedType(null);
      setSelectedRequest(null);
    }, 300);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Shifting Course / Transferring School
      </h2>

      {/* Guidelines Card - Unchanged */}
      <Card className="bg-dost-title/5 border-dost-title/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-bold text-dost-title flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5" />
            Guidelines & Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-gray-700">
          <p>
            This portal serves as the official channel for uploading necessary documents for processing applications for shifting course or transferring school. Kindly ensure that all submissions are complete and accurate to avoid delays in evaluation.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Requirements List */}
            <div className="bg-white/60 p-5 rounded-xl border border-blue-100">
                <h4 className="font-bold text-dost-title mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" /> Documentary Requirements
                </h4>
                <ul className="space-y-3">
                    {[
                        "Certification of Admission in New Course/School",
                        "Certification of Accredited Subjects",
                        "Certification of Year Level in New Course/School",
                        "Certification of Grades in All Semesters Enrolled",
                        "Approved Program of Study/Curriculum in New Course/School",
                        "Application Form for Shifting Course/Transferring School"
                    ].map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-dost-title shrink-0" />
                            <span>{req}</span>
                        </li>
                    ))}
                </ul>
                
                <div className="mt-4 pt-3 border-t border-blue-100 flex flex-col gap-2">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   asChild
                   className="w-full bg-white hover:bg-blue-50 text-dost-title border-blue-200"
                 >
                    <a href="/templates/ptp/Forms_126-128_PTP.pdf" download target="_blank" rel="noopener noreferrer">
                      <Download className="h-3 w-3 mr-2" />
                      Download Application Form
                    </a>
                 </Button>
                </div>
            </div>

            {/* Conditions Card */}
            <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100">
                <h4 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" /> Important Conditions
                </h4>
                <ul className="space-y-3 text-yellow-900">
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-yellow-600 shrink-0" />
                        <span>Allowed only in meritorious cases.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-yellow-600 shrink-0" />
                        <span>New program must be in DOST-SEI priority S&T programs list.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-yellow-600 shrink-0" />
                        <span>New school must be a DOST-SEI identified institution.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-yellow-600 shrink-0" />
                        <span>Permitted only <strong>once</strong> during entire scholarship period.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-yellow-600 shrink-0" />
                        <span>Must be done by <strong>First Semester of Third Year</strong> at the latest.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-yellow-600 shrink-0" />
                        <span>Scholar must sign an Amendatory agreement.</span>
                    </li>
                </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Type Selector - Updated to use ShiftingOptionSelector */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 ml-1">
          Application for:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ShiftingOptionSelector 
                title="Shifting Course" 
                description="Change of degree program within the same university." 
                icon={ArrowRightLeft}
                onClick={() => handleSelectType('Shifting Course')}
            />
            <ShiftingOptionSelector 
                title="Transferring School" 
                description="Move to a different DOST-accredited university." 
                icon={Building2}
                onClick={() => handleSelectType('Transferring School')}
            />
            <ShiftingOptionSelector 
                title="Shifting & Transferring" 
                description="Change both degree program and university." 
                icon={RefreshCw}
                onClick={() => handleSelectType('Shifting Course & Transferring School')}
            />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
         <RecentShiftingRequests onViewDetails={handleViewRequest} />
      </div>

      {/* Modal */}
      {(selectedType || selectedRequest) && (
        <ShiftingTransferringModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          type={selectedType!}
          existingRequest={selectedRequest}
        />
      )}
    </div>
  );
}