import pool from '../config/db';

export const updateSettings = async (userId: string, settingsData: any) => {
  const {
    auto_archive,
    auto_archive_months,
    default_currency,
    asset_integration_active,
    email_notification,
    trial_expiration_notification,
    encryption_enabled,
    invisible_mode,
    default_language,
    theme
  } = settingsData;

  const result = await pool.query(
    `UPDATE settings 
     SET auto_archive = $1, auto_archive_months = $2, default_currency = $3, 
         asset_integration_active = $4, email_notification = $5, trial_expiration_notification = $6, 
         encryption_enabled = $7, invisible_mode = $8, default_language = $9, theme = $10
     WHERE user_id = $11 RETURNING *`,
    [
      auto_archive,
      auto_archive_months,
      default_currency,
      asset_integration_active,
      email_notification,
      trial_expiration_notification,
      encryption_enabled,
      invisible_mode,
      default_language,
      theme,
      userId
    ]
  );

  if (result.rows.length === 0) {
    throw new Error('Settings record not found');
  }

  return result.rows[0];
};