'use client';


import { useState } from 'react';
import PTPCompletionHeader from '@/components/admin/tables/PracticalTraining/ptp-completion/PTPCompletionHeader';
import PTPCompletionFilters from '@/components/admin/tables/PracticalTraining/ptp-completion/PTPCompletionFilters';
import PTPCompletionTable from '@/components/admin/tables/PracticalTraining/ptp-completion/PTPCompletionTable';


export default function PTPCompletionPage() {
const [filters, setFilters] = useState({
year: 'all',
status: 'all',
plan: 'all',
search: '',
});


return (
<div className="p-6 space-y-6 w-full">
<PTPCompletionHeader />


<PTPCompletionFilters filters={filters} setFilters={setFilters} />


<PTPCompletionTable 
  filters={filters} 
  setFilters={setFilters}
/>
</div>
);
}