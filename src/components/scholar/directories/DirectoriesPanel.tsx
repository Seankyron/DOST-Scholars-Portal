// src/components/scholar/directories/DirectoriesPanel.tsx
'use client';

import {
  regionalOffice,
  regionalSao,
  provincialDirectories,
} from '@/config/directories';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/shared/CopyButton';
import { Separator } from '@/components/ui/separator';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Globe,
  LinkIcon,
  Building,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { Label } from '@/components/ui/label';

// Helper to get the correct icon for contacts
const getContactIcon = (type: string) => {
  if (type === 'Phone') return <Phone className="h-4 w-4 text-dost-blue" />;
  if (type === 'Email') return <Mail className="h-4 w-4 text-dost-blue" />;
  if (type === 'Address') return <MapPin className="h-4 w-4 text-dost-blue" />;
  if (type === 'Facebook')
    return <Facebook className="h-4 w-4 text-blue-600" />;
  return <Globe className="h-4 w-4 text-gray-500" />;
};

// Reusable Contact Item component (for white cards)
function OfficeContactItem({ type, value }: { type: string; value: string }) {
  const isLink = value.startsWith('http');
  const isEmail = type === 'Email';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-5">{getContactIcon(type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{type}</p>
        {isLink ? (
          <Link
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-dost-blue hover:underline truncate block"
          >
            {value.replace('https://www.', '').replace('https://', '')}
          </Link>
        ) : (
          <p className="text-sm font-medium text-gray-800 break-words">{value}</p>
        )}
      </div>
      {!isLink && (
        <CopyButton
          text={value}
          variant="icon"
          className="flex-shrink-0"
        />
      )}
    </div>
  );
}

// Reusable Card for SAO
function SaoItem({ sao }: { sao: typeof provincialDirectories[0]['sao'][0] }) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg',
        sao.contact.type === 'Not Provided'
          ? 'bg-gray-50 opacity-70'
          : 'bg-white hover:bg-gray-50 border' // Added border for clarity
      )}
    >
      <div className="flex-shrink-0">
        <sao.icon
          className={cn(
            'h-6 w-6',
            sao.contact.type === 'Facebook'
              ? 'text-blue-600'
              : 'text-gray-400'
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{sao.name}</p>
        {sao.contact.type !== 'Not Provided' ? (
          <Link
            href={sao.contact.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-dost-blue hover:underline truncate block"
          >
            {sao.contact.value.split('facebook.com/')[1] || 'View Page'}
          </Link>
        ) : (
          <p className="text-xs text-gray-500">No link provided</p>
        )}
      </div>
      {sao.contact.type !== 'Not Provided' && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 flex-shrink-0"
        >
          <Link
            href={sao.contact.value}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}

// Main Panel Component
export function DirectoriesPanel() {
  return (
    <div className="space-y-6">
      {/* --- 1. REGIONAL CARD (White base) --- */}
      <Card className="shadow-md bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-dost-title">
            {regionalOffice.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {regionalOffice.contacts.map((contact) => (
            <OfficeContactItem
              key={contact.type}
              type={contact.type}
              value={contact.value}
            />
          ))}
          <Separator className="my-3" />
          {/* Using SaoItem here for consistency */}
          <SaoItem sao={regionalSao} />
        </CardContent>
      </Card>

      {/* --- 2. PROVINCIAL TABS --- */}
      <Tabs defaultValue="Cavite" className="w-full">
        {/* "Tabs one line" */}
        <div className="mb-1">
          <Label className="text-sm font-medium text-gray-700">
            Select Your Province
          </Label>
          <TabsList className="flex w-full overflow-x-auto scrollbar-thin p-1 h-auto bg-white rounded-lg mt-1.5">
            {provincialDirectories.map((group) => (
              <TabsTrigger
                key={group.province}
                value={group.province}
                className="
                  flex-shrink-0 py-2 px-4 text-sm font-semibold rounded-md 
                  ring-offset-white focus-visible:ring-2 focus-visible:ring-dost-title
                  text-gray-600
                  data-[state=active]:bg-dost-title 
                  data-[state=active]:text-white
                  data-[state=active]:shadow-sm
                "
              >
                {group.province}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Content - "PSTO and SAO cards should be grid 2 column" */}
        <div className="mt-6">
          {provincialDirectories.map((group) => (
            <TabsContent
              key={group.province}
              value={group.province}
              className="m-0"
            >
              {/* THIS IS THE 2-COLUMN GRID FOR THE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- Column 1: PSTO Card --- */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg text-dost-title flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Provincial Office (PSTO)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {group.psto.contacts.map((contact) => (
                      <OfficeContactItem
                        key={contact.type}
                        type={contact.type}
                        value={contact.value}
                      />
                    ))}
                  </CardContent>
                </Card>

                {/* --- Column 2: SAO Card --- */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg text-dost-title flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Scholar Associations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {group.sao.length > 0 ? (
                      group.sao.map((assoc) => (
                        <SaoItem key={assoc.name} sao={assoc} />
                      ))
                    ) : (
                      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 italic text-center">
                          No Scholar Associations listed for this province.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}