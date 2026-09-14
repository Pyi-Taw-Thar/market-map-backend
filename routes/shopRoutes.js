import express from 'express';
import Shop from '../models/Shop.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { shopName, ownerName, phoneNumber, state, township, address, ownerBirthday, notes, location } = req.body;

    const shop = new Shop({
      shopName,
      ownerName,
      phoneNumber,
      state: state || '',
      township: township || '',
      address,
      ownerBirthday: ownerBirthday ? new Date(ownerBirthday) : null,
      notes,
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
    const { state, township, search } = req.query;
    const filter = {};

    if (state && state.trim()) {
      filter.state = state.trim();
    }

    if (township && township.trim()) {
      filter.township = township.trim();
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { shopName: searchRegex },
        { ownerName: searchRegex },
        { address: searchRegex },
        { township: searchRegex },
        { state: searchRegex },
      ];
    }

    const shops = await Shop.find(filter).sort({ createdAt: -1 });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/upcoming-birthdays', async (req, res) => {
  try {
    const shops = await Shop.find({ ownerBirthday: { $exists: true, $ne: null } });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingBirthdays = shops.filter(shop => {
      if (!shop.ownerBirthday) return false;
      const birthday = new Date(shop.ownerBirthday);
      if (isNaN(birthday.getTime())) return false;
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

router.get('/meta/townships', async (req, res) => {
  try {
    const { state } = req.query;
    const filter = { township: { $exists: true, $ne: '' } };
    if (state) {
      filter.state = state;
    }
    const townships = await Shop.distinct('township', filter);
    // Sort alphabetically and filter out empty / null
    const cleanTownships = townships
      .filter(Boolean)
      .map(t => t.trim())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => a.localeCompare(b));
    res.json(cleanTownships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { shopName, ownerName, phoneNumber, state, township, address, ownerBirthday, notes, location } = req.body;
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (shopName !== undefined) shop.shopName = shopName;
    if (ownerName !== undefined) shop.ownerName = ownerName;
    if (phoneNumber !== undefined) shop.phoneNumber = phoneNumber;
    if (state !== undefined) shop.state = state;
    if (township !== undefined) shop.township = township;
    if (address !== undefined) shop.address = address;
    if (ownerBirthday !== undefined) shop.ownerBirthday = ownerBirthday ? new Date(ownerBirthday) : null;
    if (notes !== undefined) shop.notes = notes;
    if (location !== undefined) shop.location = location;

    const updatedShop = await shop.save();
    res.json(updatedShop);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
