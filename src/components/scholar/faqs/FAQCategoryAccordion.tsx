'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { MessageCircleQuestion } from 'lucide-react';
import { FAQItem } from './FAQItem';

interface FAQCategoryAccordionProps {
  categoryKey: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

const formatTitle = (key: string) => {
  if (key === 'general') return 'General Inquiries';
  return key
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function FAQCategoryAccordion({ categoryKey, faqs }: FAQCategoryAccordionProps) {
  const title = formatTitle(categoryKey);

  if (faqs.length === 0) return null;

  return (
    <AccordionItem value={categoryKey} className="border-b border-gray-100 last:border-0">
      <AccordionTrigger 
        // 'data-[state=open]' classes ensure styles persist when the item is expanded
        className="hover:no-underline hover:bg-gray-50 data-[state=open]:bg-gray-50 px-6 py-4 group transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Icon Container: Styles persist on hover OR when open */}
          <div className="p-2 bg-blue-50 rounded-md text-dost-blue group-hover:bg-dost-title group-hover:text-white group-data-[state=open]:bg-dost-title group-data-[state=open]:text-white transition-colors">
            <MessageCircleQuestion className="h-5 w-5" />
          </div>
          <div className="text-left">
            {/* Title: Styles persist on hover OR when open */}
            <span className="block text-base font-semibold text-gray-800 group-hover:text-dost-title group-data-[state=open]:text-dost-title transition-colors">
              {title}
            </span>
            <span className="text-xs font-medium text-gray-500">
              {faqs.length} {faqs.length === 1 ? 'question' : 'questions'}
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6 pt-2 bg-gray-50/30">
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={`${categoryKey}-${index}`} 
              itemKey={`${categoryKey}-${index}`}
              question={faq.question} 
              answer={faq.answer} 
            />
          ))}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}