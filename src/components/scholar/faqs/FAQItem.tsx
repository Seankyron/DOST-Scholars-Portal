'use client';

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  itemKey: string;
}

export function FAQItem({ question, answer, itemKey }: FAQItemProps) {
  return (
    <AccordionItem value={itemKey} className="border rounded-md bg-white mb-2 px-2 last:mb-0">
      <AccordionTrigger className="hover:no-underline px-4 py-3 text-left font-medium text-gray-700 hover:text-dost-title transition-colors">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-dost-blue shrink-0 mt-0.5" />
          <span>{question}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-12 pb-4 text-gray-600 leading-relaxed">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}