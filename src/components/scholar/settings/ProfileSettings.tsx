'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toaster';
import { Loader2, Save, User, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { PROVINCES } from '@/lib/utils/constants';
import Link from 'next/link';

// Validation Schema
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  surname: z.string().min(1, "Surname is required"),
  suffix: z.string().optional(),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
  addressProvince: z.string().min(1, "Province is required"),
  addressCity: z.string().min(1, "City/Municipality is required"),
  addressBrgy: z.string().min(1, "Barangay/Street is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Initial Mock Data
const INITIAL_DATA = {
  firstName: 'Joshua',
  middleName: 'A.',
  surname: 'De Larosa',
  suffix: '',
  contactNumber: '09171234567',
  dateOfBirth: '2003-01-15',
  addressProvince: 'Laguna',
  addressCity: 'San Pablo City',
  addressBrgy: 'Brgy. San Vicente',
};

export function ProfileSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: INITIAL_DATA,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    
    // Simulate Network Request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Saved Data:', data);
    
    toast.success("Settings Saved", {
        description: "Your personal information has been updated successfully.",
    });

    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md bg-white">
        <CardHeader className="pb-8">
          <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-xl text-dost-title">Personal Information</CardTitle>
                <CardDescription>
                    Update your personal details and contact information.
                </CardDescription>
            </div>
            {/* Optional: Top 'Back' button for better navigation on mobile */}
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex text-gray-500">
                <Link href="/scholar/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
          </div>
        </CardHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Fieldset disables all inputs when submitting */}
          <fieldset disabled={isSaving} className="group">
            <CardContent className="space-y-8 pt-6">
                
                {/* Identity Section */}
                <div className="space-y-4">
                <div className="flex items-center gap-2 text-dost-title mb-2">
                    <User className="h-4 w-4" />
                    <h3 className="font-medium text-sm uppercase tracking-wider">Identity Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" {...form.register('firstName')} />
                        {form.formState.errors.firstName && (
                            <p className="text-xs text-red-500">{form.formState.errors.firstName.message}</p>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input id="middleName" {...form.register('middleName')} placeholder="Optional" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="surname">Surname</Label>
                        <Input id="surname" {...form.register('surname')} />
                        {form.formState.errors.surname && (
                            <p className="text-xs text-red-500">{form.formState.errors.surname.message}</p>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="suffix">Suffix</Label>
                        <Input id="suffix" {...form.register('suffix')} placeholder="e.g. Jr., III" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input type="date" id="dateOfBirth" {...form.register('dateOfBirth')} />
                        {form.formState.errors.dateOfBirth && (
                            <p className="text-xs text-red-500">{form.formState.errors.dateOfBirth.message}</p>
                        )}
                    </div>
                </div>
                </div>

                <Separator />

                {/* Address & Contact Section */}
                <div className="space-y-4">
                <div className="flex items-center gap-2 text-dost-title mb-2">
                    <MapPin className="h-4 w-4" />
                    <h3 className="font-medium text-sm uppercase tracking-wider">Address & Contact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Select
                        label="Province"
                        {...form.register('addressProvince')}
                        options={PROVINCES.map((p) => ({ value: p, label: p }))}
                        error={form.formState.errors.addressProvince?.message}
                        placeholder="Select Province"
                        />
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="addressCity">City / Municipality</Label>
                    <Input id="addressCity" {...form.register('addressCity')} />
                    {form.formState.errors.addressCity && (
                        <p className="text-xs text-red-500">{form.formState.errors.addressCity.message}</p>
                    )}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="addressBrgy">Barangay, Street, House/Unit No.</Label>
                    <Input 
                        id="addressBrgy" 
                        {...form.register('addressBrgy')} 
                        placeholder="e.g. Brgy. San Vicente, 123 Rizal St."
                    />
                    {form.formState.errors.addressBrgy && (
                        <p className="text-xs text-red-500">{form.formState.errors.addressBrgy.message}</p>
                    )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactNumber">Active Contact Number</Label>
                        <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                            id="contactNumber" 
                            {...form.register('contactNumber')} 
                            className="pl-9"
                            placeholder="09xxxxxxxxx" 
                        />
                        </div>
                        {form.formState.errors.contactNumber && (
                        <p className="text-xs text-red-500">{form.formState.errors.contactNumber.message}</p>
                    )}
                    </div>
                </div>
                </div>
            </CardContent>
          </fieldset>
          
          <CardFooter className="flex justify-end border-t px-6 py-4 bg-gray-50/50">

            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto min-w-[140px] bg-dost-title hover:bg-dost-title/90">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}