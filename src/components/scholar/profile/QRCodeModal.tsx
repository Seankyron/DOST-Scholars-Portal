'use client';

import { QRCodeSVG } from 'qrcode.react';
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
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarId: string;
  scholarName: string;
}

export function QRCodeModal({ isOpen, onClose, scholarId, scholarName }: QRCodeModalProps) {
  
  const handleDownload = () => {
    const svg = document.getElementById('scholar-qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        // Fill white background (transparent SVGs can be dark in some viewers)
        if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `DOST-QR-${scholarId}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
            toast.success('QR Code downloaded successfully');
        }
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    } else {
        toast.error('Could not generate image.');
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle className="text-center text-dost-title">My Scholar QR</ModalTitle>
        </ModalHeader>
        
        <ModalBody className="flex flex-col items-center justify-center py-6 space-y-6">
            {/* QR Container with border */}
            <div className="p-4 bg-white border-4 border-dost-title rounded-2xl shadow-sm">
                <QRCodeSVG
                    id="scholar-qr-code"
                    value={scholarId}
                    size={220}
                    level="H" // High error correction
                    includeMargin={true}
                    className="w-full h-auto"
                />
            </div>

            {/* Scholar Details */}
            <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-gray-900">{scholarId}</h3>
                <p className="text-sm font-medium text-gray-600 uppercase">{scholarName}</p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-blue-700 max-w-[260px] leading-relaxed">
                    Present this QR code at the DOST-SEI Regional Office or during official events for quick identification and attendance.
                </p>
            </div>
        </ModalBody>

        <ModalFooter className="flex-col sm:flex-row gap-2 sm:justify-center w-full">
           <Button variant="outline" onClick={handleDownload} className="w-full sm:w-auto gap-2">
             <Download className="h-4 w-4" />
             Save as Image
           </Button>
           <ModalClose asChild>
             <Button className="w-full sm:w-auto">Done</Button>
           </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}