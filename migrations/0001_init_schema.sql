-- ONEX ERP D1 Database Schema
-- Created: 2026-09-15

-- ===== CORE TABLES =====

-- Fiscal Periods
CREATE TABLE IF NOT EXISTS fiscal_periods (
  id TEXT PRIMARY KEY,
  fiscal_year INTEGER NOT NULL,
  period_number INTEGER NOT NULL,
  period_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_closed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(fiscal_year, period_number)
);

-- ===== MASTER DATA =====

-- Customers (Parties)
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  email TEXT,
  phone TEXT,
  address_ar TEXT,
  address_en TEXT,
  city TEXT,
  country TEXT,
  tax_id TEXT,
  credit_limit REAL DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  email TEXT,
  phone TEXT,
  address_ar TEXT,
  address_en TEXT,
  city TEXT,
  country TEXT,
  tax_id TEXT,
  payment_terms TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products/Items
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  unit_of_measure TEXT,
  category TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== INVENTORY =====

-- Stock Levels
CREATE TABLE IF NOT EXISTS stock_levels (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  warehouse TEXT,
  quantity_on_hand REAL DEFAULT 0,
  quantity_reserved REAL DEFAULT 0,
  quantity_available REAL DEFAULT 0,
  reorder_level REAL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id),
  UNIQUE(item_id, warehouse)
);

-- Stock Movements
CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  warehouse TEXT,
  movement_type TEXT NOT NULL, -- IN, OUT, ADJUST
  quantity REAL NOT NULL,
  reference_type TEXT, -- INVOICE, PO, ADJUSTMENT
  reference_id TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id)
);

-- ===== SALES INVOICES =====

-- Sales Invoice Headers
CREATE TABLE IF NOT EXISTS sales_invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id TEXT NOT NULL,
  fiscal_period_id TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE,
  currency TEXT DEFAULT 'SAR',
  total_before_tax REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  status TEXT DEFAULT 'DRAFT', -- DRAFT, POSTED, PAID, OVERDUE, CANCELLED
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (fiscal_period_id) REFERENCES fiscal_periods(id)
);

-- Sales Invoice Lines
CREATE TABLE IF NOT EXISTS sales_invoice_lines (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  line_number INTEGER NOT NULL,
  item_id TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit_price REAL NOT NULL,
  line_amount REAL NOT NULL,
  tax_rate REAL DEFAULT 0.15,
  line_tax REAL DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (invoice_id) REFERENCES sales_invoices(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);

-- ===== PURCHASE INVOICES =====

-- Purchase Invoice Headers
CREATE TABLE IF NOT EXISTS purchase_invoices (
  id TEXT PRIMARY KEY,
  po_number TEXT UNIQUE NOT NULL,
  supplier_id TEXT NOT NULL,
  fiscal_period_id TEXT NOT NULL,
  po_date DATE NOT NULL,
  expected_delivery_date DATE,
  currency TEXT DEFAULT 'SAR',
  total_before_tax REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  status TEXT DEFAULT 'DRAFT', -- DRAFT, POSTED, RECEIVED, PAID, CANCELLED
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (fiscal_period_id) REFERENCES fiscal_periods(id)
);

-- Purchase Invoice Lines
CREATE TABLE IF NOT EXISTS purchase_invoice_lines (
  id TEXT PRIMARY KEY,
  po_id TEXT NOT NULL,
  line_number INTEGER NOT NULL,
  item_id TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit_price REAL NOT NULL,
  line_amount REAL NOT NULL,
  tax_rate REAL DEFAULT 0.15,
  line_tax REAL DEFAULT 0,
  received_quantity REAL DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (po_id) REFERENCES purchase_invoices(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);

-- ===== ACCOUNTS RECEIVABLE =====

-- Customer Invoices Aging
CREATE TABLE IF NOT EXISTS customer_ar (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  invoice_id TEXT NOT NULL,
  original_amount REAL NOT NULL,
  amount_due REAL NOT NULL,
  amount_paid REAL DEFAULT 0,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'OPEN', -- OPEN, PARTIAL, PAID, OVERDUE, WRITTEN_OFF
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (invoice_id) REFERENCES sales_invoices(id)
);

-- ===== ACCOUNTS PAYABLE =====

-- Supplier Invoices Aging
CREATE TABLE IF NOT EXISTS supplier_ap (
  id TEXT PRIMARY KEY,
  supplier_id TEXT NOT NULL,
  po_id TEXT NOT NULL,
  original_amount REAL NOT NULL,
  amount_due REAL NOT NULL,
  amount_paid REAL DEFAULT 0,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'OPEN', -- OPEN, PARTIAL, PAID, OVERDUE, DISPUTED
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (po_id) REFERENCES purchase_invoices(id)
);

-- ===== COLLECTIONS =====

-- Customer Payments
CREATE TABLE IF NOT EXISTS customer_payments (
  id TEXT PRIMARY KEY,
  ar_id TEXT NOT NULL,
  payment_date DATE NOT NULL,
  payment_amount REAL NOT NULL,
  payment_method TEXT, -- CASH, CHECK, TRANSFER, CREDIT_CARD
  reference_number TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ar_id) REFERENCES customer_ar(id)
);

-- ===== FINANCIAL REPORTING =====

-- GL Accounts
CREATE TABLE IF NOT EXISTS gl_accounts (
  id TEXT PRIMARY KEY,
  account_number TEXT UNIQUE NOT NULL,
  account_name_ar TEXT NOT NULL,
  account_name_en TEXT,
  account_type TEXT NOT NULL, -- ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
  balance REAL DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- GL Transactions
CREATE TABLE IF NOT EXISTS gl_transactions (
  id TEXT PRIMARY KEY,
  fiscal_period_id TEXT NOT NULL,
  transaction_date DATE NOT NULL,
  source_type TEXT, -- INVOICE, PAYMENT, ADJUSTMENT
  source_id TEXT,
  gl_account_id TEXT NOT NULL,
  debit_amount REAL DEFAULT 0,
  credit_amount REAL DEFAULT 0,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fiscal_period_id) REFERENCES fiscal_periods(id),
  FOREIGN KEY (gl_account_id) REFERENCES gl_accounts(id)
);

-- Financial Reports
CREATE TABLE IF NOT EXISTS financial_reports (
  id TEXT PRIMARY KEY,
  fiscal_period_id TEXT NOT NULL,
  report_type TEXT NOT NULL, -- BALANCE_SHEET, INCOME_STATEMENT, TRIAL_BALANCE
  report_data TEXT, -- JSON format
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  generated_by TEXT,
  FOREIGN KEY (fiscal_period_id) REFERENCES fiscal_periods(id)
);

-- ===== AUDIT TRAIL =====

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_values TEXT, -- JSON
  new_values TEXT, -- JSON
  changed_by TEXT,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== INDEXES =====

CREATE INDEX idx_customers_code ON customers(code);
CREATE INDEX idx_customers_name ON customers(name_ar);
CREATE INDEX idx_suppliers_code ON suppliers(code);
CREATE INDEX idx_items_code ON items(code);
CREATE INDEX idx_sales_invoices_number ON sales_invoices(invoice_number);
CREATE INDEX idx_sales_invoices_customer ON sales_invoices(customer_id);
CREATE INDEX idx_sales_invoices_date ON sales_invoices(invoice_date);
CREATE INDEX idx_purchase_invoices_number ON purchase_invoices(po_number);
CREATE INDEX idx_purchase_invoices_supplier ON purchase_invoices(supplier_id);
CREATE INDEX idx_purchase_invoices_date ON purchase_invoices(po_date);
CREATE INDEX idx_customer_ar_status ON customer_ar(status);
CREATE INDEX idx_supplier_ap_status ON supplier_ap(status);
CREATE INDEX idx_gl_transactions_period ON gl_transactions(fiscal_period_id);
CREATE INDEX idx_stock_movements_item ON stock_movements(item_id);
