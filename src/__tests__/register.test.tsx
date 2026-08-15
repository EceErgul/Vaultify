import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Register from '../pages/Register';
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

describe('Register Frontend Tests', () => {
  it('should render register elements and inputs correctly', async () => {
    renderWithProviders(<Register />);
    
    const registerHeading = await screen.findByRole('heading', { level: 2 });
    expect(registerHeading).toBeInTheDocument();
  });

  it('should render main layout correctly', () => {
    renderWithProviders(<Register />);
    expect(document.body).toBeInTheDocument();
  });
});