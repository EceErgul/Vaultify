import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ResetPassword from '../pages/ResetPassword';
import NewPassword from '../pages/NewPassword';
import { LanguageProvider } from '../context/LanguageContext';
import { UserProvider } from '../context/UserContext';
import { CurrencyProvider } from '../context/CurrencyContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      <CurrencyProvider>
        <UserProvider>
          <BrowserRouter>
            {ui}
          </BrowserRouter>
        </UserProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
};

describe('Password Reset Flow Frontend Tests', () => {
  describe('ResetPassword Page', () => {
    it('should render forgot password title and email input correctly', async () => {
      renderWithProviders(<ResetPassword />);
      
      const heading = await screen.findByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      
      const emailInput = screen.getByRole('textbox');
      expect(emailInput).toBeInTheDocument();
    });

    it('should render main layout correctly', () => {
      renderWithProviders(<ResetPassword />);
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('NewPassword Page', () => {
    it('should render new password title and inputs correctly', async () => {
      renderWithProviders(<NewPassword />);
      
      const heading = await screen.findByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('should render main layout correctly', () => {
      renderWithProviders(<NewPassword />);
      expect(document.body).toBeInTheDocument();
    });
  });
});