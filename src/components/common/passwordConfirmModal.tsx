// PasswordConfirmModal.tsx

import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

const PasswordConfirmModal = ({ isOpen, onClose, onConfirm }: Props) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-black">
        <h3 className="font-semibold mb-4">İşlemi Onaylayın</h3>
        <p className="text-xs mb-4 text-gray-600">
          Değişiklikleri kaydetmek için lütfen mevcut şifrenizi girin.
        </p>
        <input
          type="password"
          className="border rounded w-full p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Mevcut Şifreniz"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-xs border rounded hover:bg-gray-100 transition"
          >
            İptal
          </button>
          <button 
            onClick={() => { onConfirm(password); setPassword(''); }} 
            className="px-4 py-2 text-xs bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded transition shadow-sm"
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordConfirmModal;