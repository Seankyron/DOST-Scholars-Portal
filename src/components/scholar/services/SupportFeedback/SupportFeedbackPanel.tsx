// src/components/scholar/services/SupportFeedback/SupportFeedbackPanel.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bug, HelpCircle, MessageSquare, MoreHorizontal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { CategorySelector } from './CategorySelector';
import { FeedbackHistory } from './FeedbackHistory';
import { SupportFeedbackModal } from './SupportFeedbackModal';

export function SupportFeedbackPanel() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  const handleViewRequest = (request: any) => {
    setSelectedCategory(request.category);
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedCategory(null);
      setSelectedRequest(null);
    }, 300);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Support & Feedback
      </h2>

      {/* 1. Guidelines */}
      <Card className="bg-dost-title/5 border-dost-title/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-bold text-dost-title flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5" />
            How can we help you?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <p className="text-justify">
            Use this module to report technical issues with the portal, ask questions about your scholarship, or send suggestions to the DOST-SEI Regional Office.
          </p>
          <div className="bg-white/60 p-4 rounded-lg border border-blue-100">
             <p className="font-semibold mb-2 text-dost-title">Note on Processing:</p>
             <ul className="list-disc list-inside space-y-1 ml-1">
                <li>Support tickets are typically addressed within <strong>2-3 business days</strong>.</li>
                <li>For urgent concerns, please contact the Regional Office directly via the <strong>Directories Tab</strong>.</li>
                <li>Check the <strong>FAQs</strong> first as your question might already be answered there.</li>
             </ul>
          </div>
        </CardContent>
      </Card>

      {/* 2. Selection Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 ml-1">
          Select Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategorySelector 
            title="Technical Issue" 
            description="Report bugs, errors, or problems with the portal." 
            icon={Bug}
            onClick={() => handleSelectCategory('Technical Issue')}
          />
          <CategorySelector 
            title="Scholarship Inquiry" 
            description="Questions about policies, stipends, or requirements." 
            icon={HelpCircle}
            onClick={() => handleSelectCategory('Scholarship Inquiry')}
          />
          <CategorySelector 
            title="Suggestion / Feedback" 
            description="Ideas to improve the system or our services." 
            icon={MessageSquare}
            onClick={() => handleSelectCategory('Suggestion / Feedback')}
          />
          <CategorySelector 
            title="Others" 
            description="Other concerns not listed above." 
            icon={MoreHorizontal}
            onClick={() => handleSelectCategory('Other')}
          />
        </div>
      </div>

      {/* 3. History */}
      <div className="mt-8">
         <FeedbackHistory onViewDetails={handleViewRequest} />
      </div>

      {/* 4. Modal */}
      {(selectedCategory || selectedRequest) && (
        <SupportFeedbackModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          category={selectedCategory!}
          existingRequest={selectedRequest}
        />
      )}
    </div>
  );
}