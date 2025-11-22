'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner'; 
import { Loader2, Save } from 'lucide-react';

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
  completeAddress: z.string().min(5, "Address is too short"),
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
  completeAddress: 'Brgy. San Vicente, San Pablo City, Laguna',
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
      <Card className="border-t-4 border-t-dost-blue shadow-sm">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details here. Some academic fields cannot be changed.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Name Section */}
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
                <Input id="suffix" {...form.register('suffix')} className="w-full md:w-32" placeholder="e.g. Jr." />
              </div>
            </div>

            <Separator />

            {/* Contact & Bio Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input type="date" id="dateOfBirth" {...form.register('dateOfBirth')} />
                 {form.formState.errors.dateOfBirth && (
                  <p className="text-xs text-red-500">{form.formState.errors.dateOfBirth.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input id="contactNumber" {...form.register('contactNumber')} placeholder="09xxxxxxxxx" />
                 {form.formState.errors.contactNumber && (
                  <p className="text-xs text-red-500">{form.formState.errors.contactNumber.message}</p>
                )}
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="completeAddress">Complete Address</Label>
                <Textarea 
                  id="completeAddress" 
                  {...form.register('completeAddress')} 
                  className="min-h-[80px] resize-none"
                />
                 {form.formState.errors.completeAddress && (
                    <p className="text-xs text-red-500">{form.formState.errors.completeAddress.message}</p>
                  )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end border-t px-6 py-4 bg-gray-50/50 rounded-b-xl">
            <Button type="submit" disabled={isSaving} className="min-w-[140px]">
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