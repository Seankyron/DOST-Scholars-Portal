'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Briefcase, Plane, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { TravelClearanceModal } from './TravelClearanceModal';
import { PurposeSelector } from './PurposeSelector';
import { RecentTravelRequests } from './RecentTravelRequests';
import { downloadableFiles } from '@/config/downloadables';
import type { TravelPurpose } from '@/types/services';

export function TravelClearancePanel() {
  const [selectedPurpose, setSelectedPurpose] = useState<TravelPurpose | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPurpose = (purpose: TravelPurpose) => {
    setSelectedPurpose(purpose);
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  const handleViewRequest = (request: any) => {
    setSelectedPurpose(request.purpose);
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPurpose(null);
      setSelectedRequest(null);
    }, 300);
  };

  // Load files from config
  const files = downloadableFiles['travel-clearance'] || [];
  const requestFormTemplate = files.find(f => f.name.includes('Request Form'));
  const deedTemplate = files.find(f => f.name.includes('Deed'));
  const guaranteeTemplate = files.find(f => f.name.includes('Guarantee'));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Travel Clearance
      </h2>

      {/* Guidelines Card */}
      <Card className="bg-dost-title/5 border-dost-title/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-bold text-dost-title flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5" />
            Guidelines & Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p className="text-justify">
            Please complete the following documents to process your <strong>Temporary Clearance to Travel Abroad</strong>. These should be submitted <strong>at least 2 weeks before your departure date</strong>. Note that this clearance is for a short period of travel only.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Official Business */}
            <div className="bg-white/60 p-4 rounded-lg border border-blue-100 flex flex-col h-full">
              <h4 className="font-bold text-dost-title mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                For Official Business Travel
              </h4>
              <ul className="space-y-2 list-disc list-inside text-gray-700 flex-grow">
                <li><strong>Letter to Regional Director:</strong> Addressed to Ms. Emelita P. Bagsit, indicating purpose, destination, and exact dates.</li>
                <li><strong>Guarantee Letter:</strong> From employer addressed to Dr. Jayeel S. Cornelio (Director, DOST-SEI), stating coverage of obligations if the scholar fails to return.</li>
                <li><strong>Completed Request Form:</strong> Download template below.</li>
              </ul>
            </div>

            {/* Other Purposes */}
            <div className="bg-white/60 p-4 rounded-lg border border-blue-100 flex flex-col h-full">
              <h4 className="font-bold text-dost-title mb-3 flex items-center gap-2">
                <Plane className="h-4 w-4" />
                For Other Purposes
              </h4>
              <ul className="space-y-2 list-disc list-inside text-gray-700 flex-grow">
                <li><strong>Letter to Regional Director:</strong> Addressed to Ms. Emelita P. Bagsit, indicating purpose, destination, and exact dates.</li>
                <li><strong>Notarized Deed of Undertaking:</strong> Signed by Scholar and Co-maker.</li>
                <li><strong>Co-maker's Documents:</strong> Certificate of Employment (with Compensation) or ITR, and Photocopy of Valid ID.</li>
                <li><strong>Completed Request Form:</strong> Download template below.</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-blue-100">
                 {deedTemplate && (
                   <Button variant="outline" size="sm" asChild className="w-full bg-white hover:bg-blue-50 text-dost-title border-blue-200">
                      <a href={deedTemplate.url} download target="_blank" rel="noopener noreferrer">
                        <Download className="h-3 w-3 mr-2" />
                        Download Deed of Undertaking
                      </a>
                   </Button>
                 )}
              </div>
            </div>
          </div>

          <Separator className="bg-blue-200" />

          {/* Footer & Common Download */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="text-xs text-gray-700 italic space-y-1">
              <p><strong>Note:</strong> The Co-maker must reside in the Philippines and should not be part of the travel.</p>
              <p>Processing time is <strong>5 to 10 business days</strong> upon receipt of requirements.</p>
            </div>

            {requestFormTemplate && (
               <Button variant="outline" size="sm" asChild className="bg-white hover:bg-blue-50 text-dost-title border-blue-200 shrink-0">
                  <a href={requestFormTemplate.url} download target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Download Request Form
                  </a>
               </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selection Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 ml-1">
          Select Travel Purpose
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PurposeSelector
            title="Official Business Travel"
            description="For work-related trips, conferences, or official duties."
            icon={Briefcase}
            onClick={() => handleSelectPurpose('Official Business Travel')}
          />
          <PurposeSelector
            title="Other Purposes"
            description="For tourism, vacation, or personal visits."
            icon={Plane}
            onClick={() => handleSelectPurpose('Other')}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
         <RecentTravelRequests onViewDetails={handleViewRequest} />
      </div>

      {/* Main Modal */}
      {(selectedPurpose || selectedRequest) && (
        <TravelClearanceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          purpose={selectedPurpose!}
          existingRequest={selectedRequest}
        />
      )}
    </div>
  );
}