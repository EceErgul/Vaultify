import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

const PasswordConfirmModal = ({ isOpen, onClose, onConfirm }: Props) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-black">
        <h3 className="font-semibold mb-4">{t('pwd_modal_title')}</h3>
        <p className="text-xs mb-4 text-gray-600">
          {t('pwd_modal_desc')}
        </p>
        <input
          type="password"
          className="border rounded w-full p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder={t('pwd_modal_placeholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-xs border rounded hover:bg-gray-100 transition"
          >
            {t('pwd_modal_btn_cancel')}
          </button>
          <button 
            onClick={() => { onConfirm(password); setPassword(''); }} 
            className="px-4 py-2 text-xs bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded transition shadow-sm"
          >
            {t('pwd_modal_btn_confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordConfirmModal;