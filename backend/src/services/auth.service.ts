import bcrypt from 'bcrypt';
import pool from '../config/db';
import { generateToken } from '../utils/jwt';

export const registerUser = async (userData: any) => {
  const { full_name, email, password } = userData;

  const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (userExists.rows.length > 0) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await pool.query(
    'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email, profile_picture',
    [full_name, email, passwordHash]
  );

  const user = newUser.rows[0];

  await pool.query(
    'INSERT INTO settings (user_id) VALUES ($1)',
    [user.id]
  );

  const token = generateToken(user.id);

  return { user, token };
};

export const loginUser = async (credentials: any) => {
  const { email } = credentials;
  const password = credentials.password ? credentials.password.toString().trim() : "";

  const userRes = await pool.query(
    'SELECT id, full_name, email, password_hash, profile_picture FROM users WHERE email = $1', 
    [email]
  );
  
  if (userRes.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = userRes.rows[0];
  const dbPasswordHash = user.password_hash || user.passwordhash || user.password;

  if (!dbPasswordHash) {
    throw new Error('Database password field is missing or undefined');
  }

  console.log("--- LOGIN DEBUG ---");
  console.log("Gelen Şifre:", password);
  console.log("Şifre Türü:", typeof password);
  console.log("DB Hash:", dbPasswordHash);
  console.log("Hash Türü:", typeof dbPasswordHash);

  const sanityCheck = await bcrypt.compare('123456', dbPasswordHash);
  console.log("Sanity Check (123456 ile karşılaştırılıyor):", sanityCheck);

  const isMatch = await bcrypt.compare(password, dbPasswordHash);
  
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  console.log("Şifre eşleşti! Token oluşturuluyor...");

  try {
    const token = generateToken(user.id);
    console.log("Token başarıyla oluşturuldu:", token ? "Evet" : "Hayır");
    
    return {
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        profile_picture: user.profile_picture
      },
      token
    };
  } catch (tokenError) {
    console.error("TOKEN OLUŞTURMA HATASI:", tokenError);
    throw new Error('Token oluşturulurken hata oluştu.');
  }
};

export const getUserProfile = async (userId: string) => {
  const userRes = await pool.query(
    'SELECT id, full_name, email, profile_picture FROM users WHERE id = $1',
    [userId]
  );

  if (userRes.rows.length === 0) {
    throw new Error('User not found');
  }

  const settingsRes = await pool.query(
    'SELECT * FROM settings WHERE user_id = $1',
    [userId]
  );

  return {
    ...userRes.rows[0],
    settings: settingsRes.rows[0] || null
  };
};

export const storeResetToken = async (email: string, token: string, expires: Date) => {
  await pool.query(
    'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
    [token, expires, email]
  );
};

export const resetUserPassword = async (token: string, newPasswordSubmit: string) => {
  const userResult = await pool.query(
    'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
    [token]
  );

  if (userResult.rows.length === 0) {
    throw new Error('Şifre sıfırlama linki geçersiz veya süresi dolmuş.');
  }

  const user = userResult.rows[0];

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPasswordSubmit, saltRounds);

  await pool.query(
    'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
    [hashedPassword, user.id]
  );

  return user;
};