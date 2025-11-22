"use client";

import { useState } from "react";
import TravelClearanceFilters from "@/components/admin/travel-clearance/TravelClearanceFilters";
import TravelClearanceList from "@/components/admin/travel-clearance/TravelClearanceList";
import TravelClearanceModal from "@/components/admin/travel-clearance/TravelClearanceModal";

export interface TravelClearance {
  id: number;
  name: string;
  course: string;
  status: "Pending" | "Approved" | "Rejected";
  purpose: string;
  destination: string;
  arrival: string;
  departure: string;
}

export default function TravelClearancePage() {
  const [status, setStatus] = useState("All");
  const [purpose, setPurpose] = useState("All");

  const [selected, setSelected] = useState<TravelClearance | null>(null);
  const [showModal, setShowModal] = useState(false);

  const data: TravelClearance[] = [
    {
      id: 1,
      name: "Aldrich Amiel Arenas",
      course: "BS Computer Science",
      status: "Pending",
      purpose: "Official Business Travel",
      destination: "Hong Kong",
      arrival: "February 10, 2025",
      departure: "March 20, 2025",
    },
    {
      id: 2,
      name: "Aiah Arceta",
      course: "BS Aeronautical Engineering",
      status: "Approved",
      purpose: "Other",
      destination: "Brunei",
      arrival: "January 16, 2025",
      departure: "February 14, 2025",
    },
  ];

  const handleView = (item: TravelClearance) => {
    setSelected(item);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Travel Clearance</h1>

      <TravelClearanceFilters
        onStatusChange={setStatus}
        onPurposeChange={setPurpose}
      />

      <TravelClearanceList
        data={data}
        onView={handleView}
      />

      {selected && (
  <TravelClearanceModal
    isOpen={showModal}
    onClose={() => setShowModal(false)}
    data={{
      scholarName: selected.name,
      contactNumber: "N/A",
      dob: "N/A",
      address: "N/A",

      scholarshipType: "N/A",
      batchYear: "N/A",
      school: "N/A",
      program: selected.course,

      destination: selected.destination,
      arrival: selected.arrival,

      requestLetter: undefined,
      causeOfDelay: undefined,
      guaranteeLetter: undefined,
      completedForm: undefined,
    }}
  />
)}

    </div>
  );
}
