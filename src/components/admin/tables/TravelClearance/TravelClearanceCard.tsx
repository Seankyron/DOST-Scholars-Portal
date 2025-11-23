"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import type { TravelClearance } from "@/app/admin/travel-clearance/page";

interface Props {
  item: TravelClearance;
  onView: (item: TravelClearance) => void;
  onApprove?: (item: TravelClearance) => void;
  onReject?: (item: TravelClearance) => void;
}

export default function TravelClearanceCard({
  item,
  onView,
  onApprove,
  onReject,
}: Props) {
  return (
    <Card className="border rounded-xl">
      <CardContent className="p-5">

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg cursor-default">{item.name}</h3>
            <p className="text-sm text-gray-500 cursor-default">{item.course}</p>
          </div>

          <span
            className={`px-3 py-1 text-xs rounded-full cursor-default ${
              item.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : item.status === "Approved"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.status}
          </span>
        </div>

        <div className="mt-4 space-y-1 text-sm cursor-default">
          <p><strong>Purpose:</strong> {item.purpose}</p>
          <p><strong>Destination:</strong> {item.destination}</p>
          <p><strong>Arrival:</strong> {item.arrival}</p>
          <p><strong>Departure:</strong> {item.departure}</p>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="secondary"
            className="flex gap-2"
            onClick={() => onView(item)}
          >
            <Eye size={16} /> View
          </Button>

          {item.status === "Pending" && (
            <>
              <Button
                className="flex gap-2 bg-green-600 text-white hover:bg-green-700"
                onClick={() => onApprove?.(item)}
              >
                <CheckCircle size={16} /> Approve
              </Button>
              <Button
                className="flex gap-2 bg-red-600 text-white hover:bg-red-700"
                onClick={() => onReject?.(item)}
              >
                <XCircle size={16} /> Reject
              </Button>
            </>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
