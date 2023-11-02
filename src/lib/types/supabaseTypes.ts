export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      _AutoGalleryToAutoGalleryCategory: {
        Row: {
          A: string
          B: number
        }
        Insert: {
          A: string
          B: number
        }
        Update: {
          A?: string
          B?: number
        }
        Relationships: [
          {
            foreignKeyName: "_AutoGalleryToAutoGalleryCategory_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "AutoGallery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_AutoGalleryToAutoGalleryCategory_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "AutoGalleryCategory"
            referencedColumns: ["id"]
          }
        ]
      }
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "AutoGalleryAgent"
            referencedColumns: ["id"]
          }
        ]
      }
      ActivationToken: {
        Row: {
          activatedAt: string | null
          agent_id: string
          createdAt: string
          id: string
          updatedAt: string
          verifyToken: string
        }
        Insert: {
          activatedAt?: string | null
          agent_id: string
          createdAt?: string
          id: string
          updatedAt: string
          verifyToken: string
        }
        Update: {
          activatedAt?: string | null
          agent_id?: string
          createdAt?: string
          id?: string
          updatedAt?: string
          verifyToken?: string
        }
        Relationships: [
          {
            foreignKeyName: "ActivationToken_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "AutoGalleryAgent"
            referencedColumns: ["id"]
          }
        ]
      }
      AutoGallery: {
        Row: {
          address: string
          agent_id: string
          city_id: number
          createdAt: string
          id: string
          is_verified: boolean
          name: string
          updatedAt: string
        }
        Insert: {
          address: string
          agent_id: string
          city_id: number
          createdAt?: string
          id: string
          is_verified?: boolean
          name: string
          updatedAt: string
        }
        Update: {
          address?: string
          agent_id?: string
          city_id?: number
          createdAt?: string
          id?: string
          is_verified?: boolean
          name?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "AutoGallery_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "AutoGalleryAgent"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AutoGallery_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "City"
            referencedColumns: ["id"]
          }
        ]
      }
      AutoGalleryAgent: {
        Row: {
          email: string
          firstName: string | null
          id: string
          is_profile_complete: boolean
          is_subscribed: boolean
          is_verified: boolean
          join_date: string
          lastName: string | null
          password: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["Role"]
          updatedAt: string
        }
        Insert: {
          email: string
          firstName?: string | null
          id: string
          is_profile_complete?: boolean
          is_subscribed?: boolean
          is_verified?: boolean
          join_date?: string
          lastName?: string | null
          password?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["Role"]
          updatedAt: string
        }
        Update: {
          email?: string
          firstName?: string | null
          id?: string
          is_profile_complete?: boolean
          is_subscribed?: boolean
          is_verified?: boolean
          join_date?: string
          lastName?: string | null
          password?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["Role"]
          updatedAt?: string
        }
        Relationships: []
      }
      AutoGalleryCategory: {
        Row: {
          abbreviation: string | null
          category: string
          id: number
        }
        Insert: {
          abbreviation?: string | null
          category: string
          id?: number
        }
        Update: {
          abbreviation?: string | null
          category?: string
          id?: number
        }
        Relationships: []
      }
      Car: {
        Row: {
          brand: string
          buid_year: number
          createdAt: string
          description: string
          gallery_id: string
          id: string
          is_published: boolean
          model: string
          title: string
          updatedAt: string
        }
        Insert: {
          brand: string
          buid_year: number
          createdAt?: string
          description: string
          gallery_id: string
          id: string
          is_published?: boolean
          model: string
          title: string
          updatedAt: string
        }
        Update: {
          brand?: string
          buid_year?: number
          createdAt?: string
          description?: string
          gallery_id?: string
          id?: string
          is_published?: boolean
          model?: string
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Car_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "AutoGallery"
            referencedColumns: ["id"]
          }
        ]
      }
      City: {
        Row: {
          id: number
          latitude: number
          longitude: number
          name_en: string
          name_fa: string
          province_id: number
          slug: string
        }
        Insert: {
          id: number
          latitude: number
          longitude: number
          name_en: string
          name_fa: string
          province_id: number
          slug: string
        }
        Update: {
          id?: number
          latitude?: number
          longitude?: number
          name_en?: string
          name_fa?: string
          province_id?: number
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "City_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "Province"
            referencedColumns: ["id"]
          }
        ]
      }
      Image: {
        Row: {
          agent_id: string | null
          car_id: string | null
          createdAt: string
          gallery_id: string | null
          id: string
          updatedAt: string
          url: string
        }
        Insert: {
          agent_id?: string | null
          car_id?: string | null
          createdAt?: string
          gallery_id?: string | null
          id: string
          updatedAt: string
          url: string
        }
        Update: {
          agent_id?: string | null
          car_id?: string | null
          createdAt?: string
          gallery_id?: string | null
          id?: string
          updatedAt?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "Image_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "AutoGalleryAgent"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Image_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "Car"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Image_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "AutoGallery"
            referencedColumns: ["id"]
          }
        ]
      }
      PhoneNumber: {
        Row: {
          gallery_id: string | null
          id: string
          number: string
        }
        Insert: {
          gallery_id?: string | null
          id: string
          number: string
        }
        Update: {
          gallery_id?: string | null
          id?: string
          number?: string
        }
        Relationships: [
          {
            foreignKeyName: "PhoneNumber_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "AutoGallery"
            referencedColumns: ["id"]
          }
        ]
      }
      Province: {
        Row: {
          id: number
          latitude: number
          longitude: number
          name_en: string
          name_fa: string
          slug: string
        }
        Insert: {
          id: number
          latitude: number
          longitude: number
          name_en: string
          name_fa: string
          slug: string
        }
        Update: {
          id?: number
          latitude?: number
          longitude?: number
          name_en?: string
          name_fa?: string
          slug?: string
        }
        Relationships: []
      }
      RentCar: {
        Row: {
          car_id: string
          id: string
          price_per_day: number | null
          price_per_hour: number | null
        }
        Insert: {
          car_id: string
          id: string
          price_per_day?: number | null
          price_per_hour?: number | null
        }
        Update: {
          car_id?: string
          id?: string
          price_per_day?: number | null
          price_per_hour?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "RentCar_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "Car"
            referencedColumns: ["id"]
          }
        ]
      }
      SaleCar: {
        Row: {
          car_id: string
          id: string
          price: number
        }
        Insert: {
          car_id: string
          id: string
          price: number
        }
        Update: {
          car_id?: string
          id?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "SaleCar_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "Car"
            referencedColumns: ["id"]
          }
        ]
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "AutoGalleryAgent"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Role: "USER" | "AGENT"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
