const mongoose = require('mongoose');

// Unified data model for all record types
const dataSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['order', 'worker', 'product', 'roll', 'investment', 'household', 'master_worker', 'production', 'attendance']
  },
  
  // Common fields
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Order fields
  customer_name: String,
  product_name: String,
  quantity: Number,
  unit: String,
  length: Number,
  width: Number,
  dimension_unit: String,
  cutting_length: Number,
  cutting_width: Number,
  cutting_unit: String,
  price: Number,
  advance_paid: Number,
  order_date: Date,
  delivery_date: Date,
  completed_date: Date,
  status: String,
  roll_id: String,
  
  // Worker fields
  worker_id: String,
  worker_name: String,
  order_id: String,
  background_work: String,
  units_produced: Number,
  production_unit: String,
  hours_worked: Number,
  order_length: Number,
  order_width: Number,
  roll_usage_kg: Number,
  date: Date,
  is_placeholder: Boolean,
  
  // Product fields
  name: String,
  category: String,
  
  // Roll fields
  roll_name: String,
  roll_weight: Number,
  initial_stock: Number,
  current_stock: Number,
  gsm: Number,
  cost: Number,
  supplier: String,
  purchase_date: Date,
  
  // Investment fields
  item: String,
  transport_cost: Number,
  
  // Household fields
  description: String,
  
  // Master Worker fields
  phone: String,
  address: String,
  
  // Production fields
  units_produced_old: Number,
  raw_material_cost: Number,
  
  // Additional metadata
  notes: String
}, {
  timestamps: true,
  strict: false // Allow additional fields for flexibility
});

// Index for better query performance
dataSchema.index({ type: 1, createdAt: -1 });
dataSchema.index({ type: 1, date: -1 });
dataSchema.index({ customer_name: 1 });
dataSchema.index({ worker_name: 1 });
dataSchema.index({ roll_id: 1 });

module.exports = mongoose.model('Data', dataSchema);