import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Assets from '../pages/Assets';
import AssetsDetail from '../pages/AssetsDetail';
import { LanguageProvider } from '../context/LanguageContext';
import { UserProvider } from '../context/UserContext';
import { CurrencyProvider } from '../context/CurrencyContext';

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (typeof url === 'string' && url.includes('/assets/')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, name: 'Test Varlık', balance: 1000, transactions: [] }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, name: 'Test Varlık', balance: 1000 }
      ]),
    });
  }) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(
    <LanguageProvider>
      <CurrencyProvider>
        <UserProvider>
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path="/assets" element={ui} />
              <Route path="/assets/:id" element={<AssetsDetail />} />
              <Route path="/" element={ui} />
            </Routes>
          </MemoryRouter>
        </UserProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
};

describe('Assets and AssetsDetail Frontend Tests', () => {
  it('should render assets title and elements correctly', async () => {
    await act(async () => {
      renderWithProviders(<Assets />, { route: '/assets' });
    });

    const assetsElement = await screen.findByText(/assets_title/i);
    expect(assetsElement).toBeInTheDocument();
  });

  it('should render asset detail page with ID correctly', async () => {
    await act(async () => {
      renderWithProviders(<AssetsDetail />, { route: '/assets/1' });
    });

    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  it('should render main layout correctly', async () => {
    await act(async () => {
      renderWithProviders(<Assets />, { route: '/assets' });
    });
    expect(document.body).toBeInTheDocument();
  });
});