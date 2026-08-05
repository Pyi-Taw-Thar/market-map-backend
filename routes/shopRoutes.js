import express from 'express';
import Shop from '../models/Shop.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { shopName, ownerName, address, ownerBirthday, notes, phoneNumber, location } = req.body;

    const shop = new Shop({
      shopName,
      ownerName,
      address,
      ownerBirthday,
      notes,
      phoneNumber,
      location,
    });

    const createdShop = await shop.save();
    res.status(201).json(createdShop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const shops = await Shop.find({}).sort({ createdAt: -1 });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/upcoming-birthdays', async (req, res) => {
  try {
    const shops = await Shop.find({});
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingBirthdays = shops.filter(shop => {
      if (!shop.ownerBirthday) return false;
      const birthday = new Date(shop.ownerBirthday);
      const currentYear = today.getFullYear();
      
      let nextBirthday = new Date(currentYear, birthday.getMonth(), birthday.getDate());
      
      if (nextBirthday < today) {
        nextBirthday = new Date(currentYear + 1, birthday.getMonth(), birthday.getDate());
      }
      
      const daysUntilBirthday = Math.floor((nextBirthday - today) / (1000 * 60 * 60 * 24));
      
      return daysUntilBirthday <= 7;
    }).map(shop => {
      const birthday = new Date(shop.ownerBirthday);
      const currentYear = today.getFullYear();
      
      let nextBirthday = new Date(currentYear, birthday.getMonth(), birthday.getDate());
      
      if (nextBirthday < today) {
        nextBirthday = new Date(currentYear + 1, birthday.getMonth(), birthday.getDate());
      }
      
      const daysUntilBirthday = Math.floor((nextBirthday - today) / (1000 * 60 * 60 * 24));
      
      return {
        ...shop.toObject(),
        daysUntilBirthday,
        upcomingBirthdayDate: nextBirthday,
      };
    }).sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);
    
    res.json(upcomingBirthdays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    await Shop.findByIdAndDelete(req.params.id);
    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
