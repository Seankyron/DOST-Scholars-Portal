export default function StatusBadge({ status }: any) {
    const styles: Record<string, string> = {
        approved: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || ''
                }`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
