'use client';

import { Button } from '@/components/ui/button';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter,
} from '@/components/ui/modal';

interface DeleteBannerModalProps {
    open: boolean;
    onClose: () => void;
    bannerTitle?: string;
    onConfirm: () => void;
}

export function DeleteBannerModal({
    open,
    onClose,
    bannerTitle,
    onConfirm,
}: DeleteBannerModalProps) {
    return (
        <Modal open={open} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Confirm Deletion</ModalTitle>
                </ModalHeader>

                <ModalBody>
                    <p className="text-gray-700">
                        Are you sure you want to delete{' '}
                        <strong>{bannerTitle || 'this banner'}</strong>? This action cannot be undone.
                    </p>
                </ModalBody>

                <ModalFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                    variant="outline"
                    className="bg-red-500 text-white hover:bg-red-600"
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    >
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
