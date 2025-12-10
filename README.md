# DOST-SEI CALABARZON Scholars Portal

The **DOST-SEI CALABARZON Scholars Portal** is the official web platform designed to streamline the management of scholarship requirements, benefits, and services for DOST-SEI scholars in the CALABARZON region.

It serves as a centralized hub for scholars to submit documents, track stipends, and request clearances, while providing administrators with tools to verify accounts, monitor scholar status, and generate reports.

## 🚀 Features

### 🎓 Scholar Portal
Scholars can access a personalized dashboard to manage their scholarship lifecycle:
* **Grade Submission:** Upload registration forms and grades for every semester.
* **Stipend Tracking:** Monitor the status of stipend releases and breakdown of allowances.
* **Practical Training Program (PTP):** Request referral letters and submit completion documents.
* **Thesis Allowance:** Apply for thesis grants (90%, 10%, or full release) with required deliverables.
* **Travel Clearance:** Apply for clearance for travel abroad (Official Business or Personal).
* **Shifting & Transferring:** Process applications for course shifting or school transferring.
* **Reimbursements:** Submit requests for tuition or other reimbursable expenses.
* **Leave of Absence (LOA):** File for LOA due to health, personal, or exchange student reasons.
* **Document Requests:** Request certifications and endorsements.
* **Directories & Downloadables:** Access regional contacts and scholarship forms.

### 🛡️ Admin Portal
A comprehensive backend for DOST staff to manage the program:
* **Dashboard:** Real-time analytics on scholar demographics, status distribution, and financial releases.
* **Scholar Management:** Full CRUD capabilities for scholar profiles, history tracking, and status updates (Active, Suspended, Graduated, etc.).
* **Verification System:** Verify newly registered scholar accounts against master lists.
* **Service Processing:** Review, approve, reject, or request resubmission for all scholar applications (Grades, PTP, Clearance, etc.).
* **Event Management:** Manage portal banners and announcements.

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
* **Animation:** [Framer Motion](https://www.framer.com/motion/)
* **Backend & Auth:** [Supabase](https://supabase.com/)
* **Forms:** React Hook Form & Zod
* **Icons:** Lucide React
## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/seankyron/dost-scholars-portal.git](https://github.com/seankyron/dost-scholars-portal.git)
    cd dost-scholars-portal
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Access the application**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

