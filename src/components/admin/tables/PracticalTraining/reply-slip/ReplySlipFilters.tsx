'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Check, X } from 'lucide-react';

interface ReplySlipFiltersProps {
    filters: {
        year: string;
        status: string;
        plan: string;
        search: string;
    };
    setFilters: (value: any) => void;
}

export default function ReplySlipFilters({ filters, setFilters }: any) {
    return (
        <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 font-medium">Training Years:</label>
                <select
                    className="border rounded-lg px-3 py-2"
                    value={filters.year}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                >
                    <option value="all">All Years</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                </select>
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-gray-600 font-medium">Status:</label>
                <select
                    className="border rounded-lg px-3 py-2"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-gray-600 font-medium">Plan:</label>
                <select
                    className="border rounded-lg px-3 py-2"
                    value={filters.plan}
                    onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
                >
                    <option value="all">All Plans</option>
                    <option value="undertake">Will Undertake</option>
                    <option value="cannot">Cannot Participate</option>
                </select>
            </div>

            <div className="flex flex-1 justify-end">
                <Input
                    placeholder="Search Scholars..."
                    className="max-w-xs"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
            </div>

            <div className="flex gap-2">
                <Button className="bg-green-500 hover:bg-green-600 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Verify
                </Button>

                <Button className="bg-red-500 hover:bg-red-600 flex items-center gap-2">
                    <X className="w-4 h-4" /> Reject
                </Button>
            </div>
        </div>
    );
}
