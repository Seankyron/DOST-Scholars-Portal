'use client';
import { useState } from 'react';
import ReplySlipHeader from '@/components/admin/practical-training/reply-slip/ReplySlipHeader';
import ReplySlipFilters from '@/components/admin/practical-training/reply-slip/ReplySlipFilters';
import ReplySlipTable from '@/components/admin/practical-training/reply-slip/ReplySlipTable';


export default function ReplySlipPage() {
    const [filters, setFilters] = useState({
        year: 'all',
        status: 'all',
        plan: 'all',
        search: '',
    });

    return (
        <div className="p-6 space-y-6 w-full">
            <ReplySlipHeader />

            <ReplySlipFilters filters={filters} setFilters={setFilters} />

            <ReplySlipTable 
                filters={filters} 
                setFilters={setFilters}
            />
        </div>
    );
}
