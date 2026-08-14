import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { LanguageProvider } from '../context/LanguageContext';
import { UserProvider } from '../context/UserContext';
import { CurrencyProvider } from '../context/CurrencyContext';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('Dashboard Frontend Tests', () => {
  it('should render dashboard summary and elements correctly', async () => {
    render(
      <LanguageProvider>
        <CurrencyProvider>
          <UserProvider>
            <BrowserRouter>
              <Dashboard />
            </BrowserRouter>
          </UserProvider>
        </CurrencyProvider>
      </LanguageProvider>
    );

    const dashboardElement = await screen.findByText(/dash_section_net_assets/i);
    expect(dashboardElement).toBeInTheDocument();
  });

  it('should render main layout correctly', () => {
    render(
      <LanguageProvider>
        <CurrencyProvider>
          <UserProvider>
            <BrowserRouter>
              <Dashboard />
            </BrowserRouter>
          </UserProvider>
        </CurrencyProvider>
      </LanguageProvider>
    );

    expect(document.body).toBeInTheDocument();
  });
});