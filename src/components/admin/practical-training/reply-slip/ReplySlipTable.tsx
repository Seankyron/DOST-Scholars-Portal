import { useState } from 'react';

import ReplySlipRow from './ReplySlipRow';
import { ReferralLetterModal } from './ReferralLetterModal';

const MOCK_DATA = [
    {
        name: 'Andrea Villanueva',
        type: 'RA 7687',
        university: 'Cavite State University - Indang',
        year: 2025,
        status: 'approved',
        plan: 'I will undertake 2025 PT Program',
    },
    {
        name: 'Jericho Dela Cruz',
        type: 'Merit',
        university: 'University of the Philippines - Los Baños',
        year: 2025,
        status: 'pending',
        plan: 'I cannot participate in the program',
    },
    {
        name: 'Aldrich Arenas',
        type: 'RA 7687',
        university: 'Batangas State University - Main',
        year: 2025,
        status: 'approved',
        plan: 'I have required OJT during the summer term',
    },
];

export default function ReplySlipTable() {

    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (row: any) => {
        const modalData = {
            scholarInfo: {
                name: row.name,
                contact: "N/A",
                dob: "N/A",
                address: "N/A",
            },
            placement: {
                scholarshipType: row.type,
                batch: "2025",
                university: row.university,
                program: "Undeclared",
            },
            submission: {
                yearSem: "1st Sem",
                academicYear: "2024–2025",
                dateSubmitted: "N/A",
                plan: row.plan,
                replySlip: "reply-slip.pdf",
                curriculum: "curriculum.pdf",
            }
        };

        setSelectedRow(modalData);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    return (
        <div className="bg-white shadow-md rounded-lg mt-6">

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th></th>
                            <th>Scholar</th>
                            <th>Type</th>
                            <th>University</th>
                            <th>Training Year</th>
                            <th>Status</th>
                            <th>Plan</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {MOCK_DATA.map((row, i) => (
                            <ReplySlipRow
                                key={i}
                                row={row}
                                onView={() => handleOpenModal(row)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            <ReferralLetterModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                data={selectedRow}
            />
        </div>
    );
}
