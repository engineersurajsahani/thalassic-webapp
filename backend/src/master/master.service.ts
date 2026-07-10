import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MasterService {
  constructor(private supabaseService: SupabaseService) {}

  private getSupabase() {
    return this.supabaseService.getClient();
  }

  // --- 1. Dashboard Metrics ---
  async getDashboardData() {
    const supabase = this.getSupabase();

    // Fetch counts from database
    const { count: totalSeafarers, error: err1 } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'SEAFARER');

    const { count: totalCourses, error: err2 } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    const { count: totalBookings, error: err3 } = await supabase
      .from('course_bookings')
      .select('*', { count: 'exact', head: true });

    // Fetch recent registrations
    const { data: recentRegistrations, error: err4 } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('role', 'SEAFARER')
      .order('created_at', { ascending: false })
      .limit(4);

    // Fetch recent purchases
    const { data: recentPurchases, error: err5 } = await supabase
      .from('course_bookings')
      .select(`
        id,
        purchase_date,
        amount,
        status,
        users ( name ),
        courses ( name )
      `)
      .order('purchase_date', { ascending: false })
      .limit(4);

    if (err1 || err2 || err3 || err4 || err5) {
      throw new InternalServerErrorException('Error loading dashboard analytics');
    }

    // Map bookings structure for response
    const formattedPurchases = (recentPurchases || []).map((p: any) => ({
      id: p.id,
      user: p.users?.name || 'Unknown User',
      course: p.courses?.name || 'Unknown Course',
      amount: p.amount,
      status: p.status,
      date: new Date(p.purchase_date).toLocaleDateString(),
    }));

    return {
      totalSeafarers: totalSeafarers || 0,
      totalCourses: totalCourses || 0,
      totalPurchases: totalBookings || 0,
      totalRevenue: '₹24.5L', // Placeholder or calculated value
      recentRegistrations: (recentRegistrations || []).map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        date: new Date(r.created_at).toLocaleDateString(),
      })),
      recentPurchases: formattedPurchases,
    };
  }

  // --- 2. Course Management ---
  async getCourses() {
    const { data, error } = await this.getSupabase()
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new InternalServerErrorException('Error loading courses');
    return data;
  }

  async createCourse(dto: any) {
    const { data, error } = await this.getSupabase()
      .from('courses')
      .insert([dto])
      .select()
      .single();

    if (error) throw new InternalServerErrorException('Error creating course module');
    return data;
  }

  async updateCourse(id: string, dto: any) {
    const { data, error } = await this.getSupabase()
      .from('courses')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new NotFoundException('Course module not found or update failed');
    return data;
  }

  async deleteCourse(id: string) {
    const { error } = await this.getSupabase()
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw new InternalServerErrorException('Error deleting course module');
    return { success: true };
  }

  // --- 3. User Management & Auditing ---
  async getUsers(role?: string) {
    let query = this.getSupabase().from('users').select('*').order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error } = await query;
    if (error) throw new InternalServerErrorException('Error loading users list');
    return data;
  }

  async getUserProfile(userId: string) {
    const supabase = this.getSupabase();

    // Fetch user basic data
    const { data: user, error: err1 } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (err1 || !user) throw new NotFoundException('User profile not found');

    // Fetch detailed profile docs
    const { data: profile } = await supabase
      .from('seafarer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Fetch sea service history
    const { data: seaService } = await supabase
      .from('sea_service_records')
      .select('*')
      .eq('user_id', userId);

    return {
      ...user,
      profile: profile || null,
      seaService: seaService || [],
    };
  }

  async updateUserStatus(id: string, status: string) {
    const { data, error } = await this.getSupabase()
      .from('users')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new NotFoundException('User not found or update failed');
    return data;
  }

  // --- 4. Settings Configuration ---
  async getSettings() {
    const { data, error } = await this.getSupabase()
      .from('settings')
      .select('*')
      .single();

    if (error) throw new InternalServerErrorException('Error loading platform settings');
    return data;
  }

  async updateSettings(dto: any) {
    const { data, error } = await this.getSupabase()
      .from('settings')
      .update(dto)
      .select()
      .single();

    if (error) throw new InternalServerErrorException('Error updating platform settings');
    return data;
  }
}
