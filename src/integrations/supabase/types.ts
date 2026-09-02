export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      applications: {
        Row: {
          age_group: string | null;
          consent: boolean;
          created_at: string;
          email: string;
          experience: string | null;
          full_name: string;
          id: string;
          interests: string[];
          link: string | null;
          location: string | null;
          motivation: string | null;
          organisation: string | null;
          role: string;
          status: string;
        };
        Insert: {
          age_group?: string | null;
          consent?: boolean;
          created_at?: string;
          email: string;
          experience?: string | null;
          full_name: string;
          id?: string;
          interests?: string[];
          link?: string | null;
          location?: string | null;
          motivation?: string | null;
          organisation?: string | null;
          role: string;
          status?: string;
        };
        Update: {
          age_group?: string | null;
          consent?: boolean;
          created_at?: string;
          email?: string;
          experience?: string | null;
          full_name?: string;
          id?: string;
          interests?: string[];
          link?: string | null;
          location?: string | null;
          motivation?: string | null;
          organisation?: string | null;
          role?: string;
          status?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          status: string;
          topic: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          status?: string;
          topic: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          status?: string;
          topic?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          created_at: string;
          description: string | null;
          event_date: string | null;
          id: string;
          published: boolean;
          registration_link: string | null;
          speaker: string | null;
          speaker_note: string | null;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          event_date?: string | null;
          id?: string;
          published?: boolean;
          registration_link?: string | null;
          speaker?: string | null;
          speaker_note?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          event_date?: string | null;
          id?: string;
          published?: boolean;
          registration_link?: string | null;
          speaker?: string | null;
          speaker_note?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          source: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          source?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          source?: string;
        };
        Relationships: [];
      };
      opportunities: {
        Row: {
          audience: string;
          category: string;
          created_at: string;
          deadline: string | null;
          description: string | null;
          faqs: Json;
          featured: boolean;
          id: string;
          level: string;
          published: boolean;
          requirements: string[];
          slug: string;
          start_date: string | null;
          status: string;
          summary: string;
          timeline: string[];
          title: string;
          updated_at: string;
          what_you_do: string[];
          what_you_gain: string[];
          who_can_apply: string[];
        };
        Insert: {
          audience?: string;
          category: string;
          created_at?: string;
          deadline?: string | null;
          description?: string | null;
          faqs?: Json;
          featured?: boolean;
          id?: string;
          level?: string;
          published?: boolean;
          requirements?: string[];
          slug: string;
          start_date?: string | null;
          status?: string;
          summary: string;
          timeline?: string[];
          title: string;
          updated_at?: string;
          what_you_do?: string[];
          what_you_gain?: string[];
          who_can_apply?: string[];
        };
        Update: {
          audience?: string;
          category?: string;
          created_at?: string;
          deadline?: string | null;
          description?: string | null;
          faqs?: Json;
          featured?: boolean;
          id?: string;
          level?: string;
          published?: boolean;
          requirements?: string[];
          slug?: string;
          start_date?: string | null;
          status?: string;
          summary?: string;
          timeline?: string[];
          title?: string;
          updated_at?: string;
          what_you_do?: string[];
          what_you_gain?: string[];
          who_can_apply?: string[];
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string;
          grade: string | null;
          id: string;
          interests: string[];
          school: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string;
          grade?: string | null;
          id: string;
          interests?: string[];
          school?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string;
          grade?: string | null;
          id?: string;
          interests?: string[];
          school?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_submissions: {
        Row: {
          approved: boolean;
          category: string;
          consent: boolean;
          contact_email: string;
          created_at: string;
          description: string | null;
          id: string;
          link: string | null;
          published: boolean;
          stage: string;
          summary: string;
          team: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          approved?: boolean;
          category?: string;
          consent?: boolean;
          contact_email: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          link?: string | null;
          published?: boolean;
          stage?: string;
          summary: string;
          team?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          approved?: boolean;
          category?: string;
          consent?: boolean;
          contact_email?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          link?: string | null;
          published?: boolean;
          stage?: string;
          summary?: string;
          team?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      resources: {
        Row: {
          author: string | null;
          category: string;
          created_at: string;
          description: string | null;
          id: string;
          published: boolean;
          published_date: string | null;
          title: string;
          updated_at: string;
          url: string | null;
        };
        Insert: {
          author?: string | null;
          category: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          published?: boolean;
          published_date?: string | null;
          title: string;
          updated_at?: string;
          url?: string | null;
        };
        Update: {
          author?: string | null;
          category?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          published?: boolean;
          published_date?: string | null;
          title?: string;
          updated_at?: string;
          url?: string | null;
        };
        Relationships: [];
      };
      school_outreach_requests: {
        Row: {
          city: string | null;
          consent: boolean;
          contact_name: string;
          contact_role: string | null;
          created_at: string;
          email: string;
          id: string;
          message: string | null;
          phone: string | null;
          preferred_timeline: string | null;
          program_type: string;
          school_name: string;
          status: string;
          student_count: string | null;
        };
        Insert: {
          city?: string | null;
          consent?: boolean;
          contact_name: string;
          contact_role?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          message?: string | null;
          phone?: string | null;
          preferred_timeline?: string | null;
          program_type?: string;
          school_name: string;
          status?: string;
          student_count?: string | null;
        };
        Update: {
          city?: string | null;
          consent?: boolean;
          contact_name?: string;
          contact_role?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          message?: string | null;
          phone?: string | null;
          preferred_timeline?: string | null;
          program_type?: string;
          school_name?: string;
          status?: string;
          student_count?: string | null;
        };
        Relationships: [];
      };
      student_progress: {
        Row: {
          assignments_completed: number;
          assignments_total: number;
          attendance_percent: number;
          certificate_status: string;
          course: string;
          created_at: string;
          id: string;
          mentor_feedback: string | null;
          portfolio_url: string | null;
          project_progress: number;
          quiz_score: number;
          skills: string[];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          assignments_completed?: number;
          assignments_total?: number;
          attendance_percent?: number;
          certificate_status?: string;
          course?: string;
          created_at?: string;
          id?: string;
          mentor_feedback?: string | null;
          portfolio_url?: string | null;
          project_progress?: number;
          quiz_score?: number;
          skills?: string[];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          assignments_completed?: number;
          assignments_total?: number;
          attendance_percent?: number;
          certificate_status?: string;
          course?: string;
          created_at?: string;
          id?: string;
          mentor_feedback?: string | null;
          portfolio_url?: string | null;
          project_progress?: number;
          quiz_score?: number;
          skills?: string[];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      programs: {
        Row: {
          benefits: string[];
          category: string;
          created_at: string;
          cta_text: string;
          cta_url: string;
          date: string;
          details: string;
          featured: boolean;
          id: string;
          mode: string;
          price: string | null;
          speaker: Json | null;
          status: string;
          subtitle: string;
          time: string | null;
          title: string;
          updated_at: string;
          visibility: boolean;
        };
        Insert: {
          benefits?: string[];
          category?: string;
          created_at?: string;
          cta_text?: string;
          cta_url?: string;
          date: string;
          details?: string;
          featured?: boolean;
          id: string;
          mode?: string;
          price?: string | null;
          speaker?: Json | null;
          status?: string;
          subtitle?: string;
          time?: string | null;
          title: string;
          updated_at?: string;
          visibility?: boolean;
        };
        Update: {
          benefits?: string[];
          category?: string;
          created_at?: string;
          cta_text?: string;
          cta_url?: string;
          date?: string;
          details?: string;
          featured?: boolean;
          id?: string;
          mode?: string;
          price?: string | null;
          speaker?: Json | null;
          status?: string;
          subtitle?: string;
          time?: string | null;
          title?: string;
          updated_at?: string;
          visibility?: boolean;
        };
        Relationships: [];
      };
      past_sessions: {
        Row: {
          created_at: string;
          date: string;
          designation: string;
          id: string;
          participants: string;
          photo: string | null;
          speaker: string;
          speaker_linkedin: string | null;
          summary: string;
          topic: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          designation: string;
          id: string;
          participants?: string;
          photo?: string | null;
          speaker: string;
          speaker_linkedin?: string | null;
          summary?: string;
          topic?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          designation?: string;
          id?: string;
          participants?: string;
          photo?: string | null;
          speaker?: string;
          speaker_linkedin?: string | null;
          summary?: string;
          topic?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          author: Json;
          category: string;
          content: string;
          created_at: string;
          excerpt: string;
          featured: boolean;
          id: string;
          published: boolean;
          published_at: string;
          read_time: string;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          author?: Json;
          category?: string;
          content?: string;
          created_at?: string;
          excerpt?: string;
          featured?: boolean;
          id: string;
          published?: boolean;
          published_at: string;
          read_time?: string;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          author?: Json;
          category?: string;
          content?: string;
          created_at?: string;
          excerpt?: string;
          featured?: boolean;
          id?: string;
          published?: boolean;
          published_at?: string;
          read_time?: string;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      spotlights: {
        Row: {
          accomplishment: string;
          category: string;
          contribution_to_polaris: string | null;
          created_at: string;
          date: string;
          featured: boolean;
          headline: string;
          id: string;
          image: string;
          links: Json;
          name: string;
          story: string;
          updated_at: string;
        };
        Insert: {
          accomplishment?: string;
          category?: string;
          contribution_to_polaris?: string | null;
          created_at?: string;
          date?: string;
          featured?: boolean;
          headline?: string;
          id: string;
          image?: string;
          links?: Json;
          name: string;
          story?: string;
          updated_at?: string;
        };
        Update: {
          accomplishment?: string;
          category?: string;
          contribution_to_polaris?: string | null;
          created_at?: string;
          date?: string;
          featured?: boolean;
          headline?: string;
          id?: string;
          image?: string;
          links?: Json;
          name?: string;
          story?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
