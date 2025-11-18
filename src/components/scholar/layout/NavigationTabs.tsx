'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { scholarNavigation } from '@/config/navigation';
import { ServiceTilesGrid } from '../home/ServiceTilesGrid';
import { Card, CardContent } from '@/components/ui/card';
import { DirectoriesPanel } from '../directories/DirectoriesPanel';
import { RecentActivity } from './RecentActivity'; 

// Mock panels for content
const MockPanel = ({ title }: { title: string }) => (
  <Card>
    <CardContent className="p-6">
      <p className="text-gray-600">
        Content for <strong>{title}</strong> goes here.
      </p>
    </CardContent>
  </Card>
);

export function NavigationTabs() {
  return (
    <Tabs defaultValue="service" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-dost-title rounded-lg p-1 h-auto">
        {scholarNavigation.map((nav) => (
          <TabsTrigger
            key={nav.value}
            value={nav.value}
            className="
              py-2 text-sm font-semibold rounded-md 
              ring-offset-white 
              focus-visible:ring-2 focus-visible:ring-white 
              
              text-white 
              
              data-[state=active]:bg-white 
              data-[state=active]:text-dost-title 
              data-[state=active]:shadow-none
            "
          >
            {nav.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Content panes */}
      <TabsContent value="service" className="mt-6">
        <div className="flex flex-col gap-6">
          <ServiceTilesGrid />
          
          <div className="h-[500px]">
             <RecentActivity />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="directories" className="mt-6">
        <DirectoriesPanel />
      </TabsContent>

      <TabsContent value="downloadables" className="mt-6">
        <MockPanel title="Downloadables" />
      </TabsContent>
      <TabsContent value="faqs" className="mt-6">
        <MockPanel title="FAQs" />
      </TabsContent>
    </Tabs>
  );
}