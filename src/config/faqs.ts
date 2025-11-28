// seankyron/dost-scholars-portal/DOST-Scholars-Portal-merge/src/config/faqs.ts

export const faqData = {
  general: [
    {
      question: 'What is the required academic load?',
      answer: 'Scholars must carry the full academic load prescribed by their university for regular students. Part-time enrollment is not allowed unless approved by DOST-SEI.',
    },
    {
      question: 'How can I update my personal information?',
      answer: 'You can update your contact information through your profile settings. For changes to your scholarship details (school, course), you need to submit a formal request through the Shifting/Transferring service.',
    },
  ],
  'grade-submission': [
    {
      question: 'When should I submit my grades?',
      answer: 'Grades must be submitted within 30 days after the end of each semester. Late submissions may result in delayed stipend release.',
    },
    {
      question: 'What documents are required for grade submission?',
      answer: 'You need to submit: (1) Certified True Copy of Grades from the Registrar, and (2) Certificate of Registration (Form 5) with registrar\'s seal and signature.',
    },
    {
      question: 'What if I have a failing grade?',
      answer: 'Submit your grades for evaluation. The consequences depend on your academic performance and will be assessed on a case-by-case basis. Multiple failures may lead to termination.',
    },
  ],
  'stipend-tracking': [
    {
      question: 'When will I receive my stipend?',
      answer: 'Stipends are released within 21 working days after your grades are approved. The exact timeline depends on fund availability and government accounting procedures.',
    },
    {
      question: 'What allowances am I entitled to?',
      answer: 'Regular allowances include monthly stipend, book allowance, and clothing allowance (1st sem of 1st year only). Additional allowances may include thesis allowance and graduation allowance.',
    },
    {
      question: 'Why is my stipend delayed?',
      answer: 'Delays usually occur due to: (1) Late submission of periodic reports, (2) Incomplete requirements, or (3) Processing queues at the regional office.',
    },
  ],
  'practical-training': [
    {
      question: 'Is the Practical Training Program mandatory?',
      answer: 'PTP is optional if your curriculum already includes OJT. You may also be exempted if required to enroll in summer subjects.',
    },
    {
      question: 'When should I apply for PTP?',
      answer: 'Submit your PTP Referral Letter application by the specified deadline (usually announced early in the year). Check the Events section for updates.',
    },
  ],
  'thesis-allowance': [
    {
      question: 'How much is the thesis allowance?',
      answer: 'The total thesis allowance is ₱10,000, released in two tranches: 90% (₱9,000) upon submission of abstract and approval sheet, and 10% (₱1,000) upon completion.',
    },
    {
      question: 'What are the requirements for 90% release?',
      answer: 'Submit: (1) One-page abstract of thesis proposal, (2) Approval sheet signed by thesis adviser, and (3) Certificate of Registration.',
    },
  ],
  'request-forms': [
    {
      question: 'What types of letters can I request?',
      answer: 'You can request Letters of Introduction, Endorsement Letters, Certifications of Scholarship Status, and Certificate of Good Moral Character (from DOST).',
    },
    {
      question: 'How long does it take to process requests?',
      answer: 'Standard processing time is 3-5 working days, depending on the availability of the signatories.',
    },
  ],
  'travel-clearance': [
    {
      question: 'How long does travel clearance processing take?',
      answer: 'Processing takes 5-10 business days upon receipt of complete requirements. Please file your request well in advance of your flight.',
    },
    {
      question: 'Can I travel without clearance?',
      answer: 'No. All scholars must obtain travel clearance before traveling abroad. Unauthorized travel may result in scholarship termination or hold-departure orders.',
    },
    {
      question: 'What documents do I need for a tourist travel clearance?',
      answer: 'You typically need a letter of intent, a deed of undertaking, and proof of travel duration/details.',
    },
  ],
  'shifting-transferring': [
    {
      question: 'How do I apply to shift courses?',
      answer: 'Submit a formal request letter, a copy of your grades, and the curriculum of the new course/school. Approval is subject to DOST-SEI guidelines (e.g., the new course must be a priority S&T course).',
    },
    {
      question: 'Can I transfer to any school?',
      answer: 'You may transfer to any DOST-accredited university or program. Transferring to a non-accredited program will result in scholarship termination.',
    },
  ],
  'reimbursement': [
    {
      question: 'What expenses are reimbursable?',
      answer: 'Reimbursable expenses typically include tuition fees (if not paid directly to the school), thesis expenses (up to the allowance limit), and approved transportation for official travel.',
    },
    {
      question: 'What is the deadline for reimbursement?',
      answer: 'Receipts must be submitted within the semester they were incurred. Late receipts may not be processed due to government auditing rules.',
    },
  ],
  'leave-of-absence': [
    {
      question: 'How long can I take a leave of absence?',
      answer: 'Maximum duration is one (1) academic year. The expiration date is immediately before the start of the ensuing semester. Extension beyond one year results in scholarship termination.',
    },
    {
      question: 'What are valid reasons for LOA?',
      answer: 'Valid reasons include health/medical issues, financial problems, or other personal circumstances. Supporting documents (e.g., Medical Certificate) are required.',
    },
  ],
  'support-feedback': [
    {
      question: 'How can I contact the scholarship unit?',
      answer: 'You can use the Support form to send a direct message or visit the regional office during business hours. See the Contact Us section for specific numbers.',
    },
    {
      question: 'Where can I report technical issues?',
      answer: 'Select "Technical Issue" in the Support & Feedback category form and describe the problem with screenshots if possible.',
    },
  ],
};

export const faqCategories = Object.keys(faqData);