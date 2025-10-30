// ===== TEMPORARY FIX: src/types/supabase.ts =====
// Replace the content with this simplified version until you set up Supabase

export interface Database {
  public: {
    Tables: {
      scholars: {
        Row: {
          id: string;
          scholar_id: string;
          email: string;
          first_name: string;
          middle_name: string | null;
          surname: string;
          suffix: string | null;
          contact_number: string;
          date_of_birth: string;
          complete_address: string;
          province: string;
          scholarship_type: string;
          year_awarded: number;
          batch: number;
          university: string;
          program: string;
          year_level: string;
          status: string;
          profile_image: string | null;
          qr_code: string | null;
          curriculum_config: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          scholar_id: string;
          email: string;
          first_name: string;
          middle_name?: string | null;
          surname: string;
          suffix?: string | null;
          contact_number: string;
          date_of_birth: string;
          complete_address: string;
          province: string;
          scholarship_type: string;
          year_awarded: number;
          batch: number;
          university: string;
          program: string;
          year_level: string;
          status?: string;
          profile_image?: string | null;
          qr_code?: string | null;
          curriculum_config: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          scholar_id?: string;
          email?: string;
          first_name?: string;
          middle_name?: string | null;
          surname?: string;
          suffix?: string | null;
          contact_number?: string;
          date_of_birth?: string;
          complete_address?: string;
          province?: string;
          scholarship_type?: string;
          year_awarded?: number;
          batch?: number;
          university?: string;
          program?: string;
          year_level?: string;
          status?: string;
          profile_image?: string | null;
          qr_code?: string | null;
          curriculum_config?: any;
          updated_at?: string;
        };
      };
      grade_submissions: {
        Row: {
          id: string;
          scholar_id: string;
          year_level: string;
          semester: string;
          academic_year: string;
          registration_form: string;
          copy_of_grades: string;
          curriculum_file: string | null;
          status: string;
          admin_comment: string | null;
          date_submitted: string;
          date_processed: string | null;
        };
        Insert: {
          id?: string;
          scholar_id: string;
          year_level: string;
          semester: string;
          academic_year: string;
          registration_form: string;
          copy_of_grades: string;
          curriculum_file?: string | null;
          status?: string;
          admin_comment?: string | null;
          date_submitted?: string;
          date_processed?: string | null;
        };
        Update: {
          year_level?: string;
          semester?: string;
          academic_year?: string;
          registration_form?: string;
          copy_of_grades?: string;
          curriculum_file?: string | null;
          status?: string;
          admin_comment?: string | null;
          date_processed?: string | null;
        };
      };
      event_banners: {
        Row: {
          id: string;
          title: string;
          image_url: string;
          link: string;
          order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          image_url: string;
          link: string;
          order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          image_url?: string;
          link?: string;
          order?: number;
          is_active?: boolean;
        };
      };
      // Add more tables as needed...
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type Inserts<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];

export type Updates<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];