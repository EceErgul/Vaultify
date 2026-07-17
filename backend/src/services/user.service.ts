import pool from '../config/db';
import fs from 'fs';
import path from 'path';

export const updateUserSettings = async (userId: string, updates: any) => {
  const fieldConfig: Record<string, { col: string; table: string }> = {
    fullName: { col: 'full_name', table: 'users' },
    email: { col: 'email', table: 'users' },
    profileImage: { col: 'profile_picture', table: 'users' },
    autoArchive: { col: 'auto_archive', table: 'settings' },
    autoArchiveMonths: { col: 'auto_archive_months', table: 'settings' },
    defaultCurrency: { col: 'default_currency', table: 'settings' },
    assetIntegrationActive: { col: 'asset_integration_active', table: 'settings' },
    emailNotification: { col: 'email_notification', table: 'settings' },
    trialExpirationNotification: { col: 'trial_expiration_notification', table: 'settings' },
    encryptionEnabled: { col: 'encryption_enabled', table: 'settings' },
    invisibleMode: { col: 'invisible_mode', table: 'settings' },
    defaultLanguage: { col: 'default_language', table: 'settings' },
    theme: { col: 'theme', table: 'settings' },
  };

  const updatesByUser: Record<string, any> = {};
  const updatesBySettings: Record<string, any> = {};

  for (const [key, value] of Object.entries(updates)) {
    const config = fieldConfig[key];
    if (!config) throw new Error(`Geçersiz alan: ${key}`);

    if (config.table === 'users') {
      updatesByUser[config.col] = value;
    } else {
      updatesBySettings[config.col] = value;
    }
  }

  const performUpdate = async (table: string, idField: string, id: string, data: Record<string, any>) => {
    const keys = Object.keys(data);
    if (keys.length === 0) return;

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = Object.values(data);
    const query = `UPDATE ${table} SET ${setClause} WHERE ${idField} = $${keys.length + 1}`;
    await pool.query(query, [...values, id]);
  };

  await performUpdate('users', 'id', userId, updatesByUser);
  await performUpdate('settings', 'user_id', userId, updatesBySettings);

  return { success: true };
};

export const getUserProfile = async (userId: string) => {
  const result = await pool.query('SELECT full_name, email, profile_picture FROM users WHERE id = $1', [userId]);
  return result.rows[0];
};

export const getSettings = async (userId: string) => {
  const result = await pool.query('SELECT * FROM settings WHERE user_id = $1', [userId]);
  return result.rows[0];
};

export const updateProfileImage = async (userId: string, imageUrl: string) => {
  const result = await pool.query('SELECT profile_picture FROM users WHERE id = $1', [userId]);
  const oldImage = result.rows[0]?.profile_picture;

  if (oldImage) {
    const filename = path.basename(oldImage); 
    const oldFilePath = path.join(__dirname, '..', 'uploads', filename);

    if (fs.existsSync(oldFilePath)) {
      try {
        fs.unlinkSync(oldFilePath);
        console.log("Eski profil fotoğrafı sunucudan silindi:", oldFilePath);
      } catch (err) {
        console.error("Eski fotoğraf silinirken hata oluştu:", err);
      }
    }
  }

  const query = 'UPDATE users SET profile_picture = $1 WHERE id = $2';
  await pool.query(query, [imageUrl, userId]);
  
  return { success: true };
};