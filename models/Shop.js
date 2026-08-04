import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
    },
    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    ownerBirthday: {
      type: Date,
      required: [true, 'Owner birthday is required'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required'],
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required'],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
