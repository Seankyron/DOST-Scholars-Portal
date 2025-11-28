'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toaster';
import { useState } from 'react';

// Schema for validation
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

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholar: {
    firstName: string;
    middleName?: string;
    surname: string;
    suffix?: string;
    contactNumber: string;
    dateOfBirth: string;
    completeAddress: string;
  };
  onSuccess: (newData: ProfileFormValues) => void;
}

export function EditProfileModal({ isOpen, onClose, scholar, onSuccess }: EditProfileModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: scholar.firstName,
      middleName: scholar.middleName || '',
      surname: scholar.surname,
      suffix: scholar.suffix || '',
      contactNumber: scholar.contactNumber,
      dateOfBirth: scholar.dateOfBirth ? new Date(scholar.dateOfBirth).toISOString().split('T')[0] : '', 
      completeAddress: scholar.completeAddress,
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    
    // SIMULATED BACKEND DELAY
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSuccess(data);
    
    // --- FIX: Updated to Sonner syntax ---
    toast.success("Profile Updated", {
        description: "Your personal information has been successfully updated.",
    });

    setIsSaving(false);
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>Edit Personal Information</ModalTitle>
        </ModalHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...form.register('firstName')} />
                {form.formState.errors.firstName && (
                  <p className="text-xs text-red-500">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name (Optional)</Label>
                <Input id="middleName" {...form.register('middleName')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Surname</Label>
                <Input id="surname" {...form.register('surname')} />
                {form.formState.errors.surname && (
                  <p className="text-xs text-red-500">{form.formState.errors.surname.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="suffix">Suffix (Optional)</Label>
                <Input id="suffix" {...form.register('suffix')} className="w-24" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="completeAddress">Complete Address</Label>
              <Textarea 
                id="completeAddress" 
                {...form.register('completeAddress')} 
                className="min-h-[80px]"
              />
               {form.formState.errors.completeAddress && (
                  <p className="text-xs text-red-500">{form.formState.errors.completeAddress.message}</p>
                )}
            </div>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
                <Button variant="outline" type="button" disabled={isSaving}>
                Cancel
                </Button>
            </ModalClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}