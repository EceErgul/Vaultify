import pool from '../config/db';

export const updateSettings = async (userId: string, settingsData: any) => {
  const existing = await pool.query('SELECT * FROM settings WHERE user_id = $1', [userId]);
  if (existing.rows.length === 0) throw new Error('Settings record not found');
  
  const currentSettings = existing.rows[0];
  const merged = { ...currentSettings, ...settingsData };

  const result = await pool.query(
    `UPDATE settings 
     SET auto_archive = $1, auto_archive_months = $2, default_currency = $3, 
         asset_integration_active = $4, email_notification = $5, trial_expiration_notification = $6, 
         encryption_enabled = $7, invisible_mode = $8, default_language = $9, theme = $10
     WHERE user_id = $11 RETURNING *`,
    [
      merged.auto_archive, merged.auto_archive_months, merged.default_currency, 
      merged.asset_integration_active, merged.email_notification, merged.trial_expiration_notification, 
      merged.encryption_enabled, merged.invisible_mode, merged.default_language, merged.theme,
      userId
    ]
  );
  return result.rows[0];
};

export const getSettings = async (userId: string) => {
  const result = await pool.query('SELECT * FROM settings WHERE user_id = $1', [userId]);

  if (result.rows.length > 0) return result.rows[0];

  const newSettings = await pool.query(`
    INSERT INTO settings (user_id, theme, default_language, default_currency, auto_archive, encryption_enabled, email_notification) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [userId, 'light', 'TR', 'TL', false, true, true]
  );
  return newSettings.rows[0];
};

export const checkInvisibleMode = async (userId: string) => {
  const result = await pool.query('SELECT invisible_mode FROM settings WHERE user_id = $1', [userId]);
  return result.rows[0]?.invisible_mode || false;
};