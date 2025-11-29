'use client';

import { useState } from 'react';
import { PTPTable } from '@/components/admin/tables/PracticalTraining/PTPTable';
import { PTPFilters } from '@/components/admin/tables/PracticalTraining/PTPFilters';
import { SearchInput } from '@/components/shared/SearchInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PracticalTrainingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('referral');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dost-title">
        Practical Training Management
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* --- Tabs Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <TabsList className="bg-white p-1 border h-auto">
            <TabsTrigger 
              value="referral" 
              className="px-4 py-2 text-sm data-[state=active]:bg-dost-title data-[state=active]:text-white transition-all"
            >
              Referral Requests
            </TabsTrigger>
            <TabsTrigger 
              value="completion" 
              className="px-4 py-2 text-sm data-[state=active]:bg-dost-title data-[state=active]:text-white transition-all"
            >
              Completion Reports
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- Filters (Shared but Context-Aware) --- */}
        <div className="mb-6">
           <PTPFilters showPlanFilter={activeTab === 'referral'} />
        </div>

        {/* --- Tab Contents --- */}
        <TabsContent value="referral" className="mt-0">
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Referral Letter Requests
                </h2>
              </div>
              <SearchInput
                placeholder="Search Referral Requests..."
                onSearch={setSearchTerm}
                className="w-full sm:max-w-xs"
              />
            </div>
            <PTPTable searchTerm={searchTerm} filterType="Referral Letter" />
          </div>
        </TabsContent>

        <TabsContent value="completion" className="mt-0">
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Program Completion Reports
                </h2>
              </div>
              <SearchInput
                placeholder="Search Completion Reports..."
                onSearch={setSearchTerm}
                className="w-full sm:max-w-xs"
              />
            </div>
            <PTPTable searchTerm={searchTerm} filterType="Program Completion" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 