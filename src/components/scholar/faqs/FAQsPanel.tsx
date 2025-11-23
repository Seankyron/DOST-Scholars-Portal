'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import { SearchInput } from '@/components/shared/SearchInput';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { faqData } from '@/config/faqs';
import { FAQCategoryAccordion } from './FAQCategoryAccordion';
import { FAQItem } from './FAQItem';
import { HelpCircle, SearchX, Filter, ChevronDown, Check } from 'lucide-react';

export function FAQsPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter logic
  const filteredData = useMemo(() => {
    let result: typeof faqData = {} as any;

    // 1. Filter by Category first
    if (selectedCategory !== 'all') {
      if (selectedCategory in faqData) {
         // @ts-ignore
         result[selectedCategory] = faqData[selectedCategory as keyof typeof faqData];
      }
    } else {
      result = { ...faqData };
    }

    // 2. Filter by Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const searchResult: typeof faqData = {} as any;

      Object.entries(result).forEach(([category, items]) => {
        const filteredItems = items.filter(
          (item) =>
            item.question.toLowerCase().includes(lowerQuery) ||
            item.answer.toLowerCase().includes(lowerQuery)
        );

        if (filteredItems.length > 0) {
          // @ts-ignore
          searchResult[category] = filteredItems;
        }
      });
      result = searchResult;
    }

    return result;
  }, [searchQuery, selectedCategory]);

  const categories = Object.keys(filteredData);
  const hasResults = categories.length > 0;

  // Separate 'general' if it exists in the filtered results
  // @ts-ignore
  const generalFaqs = filteredData['general'];
  const showGeneralCard = generalFaqs && generalFaqs.length > 0;

  // Get remaining categories for the accordion
  const serviceCategories = categories.filter(c => c !== 'general');

  // Format category name for display
  const formatCategoryName = (key: string) => {
    if (key === 'general') return 'General Inquiries';
    return key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      
      {/* --- Search & Filter Toolbar --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="w-full md:flex-1">
           <SearchInput 
            onSearch={setSearchQuery} 
            placeholder="Search questions (e.g. 'grades', 'allowance')..."
            className="w-full"
          />
        </div>

        {/* Category Filter using DropdownMenu */}
        <div className="w-full md:w-[280px] flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400 hidden md:block shrink-0" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between bg-gray-50 border-gray-200 text-gray-700 font-normal hover:bg-gray-100 hover:text-gray-900"
                >
                  <span className="truncate">
                    {selectedCategory === 'all' ? 'All Categories' : formatCategoryName(selectedCategory)}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-2 opacity-50 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                <DropdownMenuItem 
                  onClick={() => setSelectedCategory('all')}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>All Categories</span>
                    {selectedCategory === 'all' && <Check className="h-4 w-4 text-dost-title" />}
                  </div>
                </DropdownMenuItem>
                
                {Object.keys(faqData).map((key) => (
                  <DropdownMenuItem 
                    key={key} 
                    onClick={() => setSelectedCategory(key)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{formatCategoryName(key)}</span>
                      {selectedCategory === key && <Check className="h-4 w-4 text-dost-title" />}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {!hasResults && (
         <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-lg border border-dashed border-gray-200">
            <SearchX className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No matching questions found</p>
            <p className="text-sm">Try adjusting your filters or search terms</p>
          </div>
      )}

      {/* --- 1. General Inquiries (Card View) --- */}
      {showGeneralCard && (
        <Card className="shadow-md bg-white border-none">
          <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
            <CardTitle className="text-lg font-bold text-dost-title flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-dost-title" />
              General Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
             <Accordion type="single" collapsible className="w-full space-y-2">
                {generalFaqs.map((faq: any, idx: number) => (
                    <FAQItem 
                        key={`general-${idx}`} 
                        itemKey={`general-${idx}`}
                        question={faq.question}
                        answer={faq.answer}
                    />
                ))}
             </Accordion>
          </CardContent>
        </Card>
      )}

      {/* --- 2. Service-Specific FAQs (Accordion View) --- */}
      {serviceCategories.length > 0 && (
        <Card className="shadow-md bg-white border-none">
            <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
                <CardTitle className="text-lg font-bold text-dost-title flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-dost-title" />
                Service FAQs
            </CardTitle>
            <p className="text-sm text-gray-500">
                Browse questions by service category.
            </p>
            </CardHeader>
            <CardContent className="p-0">
            <Accordion 
                type="multiple" 
                className="w-full"
                // If filtering by specific category (not 'all'), auto-open that category
                defaultValue={selectedCategory !== 'all' ? [selectedCategory] : undefined}
            >
                {serviceCategories.map((key) => (
                <FAQCategoryAccordion 
                    key={key} 
                    categoryKey={key} 
                    // @ts-ignore
                    faqs={filteredData[key as keyof typeof filteredData]} 
                />
                ))}
            </Accordion>
            </CardContent>
        </Card>
      )}
    </div>
  );
}