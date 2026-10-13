const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Entrance & Exterior", "Food & Catering", "Stage & Mandap", "Banquet Hall"],
      required: true,
    },
    images: [{ type: String }], // image URLs
  },
  { _id: false }
);

const venueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, default: "Uttar Pradesh" },
    pincode: { type: String, match: /^\d{6}$/ },
    mapLink: { type: String },
    phoneNumber: { type: String, required: true, match: /^[6-9]\d{9}$/ },

    // Pricing
    pricePerPlate: { type: Number, required: true, min: 0 },
    priceType: { type: String, enum: ["Cost Per Plate", "Rental"], default: "Cost Per Plate" },

    rating: { type: Number, min: 0, max: 5, default: 0 },

    // Venue amenities
    hallCapacity: { type: Number, required: true, min: 1 },
    carParking: { type: Number, default: 0 },
    airConditioning: { type: Boolean, default: false },
    rooms: { type: Number, default: 0 },
    acRooms: { type: Number, default: 0 },
    bridalRoom: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },

    // Other information
    propertyType: { type: String, default: "Banquet Hall" },
    valetParking: { type: Boolean, default: false },
    allowedCuisine: { type: String, enum: ["Veg", "Non-Veg", "Both"], default: "Veg" },

    // Payment policies
    paymentPolicies: { type: String },

    // Albums
    albums: [albumSchema],

    // About
    aboutVenue: { type: String },
    detailInformation: { type: String },

    // Business stats
    establishedYear: { type: Number, min: 1900, max: new Date().getFullYear() },
    weddingsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// "7 Years in Business" auto calculate
venueSchema.virtual("yearsInBusiness").get(function () {
  return this.establishedYear ? new Date().getFullYear() - this.establishedYear : 0;
});
venueSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Venue", venueSchema);