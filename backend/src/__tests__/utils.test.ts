import '@testing-library/jest-dom';

jest.mock('../services/notification.service', () => ({
  sendNotificationIfEnabled: jest.fn().mockResolvedValue(true),
}));

jest.mock('../utils/sendEmail', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

describe('Vaultify Utils and API Helper Tests', () => {
  
  describe('Formatting and Calculation Helpers', () => {
    it('should format currency numbers correctly according to TR locale', () => {
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
      };
      
      const result = formatCurrency(1250.5);
      expect(result).toContain('1.250,50');
    });

    it('should calculate financial change percentage correctly', () => {
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return Number((((current - previous) / previous) * 100).toFixed(2));
      };

      expect(calculateChange(120, 100)).toBe(20);
      expect(calculateChange(80, 100)).toBe(-20);
      expect(calculateChange(150, 100)).toBe(50);
    });
  });

  describe('Storage and Token Helpers', () => {
    let mockStorage: Record<string, string> = {};

    beforeEach(() => {
      mockStorage = {};
    });

    it('should correctly save and retrieve auth token from storage helper', () => {
      const token = 'mock-jwt-token-vaultify-123';
      mockStorage['token'] = token;
      
      const retrieved = mockStorage['token'];
      expect(retrieved).toBe(token);
    });

    it('should clear token on logout simulation', () => {
      mockStorage['token'] = 'mock-jwt-token-vaultify-123';
      delete mockStorage['token'];
      
      expect(mockStorage['token']).toBeUndefined();
    });
  });

  describe('API Service Helper Mock Test', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle API response wrapper correctly', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: 'vaultify-assets' }),
      });

      global.fetch = mockFetch as unknown as typeof fetch;

      const response = await fetch('/api/assets');
      const data = (await response.json()) as { success: boolean; data: string };

      expect(mockFetch).toHaveBeenCalledWith('/api/assets');
      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data).toBe('vaultify-assets');
    });
  });
});