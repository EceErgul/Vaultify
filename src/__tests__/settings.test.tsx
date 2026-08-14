import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Settings from '../pages/Settings';
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

describe('Settings Frontend Tests', () => {
  it('should render settings elements correctly', async () => {
    renderWithProviders(<Settings />);
    const settingsElement = await screen.findByText(/set_section_profile/i);
    expect(settingsElement).toBeInTheDocument();
  });

  it('should render main layout correctly', () => {
    renderWithProviders(<Settings />);
    expect(document.body).toBeInTheDocument();
  });
});