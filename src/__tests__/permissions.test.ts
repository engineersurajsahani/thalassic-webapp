import { hasPermission, canAccessDashboard } from '../lib/permissions';

describe('Frontend Permission & Route Access Tests', () => {
  it('should allow MASTER full dashboard access', () => {
    expect(canAccessDashboard('MASTER', '/master/dashboard')).toBe(true);
    expect(canAccessDashboard('MASTER', '/seafarer/dashboard')).toBe(true);
    expect(canAccessDashboard('MASTER', '/company-admin/dashboard')).toBe(true);
    expect(canAccessDashboard('MASTER', '/agent-admin/dashboard')).toBe(true);
  });

  it('should restrict SEAFARER from accessing master or admin routes', () => {
    expect(canAccessDashboard('SEAFARER', '/master/dashboard')).toBe(false);
    expect(canAccessDashboard('SEAFARER', '/company-admin/dashboard')).toBe(false);
    expect(canAccessDashboard('SEAFARER', '/agent-admin/dashboard')).toBe(false);
    expect(canAccessDashboard('SEAFARER', '/seafarer/dashboard')).toBe(true);
  });

  it('should check role hierarchy correctly', () => {
    expect(hasPermission('MASTER', 'SEAFARER')).toBe(true);
    expect(hasPermission('MASTER', 'AGENT_ADMIN')).toBe(true);
    expect(hasPermission('SEAFARER', 'MASTER')).toBe(false);
  });
});
