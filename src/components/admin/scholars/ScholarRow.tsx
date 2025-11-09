'use client';

import { Eye, Pencil, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { ScholarStatus } from '@/types/scholar';

export interface Scholar {
    id: string;
    name: string;
    scholarId: string;
    scholarshipType: string;
    university: string;
    yearLevel: string;
    program: string;
    status: ScholarStatus;
    email: string;
    profileImage: string;
}

interface ScholarRowProps {
    scholar: Scholar;
    onView: (scholar: Scholar) => void;
    onEdit: (scholar: Scholar) => void;
    onHistory: (scholar: Scholar) => void;
}

export function ScholarRow({ scholar, onView, onEdit, onHistory }: ScholarRowProps) {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{scholar.name}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{scholar.scholarId}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{scholar.scholarshipType}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{scholar.university}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{scholar.yearLevel}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{scholar.program}</td>
            <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={scholar.status} /></td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{scholar.email}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                <Button variant="outline" size="sm" className="w-8 h-8 p-0" onClick={() => onView(scholar)} title="View">
                    <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0" onClick={() => onEdit(scholar)} title="Edit">
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0" onClick={() => onHistory(scholar)} title="History">
                    <History className="h-4 w-4" />
                </Button>
            </td>
        </tr>
    );
}
