import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as userService from '../services/user.service';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const profile = await userService.getUserProfile(userId);
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ message: "Profil yüklenemedi" });
  }
};

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const settings = await userService.getSettings(userId);
    res.status(200).json(settings);
  } catch (error: any) {
    res.status(500).json({ message: "Ayarlar yüklenemedi" });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Güncellenecek veri gönderilmedi" });
    }

    await userService.updateUserSettings(userId, updates);
    res.status(200).json({ success: true, message: "Başarıyla güncellendi." });
  } catch (error: any) {
    res.status(500).json({ message: "Güncelleme hatası", error: error.message });
  }
};

export const uploadProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Dosya yüklenmedi" });
    }
    const userId = req.userId!;
    const imageUrl = `/uploads/${req.file.filename}`;
    
    await userService.updateProfileImage(userId, imageUrl); 
    
    res.status(200).json({ url: imageUrl });
  } catch (error: any) {
    res.status(500).json({ message: "Yükleme hatası", error: error.message });
  }
};