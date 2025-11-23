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

// Reusable Contact Item component
function OfficeContactItem({ type, value }: { type: string; value: string }) {
  const isLink = value.startsWith('http');

  return (
    <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 w-5 mt-0.5">{getContactIcon(type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{type}</p>
        {isLink ? (
          <Link
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-dost-blue hover:underline break-all"
          >
            {value.replace('https://www.', '').replace('https://', '')}
          </Link>
        ) : (
          <p className="text-sm font-medium text-gray-800 break-words leading-snug">{value}</p>
        )}
      </div>
      {!isLink && (
        <CopyButton
          text={value}
          variant="icon"
          className="flex-shrink-0 h-6 w-6 text-gray-400 hover:text-dost-blue"
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
        'flex items-center gap-4 p-3 rounded-xl border transition-all duration-200',
        sao.contact.type === 'Not Provided'
          ? 'bg-gray-50/50 border-gray-100 opacity-80'
          : 'bg-white border-gray-200/60 hover:border-blue-200 hover:shadow-sm'
      )}
    >
      <div className={cn(
        "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
        sao.contact.type === 'Facebook' ? "bg-blue-50" : "bg-gray-100"
      )}>
        <sao.icon
          className={cn(
            'h-5 w-5',
            sao.contact.type === 'Facebook'
              ? 'text-blue-600'
              : 'text-gray-400'
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate" title={sao.name}>{sao.name}</p>
        {sao.contact.type !== 'Not Provided' ? (
          <Link
            href={sao.contact.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-dost-blue hover:underline truncate block"
          >
            {sao.contact.value.split('facebook.com/')[1] || 'Visit Page'}
          </Link>
        ) : (
          <p className="text-xs text-gray-400 italic">No online page available</p>
        )}
      </div>
      {sao.contact.type !== 'Not Provided' && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full text-gray-400 hover:text-dost-blue hover:bg-blue-50"
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
    <div className="space-y-8">
      {/* --- 1. REGIONAL CARD (Styled to match Downloadables "General Documents") --- */}
      <Card className="shadow-md bg-white border-none">
        <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
          <CardTitle className="text-lg font-bold text-dost-title flex items-center gap-2">
            <Building className="h-5 w-5 text-dost-title" />
            {regionalOffice.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left: Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 rounded-full bg-dost-blue"></div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Contact Information</h3>
              </div>
              <div className="grid gap-1">
                {regionalOffice.contacts.map((contact) => (
                  <OfficeContactItem
                    key={contact.type}
                    type={contact.type}
                    value={contact.value}
                  />
                ))}
              </div>
            </div>

            {/* Right: Regional Council */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 rounded-full bg-dost-blue"></div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Regional Student Council</h3>
              </div>
              <SaoItem sao={regionalSao} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- 2. PROVINCIAL TABS --- */}
      <Tabs defaultValue="Cavite" className="w-full">
        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700 ml-1">
            Select Your Province
          </Label>
          <TabsList className="flex w-full overflow-x-auto scrollbar-thin p-1 h-auto bg-white rounded-lg mt-1.5 border border-gray-100 shadow-sm">
            {provincialDirectories.map((group) => (
              <TabsTrigger
                key={group.province}
                value={group.province}
                className="
                  flex-shrink-0 py-2 px-4 text-sm font-semibold rounded-md 
                  transition-all duration-200
                  text-gray-600 hover:text-dost-blue
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

        <div className="mt-4">
          {provincialDirectories.map((group) => (
            <TabsContent
              key={group.province}
              value={group.province}
              className="m-0"
            >
              {/* Grid Layout for content density */}
              <div className="grid gap-6 lg:grid-cols-2">
                
                {/* --- PSTO Card --- */}
                <Card className="shadow-md bg-white border-none h-full">
                  <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
                    <CardTitle className="text-lg font-bold text-dost-title flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Provincial Office (PSTO)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      {group.psto.contacts.map((contact) => (
                        <OfficeContactItem
                          key={contact.type}
                          type={contact.type}
                          value={contact.value}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* --- SAO Card --- */}
                <Card className="shadow-md bg-white border-none h-full">
                  <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
                    <CardTitle className="text-lg font-bold text-dost-title flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Scholar Associations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {group.sao.length > 0 ? (
                        group.sao.map((assoc) => (
                          <SaoItem key={assoc.name} sao={assoc} />
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                          <Users className="h-8 w-8 text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500 font-medium">
                            No Scholar Associations listed
                          </p>
                        </div>
                      )}
                    </div>
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