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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      board_applications: {
        Row: {
          ack_queued: boolean
          created_at: string
          data: Json
          email: string
          full_name: string
          id: string
          idempotency_key: string | null
          ip_hash: string | null
          notification_queued: boolean
          reference_id: string
          seat_interest: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          ack_queued?: boolean
          created_at?: string
          data: Json
          email: string
          full_name: string
          id?: string
          idempotency_key?: string | null
          ip_hash?: string | null
          notification_queued?: boolean
          reference_id: string
          seat_interest?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          ack_queued?: boolean
          created_at?: string
          data?: Json
          email?: string
          full_name?: string
          id?: string
          idempotency_key?: string | null
          ip_hash?: string | null
          notification_queued?: boolean
          reference_id?: string
          seat_interest?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          ack_queued: boolean
          created_at: string
          email: string
          email_queued: boolean
          id: string
          idempotency_key: string | null
          ip_hash: string | null
          message: string
          name: string
          notification_queued: boolean
          reference_id: string
          subject: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          ack_queued?: boolean
          created_at?: string
          email: string
          email_queued?: boolean
          id?: string
          idempotency_key?: string | null
          ip_hash?: string | null
          message: string
          name: string
          notification_queued?: boolean
          reference_id: string
          subject: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          ack_queued?: boolean
          created_at?: string
          email?: string
          email_queued?: boolean
          id?: string
          idempotency_key?: string | null
          ip_hash?: string | null
          message?: string
          name?: string
          notification_queued?: boolean
          reference_id?: string
          subject?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          ack_queued: boolean
          created_at: string
          email: string
          email_queued: boolean
          id: string
          idempotency_key: string | null
          ip_hash: string | null
          notification_queued: boolean
          reference_id: string
          unsubscribed_at: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          ack_queued?: boolean
          created_at?: string
          email: string
          email_queued?: boolean
          id?: string
          idempotency_key?: string | null
          ip_hash?: string | null
          notification_queued?: boolean
          reference_id: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          ack_queued?: boolean
          created_at?: string
          email?: string
          email_queued?: boolean
          id?: string
          idempotency_key?: string | null
          ip_hash?: string | null
          notification_queued?: boolean
          reference_id?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      sponsorship_applications: {
        Row: {
          ack_queued: boolean
          created_at: string
          data: Json
          email: string
          email_queued: boolean
          id: string
          idempotency_key: string | null
          ip_hash: string | null
          language: string | null
          notification_queued: boolean
          organization_name: string | null
          reference_id: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          ack_queued?: boolean
          created_at?: string
          data: Json
          email: string
          email_queued?: boolean
          id?: string
          idempotency_key?: string | null
          ip_hash?: string | null
          language?: string | null
          notification_queued?: boolean
          organization_name?: string | null
          reference_id: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          ack_queued?: boolean
          created_at?: string
          data?: Json
          email?: string
          email_queued?: boolean
          id?: string
          idempotency_key?: string | null
          ip_hash?: string | null
          language?: string | null
          notification_queued?: boolean
          organization_name?: string | null
          reference_id?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      submission_events: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          form_type: string
          id: string
          ip_hash: string | null
          reference_id: string | null
          submission_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          form_type: string
          id?: string
          ip_hash?: string | null
          reference_id?: string | null
          submission_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          form_type?: string
          id?: string
          ip_hash?: string | null
          reference_id?: string | null
          submission_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      volunteer_applications: {
        Row: {
          ack_queued: boolean
          created_at: string
          data: Json
          email: string
          email_queued: boolean
          full_name: string
          id: string
          idempotency_key: string | null
          ip_hash: string | null
          notification_queued: boolean
          position: string | null
          reference_id: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          ack_queued?: boolean
          created_at?: string
          data: Json
          email: string
          email_queued?: boolean
          full_name: string
          id?: string
          idempotency_key?: string | null
          ip_hash?: string | null
          notification_queued?: boolean
          position?: string | null
          reference_id: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          ack_queued?: boolean
          created_at?: string
          data?: Json
          email?: string
          email_queued?: boolean
          full_name?: string
          id?: string
          idempotency_key?: string | null
          ip_hash?: string | null
          notification_queued?: boolean
          position?: string | null
          reference_id?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
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
