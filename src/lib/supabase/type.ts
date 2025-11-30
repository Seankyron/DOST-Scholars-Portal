export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      Admin: {
        Row: {
          created_at: string
          id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          username?: string
        }
        Relationships: []
      }
      Event: {
        Row: {
          address_link: string
          created_at: string
          id: number
          image_file_key: string | null
          title: string
        }
        Insert: {
          address_link: string
          created_at?: string
          id?: number
          image_file_key?: string | null
          title: string
        }
        Update: {
          address_link?: string
          created_at?: string
          id?: number
          image_file_key?: string | null
          title?: string
        }
        Relationships: []
      }
      "Grade Submission": {
        Row: {
          comment: string | null
          cor_file_key: string | null
          created_at: string
          grade_file_key: string | null
          id: number
          semester: string
          spas_id: string
          status: string
          updated_at: string
          year_level: number
        }
        Insert: {
          comment?: string | null
          cor_file_key?: string | null
          created_at?: string
          grade_file_key?: string | null
          id?: number
          semester: string
          spas_id: string
          status: string
          updated_at: string
          year_level: number
        }
        Update: {
          comment?: string | null
          cor_file_key?: string | null
          created_at?: string
          grade_file_key?: string | null
          id?: number
          semester?: string
          spas_id?: string
          status?: string
          updated_at?: string
          year_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "Grade Submission_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "admin_scholar_view"
            referencedColumns: ["spas_id"]
          },
          {
            foreignKeyName: "Grade Submission_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          },
        ]
      }
      "Leave of Absence": {
        Row: {
          created_at: string
          id: number
          LOA_form_file_key: string | null
          required_document_file_key: Json | null
          spas_id: string
          type: string
          status: string
          comment: string
        }
        Insert: {
          created_at?: string
          id?: number
          LOA_form_file_key?: string | null
          required_document_file_key?: Json | null
          spas_id: string
          type: string
          status: string |null
          comment: string | null
        }
        Update: {
          created_at?: string
          id?: number
          LOA_form_file_key?: string | null
          required_document_file_key?: Json | null
          spas_id?: string
          type?: string
          status?: string |null
          comment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Leave of Absence_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "admin_scholar_view"
            referencedColumns: ["spas_id"]
          },
          {
            foreignKeyName: "Leave of Absence_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          },
        ]
      }
      "PTP Submission": {
        Row: {
          comment: string | null
          created_at: string
          dtr_file_key: string | null
          form_126_file_key: string | null
          form_127_file_key: string | null
          form_128_file_key: string | null
          grade_file_key: string | null
          id: number
          plan: string | null
          reply_slip_file_key: string | null
          spas_id: string | null
          status: string
          training_completion_file_key: string | null
          type: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          dtr_file_key?: string | null
          form_126_file_key?: string | null
          form_127_file_key?: string | null
          form_128_file_key?: string | null
          grade_file_key?: string | null
          id?: number
          plan?: string | null
          reply_slip_file_key?: string | null
          spas_id?: string | null
          status?: string
          training_completion_file_key?: string | null
          type: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          dtr_file_key?: string | null
          form_126_file_key?: string | null
          form_127_file_key?: string | null
          form_128_file_key?: string | null
          grade_file_key?: string | null
          id?: number
          plan?: string | null
          reply_slip_file_key?: string | null
          spas_id?: string | null
          status?: string
          training_completion_file_key?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "PTP Submission_grade_file_key_fkey"
            columns: ["grade_file_key"]
            isOneToOne: false
            referencedRelation: "Grade Submission"
            referencedColumns: ["grade_file_key"]
          },
          {
            foreignKeyName: "PTP Submission_grade_file_key_fkey"
            columns: ["grade_file_key"]
            isOneToOne: false
            referencedRelation: "GradeSubmissionView"
            referencedColumns: ["grade_file_key"]
          },
          {
            foreignKeyName: "PTP Submission_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "admin_scholar_view"
            referencedColumns: ["spas_id"]
          },
          {
            foreignKeyName: "PTP Submission_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          },
        ]
      }
      "Recent Activities": {
        Row: {
          activity: string
          created_at: string
          id: number
          spas_id: string
          status: string
          timestamps: string
        }
        Insert: {
          activity: string
          created_at?: string
          id?: number
          spas_id: string
          status: string
          timestamps: string
        }
        Update: {
          activity?: string
          created_at?: string
          id?: number
          spas_id?: string
          status?: string
          timestamps?: string
        }
        Relationships: [
          {
            foreignKeyName: "Recent Activities_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "admin_scholar_view"
            referencedColumns: ["spas_id"]
          },
          {
            foreignKeyName: "Recent Activities_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          },
        ]
      }
      Reimbursement: {
        Row: {
          created_at: string
          id: number
          reason: string | null
          receipt_file_key: string | null
          spas_id: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: number
          reason?: string | null
          receipt_file_key?: string | null
          spas_id: string
          type: string
        }
        Update: {
          created_at?: string
          id?: number
          reason?: string | null
          receipt_file_key?: string | null
          spas_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "Reimbursement_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "admin_scholar_view"
            referencedColumns: ["spas_id"]
          },
          {
            foreignKeyName: "Reimbursement_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          },
        ]
      }
      "Request Forms": {
        Row: {
          id: number
          reason: string
          requested_at: string
          requested_document: string
          spas_id: string
          status: string
          updated_at: string
          comment: string
        }
        Insert: {
          id?: number
          reason: string
          requested_at?: string
          requested_document: string
          spas_id: string
          status: string
          updated_at: string
          comment: string
        }
        Update: {
          id?: number
          reason?: string
          requested_at?: string
          requested_document?: string
          spas_id?: string
          status?: string
          updated_at?: string
          comment?: string 
        }
        Relationships: [
          {
            foreignKeyName: "Request Forms_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "admin_scholar_view"
            referencedColumns: ["spas_id"]
          },
          {
            foreignKeyName: "Request Forms_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          },
        ]
      }
      "Scholar Support and Feedback Mechanism": {
        Row: {
          created_at: string
          id: number
          reason: string
          spas_id: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: number
          reason: string
          spas_id: string
          type: string
        }
        Update: {
          created_at?: string
          id?: number
          reason?: string
          spas_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "Scholar Support and Feedback Mechanism_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "admin_scholar_view"
            referencedColumns: ["spas_id"]
          },
          {
            foreignKeyName: "Scholar Support and Feedback Mechanism_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          },
        ]
      }
      "Shifting Course": {
        Row: {
          accredited_sub_file_key: string | null
          admission_cert_file_key: string | null
          all_grades_file_key: string | null
          application_form_file_key: string | null
          approved_pos_file_key: string | null
          effectivity_of_shifting: string
          id: number
          new_course: string | null
          new_school: string | null
          new_year_level_file_key: string | null
          ojt: Json
          reason: string
          spas_id: string
          status: string
          comment: string
        }
        Insert: {
          accredited_sub_file_key?: string | null
          admission_cert_file_key?: string | null
          all_grades_file_key?: string | null
          application_form_file_key?: string | null
          approved_pos_file_key?: string | null
          effectivity_of_shifting: string
          id?: number
          new_course?: string | null
          new_school?: string | null
          new_year_level_file_key?: string | null
          ojt: Json
          reason: string
          spas_id: string
          status: string | null
          comment: string | null
        }
        Update: {
          accredited_sub_file_key?: string | null
          admission_cert_file_key?: string | null
          all_grades_file_key?: string | null
          application_form_file_key?: string | null
          approved_pos_file_key?: string | null
          effectivity_of_shifting?: string
          id?: number
          new_course?: string | null
          new_school?: string | null
          new_year_level_file_key?: string | null
          ojt?: Json
          reason?: string
          spas_id?: string
          status?: string | null
          comment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Shifting Course_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "admin_scholar_view"
            referencedColumns: ["spas_id"]
          },
          {
            foreignKeyName: "Shifting Course_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          },
        ]
      }
      "Stipend Tracking": {
        Row: {
          allowance_breakdown: Json[] | null
          created_at: string
          grade_submission_id: number | null
          id: number
          received: number
          semester: string
          spas_id: string
          status: string
          unreleased: number
          updated_at: string
          year_level: number
        }
        Insert: {
          allowance_breakdown?: Json[] | null
          created_at?: string
          grade_submission_id?: number | null
          id?: number
          received: number
          semester: string
          spas_id: string
          status: string
          unreleased: number
          updated_at?: string
          year_level: number
        }
        Update: {
          allowance_breakdown?: Json[] | null
          created_at?: string
          grade_submission_id?: number | null
          id?: number
          received?: number
          semester?: string
          spas_id?: string
          status?: string
          unreleased?: number
          updated_at?: string
          year_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "Stipend Tracking_grade_submission_id_fkey"
            columns: ["grade_submission_id"]
            isOneToOne: false
            referencedRelation: "Grade Submission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Stipend Tracking_grade_submission_id_fkey"
            columns: ["grade_submission_id"]
            isOneToOne: false
            referencedRelation: "GradeSubmissionView"
            referencedColumns: ["submission_id"]
          },
          {
            foreignKeyName: "Stipend Tracking_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "admin_scholar_view"
            referencedColumns: ["spas_id"]
          },
          {
            foreignKeyName: "Stipend Tracking_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          },
        ]
      }
      "Thesis Allowance": {
        Row: {
          abstract_thesis_file_key: string | null
          approval_file_key: string | null
          comment: string | null
          cor_file_key: string | null
          created_at: string
          final_thesis_file_key: string | null
          id: number
          spas_id: string
          status: string
          type: string | null
        }
        Insert: {
          abstract_thesis_file_key?: string | null
          approval_file_key?: string | null
          comment?: string | null
          cor_file_key?: string | null
          created_at?: string
          final_thesis_file_key?: string | null
          id?: number
          spas_id: string
          status: string
          type?: string | null
        }
        Update: {
          abstract_thesis_file_key?: string | null
          approval_file_key?: string | null
          comment?: string | null
          cor_file_key?: string | null
          created_at?: string
          final_thesis_file_key?: string | null
          id?: number
          spas_id?: string
          status?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Thesis Allowance_cor_file_key_fkey"
            columns: ["cor_file_key"]
            isOneToOne: false
            referencedRelation: "Grade Submission"
            referencedColumns: ["cor_file_key"]
          },
          {
            foreignKeyName: "Thesis Allowance_cor_file_key_fkey"
            columns: ["cor_file_key"]
            isOneToOne: false
            referencedRelation: "GradeSubmissionView"
            referencedColumns: ["cor_file_key"]
          },
          {
            foreignKeyName: "Thesis Allowance_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "admin_scholar_view"
            referencedColumns: ["spas_id"]
          },
          {
            foreignKeyName: "Thesis Allowance_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          },
        ]
      }
      "Travel Clearance": {
        Row: {
          arrival: string
          cause_of_submission_delay: string | null
          completed_request_form_file_key: string
          deed_of_undertaking_file_key: string | null
          departure: string
          destination: string | null
          employment_file_key: string | null
          guarantee_letter_file_key: string | null
          id: number
          request_letter_file_key: string
          requested_at: string
          spas_id: string
          status: string
          type: string | null
          updated_at: string
          valid_id_file_key: string | null
        }
        Insert: {
          arrival: string
          cause_of_submission_delay?: string | null
          completed_request_form_file_key: string
          deed_of_undertaking_file_key?: string | null
          departure: string
          destination?: string | null
          employment_file_key?: string | null
          guarantee_letter_file_key?: string | null
          id?: number
          request_letter_file_key: string
          requested_at: string
          spas_id: string
          status: string
          type?: string | null
          updated_at: string
          valid_id_file_key?: string | null
        }
        Update: {
          arrival?: string
          cause_of_submission_delay?: string | null
          completed_request_form_file_key?: string
          deed_of_undertaking_file_key?: string | null
          departure?: string
          destination?: string | null
          employment_file_key?: string | null
          guarantee_letter_file_key?: string | null
          id?: number
          request_letter_file_key?: string
          requested_at?: string
          spas_id?: string
          status?: string
          type?: string | null
          updated_at?: string
          valid_id_file_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Travel Clearance_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "admin_scholar_view"
            referencedColumns: ["spas_id"]
          },
          {
            foreignKeyName: "Travel Clearance_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          },
        ]
      }
      User: {
        Row: {
          address: string | null
          contact_number: string
          course_duration: number
          created_at: string
          curriculum_file_key: string | null
          date_of_birth: string
          email: string
          first_name: string
          id: string
          is_verified: boolean
          last_name: string
          middle_name: string | null
          midyear_classes: number[] | null
          municipality_city: string | null
          ojt: Json
          program_course: string
          province: string
          scholarship_status: string
          scholarship_type: string
          spas_id: string
          suffix: string | null
          thesis_year: number
          university: string
          year_awarded: string
        }
        Insert: {
          address?: string | null
          contact_number: string
          course_duration: number
          created_at?: string
          curriculum_file_key?: string | null
          date_of_birth: string
          email: string
          first_name: string
          id?: string
          is_verified?: boolean
          last_name: string
          middle_name?: string | null
          midyear_classes?: number[] | null
          municipality_city?: string | null
          ojt: Json
          program_course: string
          province: string
          scholarship_status: string
          scholarship_type: string
          spas_id: string
          suffix?: string | null
          thesis_year: number
          university: string
          year_awarded: string
        }
        Update: {
          address?: string | null
          contact_number?: string
          course_duration?: number
          created_at?: string
          curriculum_file_key?: string | null
          date_of_birth?: string
          email?: string
          first_name?: string
          id?: string
          is_verified?: boolean
          last_name?: string
          middle_name?: string | null
          midyear_classes?: number[] | null
          municipality_city?: string | null
          ojt?: Json
          program_course?: string
          province?: string
          scholarship_status?: string
          scholarship_type?: string
          spas_id?: string
          suffix?: string | null
          thesis_year?: number
          university?: string
          year_awarded?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_scholar_view: {
        Row: {
          address: string | null
          contact_number: string | null
          course_duration: number | null
          created_at: string | null
          current_scholar_year: number | null
          curriculum_file_key: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string | null
          is_verified: boolean | null
          last_name: string | null
          middle_name: string | null
          midyear_classes: number[] | null
          municipality_city: string | null
          ojt: Json | null
          program_course: string | null
          province: string | null
          scholarship_status: string | null
          scholarship_type: string | null
          spas_id: string | null
          suffix: string | null
          thesis_year: number | null
          university: string | null
          year_awarded: string | null
        }
        Insert: {
          address?: string | null
          contact_number?: string | null
          course_duration?: number | null
          created_at?: string | null
          current_scholar_year?: never
          curriculum_file_key?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: never
          id?: string | null
          is_verified?: boolean | null
          last_name?: string | null
          middle_name?: string | null
          midyear_classes?: number[] | null
          municipality_city?: string | null
          ojt?: Json | null
          program_course?: string | null
          province?: string | null
          scholarship_status?: string | null
          scholarship_type?: string | null
          spas_id?: string | null
          suffix?: string | null
          thesis_year?: number | null
          university?: string | null
          year_awarded?: string | null
        }
        Update: {
          address?: string | null
          contact_number?: string | null
          course_duration?: number | null
          created_at?: string | null
          current_scholar_year?: never
          curriculum_file_key?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: never
          id?: string | null
          is_verified?: boolean | null
          last_name?: string | null
          middle_name?: string | null
          midyear_classes?: number[] | null
          municipality_city?: string | null
          ojt?: Json | null
          program_course?: string | null
          province?: string | null
          scholarship_status?: string | null
          scholarship_type?: string | null
          spas_id?: string | null
          suffix?: string | null
          thesis_year?: number | null
          university?: string | null
          year_awarded?: string | null
        }
        Relationships: []
      }

      ptp_view: {
        Row: {
          ptp_id: number | null
          ptp_created_at: string | null
          spas_id: string | null
          full_name: string | null
          email: string | null
          contact_number: string | null
          scholarship_type: string | null
          year_awarded: string | null
          university: string | null
          address: string | null
          program_course: string | null

          dtr_file_key: string | null
          form_126_file_key: string | null
          form_127_file_key: string | null
          form_128_file_key: string | null
          training_completion_file_key: string | null
          ptp_status: string | null
          ptp_comment: string | null
          ptp_plan: string | null
          grade_file_key: string | null
          reply_slip_file_key: string | null
          ptp_type: string | null
        }

        Insert: never
        Update: never

        Relationships: [
          {
            foreignKeyName: "PTP Submission_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          }
        ]
      }

      GradeSubmissionView: {
        Row: {
          academic_year: string | null
          batch: string | null
          comment: string | null
          complete_address: string | null
          contact_number: string | null
          cor_file_key: string | null
          curriculum_file_key: string | null
          date_of_birth: string | null
          grade_file_key: string | null
          program: string | null
          scholar_name: string | null
          scholar_status: string | null
          scholarship_type: string | null
          semester: string | null
          spas_id: string | null
          submission_id: number | null
          submission_status: string | null
          university: string | null
          updated_at: string | null
          year_level: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Grade Submission_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "admin_scholar_view"
            referencedColumns: ["spas_id"]
          },
          {
            foreignKeyName: "Grade Submission_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          },
        ]
      }

      shifting_view: {
        Row: {
          id: number | null
          spas_id: string | null
          full_name: string | null
          email: string | null
          contact_number: string | null
          university: string | null
          program_course: string | null
          scholarship_type: string | null
          year_awarded: string | null
          address: string | null

          new_course: string | null
          new_school: string | null
          effectivity_of_shifting: string | null
          ojt: Json | null
          reason: string | null
          application_form_file_key: string | null
          admission_cert_file_key: string | null
          accredited_sub_file_key: string | null
          new_year_level_file_key: string | null
          all_grades_file_key: string | null
          approved_pos_file_key: string | null
          type: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: never
        Update: never
        Relationships: [
          {
            foreignKeyName: "Shifting Course_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          }
        ]
      }
      loa_view: {
        Row: {
          id: number | null
          spas_id: string | null
          full_name: string | null
          email: string | null
          contact_number: string | null
          university: string | null
          program_course: string | null
          scholarship_type: string | null
          year_awarded: string | null
          address: string | null

          type: string | null
          LOA_form_file_key: string | null
          required_document_file_key: Json | null
          created_at: string | null
          updated_at: string | null
          status: string | null
          semester: string | null
          academic_year: string | null
          duration: string | null
          reason: string | null
          comment: string | null
        }

        Insert: never
        Update: never

        Relationships: [
          {
            foreignKeyName: "Leave of Absence_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          }
        ]
      }
      reimbursement_view: {
        Row: {
          id: number | null
          spas_id: string | null
          full_name: string | null
          email: string | null
          contact_number: string | null
          university: string | null
          program_course: string | null
          scholarship_type: string | null
          year_awarded: string | null
          address: string | null

          type: string | null
          reason: string | null
          receipt_file_key: string | null
          amount: number | null
          created_at: string | null
          updated_at: string | null
          status: string | null
        }

        Insert: never
        Update: never

        Relationships: [
          {
            foreignKeyName: "Reimbursement_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          }
        ]
      }
      request_view: {
        Row: {
          id: number | null
          spas_id: string | null
          full_name: string | null
          email: string | null
          contact_number: string | null
          university: string | null
          program_course: string | null
          scholarship_type: string | null
          year_awarded: string | null
          address: string | null

          requested_document: string | null
          requested_at: string | null
          updated_at: string | null
          reason: string | null
          status: string | null
        }

        Insert: never
        Update: never

        Relationships: [
          {
            foreignKeyName: "Request Forms_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          }
        ]
      }
      thesis_view: {
        Row: {
          thesis_id: number | null
          submitted_at: string | null
          spas_id: string | null
          full_name: string | null
          email: string | null
          contact_number: string | null
          scholarship_type: string | null
          year_awarded: string | null
          university: string | null
          program_course: string | null

          abstract_thesis_file_key: string | null
          approval_file_key: string | null
          final_thesis_file_key: string | null
          cor_file_key: string | null
          status: string | null
          comment: string | null
          type: string | null
        }

        Insert: never
        Update: never

        Relationships: [
          {
            foreignKeyName: "Thesis Allowance_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          }
        ]
      }
      feedback_view: {
        Row: {
            id: number | null
            created_at: string | null
            spas_id: string | null

            full_name: string | null
            email: string | null
            contact_number: string | null
            scholarship_type: string | null
            year_awarded: number | null
            university: string | null
            program_course: string | null

            type: string | null
            reason: string | null
            comment: string | null
            status: string | null
            attachment: string | null

            duration_days: number | null
        }

        Insert: never
        Update: never

        Relationships: [
            {
            foreignKeyName: "Scholar Support and Feedback Mechanism_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
            }
        ]
        }

      travel_view: {
        Row: {
          id: number | null
          spas_id: string | null
          full_name: string | null
          email: string | null
          contact_number: string | null
          university: string | null
          program_course: string | null
          scholarship_type: string | null
          year_awarded: string | null
          address: string | null

          departure: string | null
          arrival: string | null
          request_letter_file_key: string | null
          guarantee_letter_file_key: string | null
          completed_request_form_file_key: string | null
          cause_of_submission_delay: string | null
          requested_at: string | null
          updated_at: string | null
          status: string | null
          deed_of_undertaking_file_key: string | null
          employment_file_key: string | null
          valid_id_file_key: string | null
          type: string | null
          destination: string | null
          comment: string | null
        }

        Insert: never
        Update: never

        Relationships: [
          {
            foreignKeyName: "Travel Clearance_spas_id_fkey"
            columns: ["spas_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["spas_id"]
          }
        ]
      }

    }
    Functions: {
      "admin-dashboard-stats": { Args: never; Returns: Json }
      "admin-update-stipend": {
        Args: {
          p_released: number
          p_semester: number
          p_spas_id: string
          p_stipend_type: string
          p_year_level: number
        }
        Returns: boolean
      }
      "export-report": {
        Args: { p_filters: string; p_table_name: string }
        Returns: Json
      }
      "handle-submission-approval": {
        Args: {
          p_comment: string
          p_status: string
          p_submission_id: number
          p_table: string
        }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      update_ongoing_semester_availability: { Args: never; Returns: undefined }
      verify_scholar: {
        Args: { user_id_to_verify: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const