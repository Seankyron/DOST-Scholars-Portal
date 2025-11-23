// src/components/admin/practical-training/badges/TypeBadge.tsx
interface TypeBadgeProps {
  type: string;
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  // Choose color based on type
  const colorClasses =
    type === 'RA 7687'
      ? 'bg-green-100 text-green-700'
      : type === 'Merit'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-gray-100 text-gray-700';

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${colorClasses}`}>
      {type}
    </span>
  );
}
