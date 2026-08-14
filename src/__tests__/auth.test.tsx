import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { LanguageProvider } from '../context/LanguageContext';

describe('Auth / Login Frontend Tests', () => {
  const mockSetUserStatus = jest.fn();

  it('should render login form elements correctly', () => {
    render(
      <LanguageProvider>
        <BrowserRouter>
          <Login setUserStatus={mockSetUserStatus} />
        </BrowserRouter>
      </LanguageProvider>
    );

    const emailInput = screen.getByLabelText(/e-posta|email/i) || screen.getByPlaceholderText(/e-posta|email/i);
    const passwordInput = screen.getByLabelText(/şifre|password/i) || screen.getByPlaceholderText(/şifre|password/i);
    const submitButton = screen.getByRole('button', { name: /login_submit_btn/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('should allow user to type credentials and submit form', async () => {
    render(
      <LanguageProvider>
        <BrowserRouter>
          <Login setUserStatus={mockSetUserStatus} />
        </BrowserRouter>
      </LanguageProvider>
    );

    const emailInput = screen.getByLabelText(/e-posta|email/i) || screen.getByPlaceholderText(/e-posta|email/i);
    const passwordInput = screen.getByLabelText(/şifre|password/i) || screen.getByPlaceholderText(/şifre|password/i);
    const submitButton = screen.getByRole('button', { name: /login_submit_btn/i });

    fireEvent.change(emailInput, { target: { value: 'test@vaultify.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } });

    expect(emailInput).toHaveValue('test@vaultify.com');
    expect(passwordInput).toHaveValue('SecurePassword123!');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeInTheDocument();
    });
  });
});