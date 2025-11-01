'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { scholarNavigation } from '@/config/navigation';
import { ServiceTilesGrid } from '../home/ServiceTilesGrid';
import { Card, CardContent } from '@/components/ui/card';

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
    <Tabs defaultValue="home" className="w-full">
      {/* The blue bar, with p-1 to create the inset border */}
      <TabsList className="grid w-full grid-cols-4 bg-dost-title rounded-lg p-1 h-auto">
        {scholarNavigation.map((nav) => (
          <TabsTrigger
            key={nav.value}
            value={nav.value}
            className="
              py-2 text-sm font-semibold rounded-md 
              ring-offset-white 
              focus-visible:ring-2 focus-visible:ring-white 
              
              // Inactive state: Fully white text
              text-white 
              
              // Active state: White background, dost-title text
              data-[state=active]:bg-white 
              data-[state=active]:text-dost-title 
              data-[state=active]:shadow-none // Prevents overlap
            "
          >
            {nav.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Content panes */}
      <TabsContent value="home" className="mt-6">
        <h2 className="text-2xl text-center font-bold text-dost-title mb-4">
          Scholar Services
        </h2>
        <ServiceTilesGrid />
      </TabsContent>
      <TabsContent value="directories" className="mt-6">
        <MockPanel title="Directories" />
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