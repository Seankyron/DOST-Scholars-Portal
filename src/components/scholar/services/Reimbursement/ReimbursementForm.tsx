'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/ui/file-upload';
import { FileDisplayReadOnly } from '@/components/shared/FileDisplayReadOnly';

interface ReimbursementFormProps {
  type: string;
  amount: string; setAmount: (v: string) => void;
  details: string; setDetails: (v: string) => void;
  
  // File State
  receipt: File | null; setReceipt: (f: File | null) => void;
  
  isReadOnly?: boolean;
}

export function ReimbursementForm({
  type,
  amount, setAmount,
  details, setDetails,
  receipt, setReceipt,
  isReadOnly
}: ReimbursementFormProps) {

  return (
    <div className="space-y-6">
      {/* Context Header */}
      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
        <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
          Reimbursement Type
        </h4>
        <p className="text-lg font-bold text-gray-900">{type}</p>
      </div>

      <div className="space-y-4">
        {/* Amount Field */}
        <div className="space-y-2">
            <Label htmlFor="amount">
                Amount to be Reimbursed (PHP) <span className="text-red-500">*</span>
            </Label>
            <Input 
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                disabled={isReadOnly}
                required
                className="font-mono"
            />
        </div>

        {/* Details/Reason Field */}
        <div className="space-y-2">
            <Label htmlFor="details">
                Particulars / Details <span className="text-red-500">*</span>
            </Label>
            <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="E.g., Tuition fee for 1st Sem AY 2024-2025 OR Roundtrip bus fare to hometown..."
                disabled={isReadOnly}
                className="bg-white min-h-[80px]"
            />
        </div>

        {/* Receipt Upload */}
        <div className="space-y-2">
             <Label>Official Receipt / Assessment Form</Label>
             {isReadOnly ? (
                <FileDisplayReadOnly 
                   label=""
                   fileName={receipt ? receipt.name : "Submitted Receipt.pdf"}
                   className="bg-gray-50"
                />
             ) : (
                <FileUpload 
                   label=""
                   helperText="Upload clear scan of Official Receipt (OR) or Certificate of Assessment."
                   onChange={setReceipt}
                   value={receipt}
                   accept=".pdf,.jpg,.jpeg,.png"
                   required
                />
             )}
        </div>
      </div>
    </div>
  );
}