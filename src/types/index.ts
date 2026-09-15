// ONEX ERP Type Definitions
// Complete TypeScript interfaces for D1 Database and Application

// ===== FISCAL PERIOD =====
export interface FiscalPeriod {
  id: string;
  fiscal_year: number;
  period_number: number;
  period_name: string;
  start_date: string; // ISO date
  end_date: string; // ISO date
  is_closed: 0 | 1;
  created_at: string;
  updated_at: string;
}

// ===== MASTER DATA =====

export interface Customer {
  id: string;
  code: string;
  name_ar: string;
  name_en?: string;
  email?: string;
  phone?: string;
  address_ar?: string;
  address_en?: string;
  city?: string;
  country?: string;
  tax_id?: string;
  credit_limit: number;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  code: string;
  name_ar: string;
  name_en?: string;
  email?: string;
  phone?: string;
  address_ar?: string;
  address_en?: string;
  city?: string;
  country?: string;
  tax_id?: string;
  payment_terms?: string;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  code: string;
  name_ar: string;
  name_en?: string;
  description?: string;
  unit_of_measure: string;
  category?: string;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
}

// ===== INVENTORY =====

export interface StockLevel {
  id: string;
  item_id: string;
  warehouse?: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  reorder_level: number;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  item_id: string;
  warehouse?: string;
  movement_type: 'IN' | 'OUT' | 'ADJUST';
  quantity: number;
  reference_type?: 'INVOICE' | 'PO' | 'ADJUSTMENT';
  reference_id?: string;
  notes?: string;
  created_at: string;
}

// ===== SALES INVOICES =====

export interface SalesInvoiceHeader {
  id: string;
  invoice_number: string;
  customer_id: string;
  fiscal_period_id: string;
  invoice_date: string;
  due_date?: string;
  currency: string;
  total_before_tax: number;
  tax_amount: number;
  total_amount: number;
  status: 'DRAFT' | 'POSTED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface SalesInvoiceLine {
  id: string;
  invoice_id: string;
  line_number: number;
  item_id: string;
  quantity: number;
  unit_price: number;
  line_amount: number;
  tax_rate: number;
  line_tax: number;
  notes?: string;
}

export interface SalesInvoice extends SalesInvoiceHeader {
  lines: SalesInvoiceLine[];
  customer?: Customer;
}

// ===== PURCHASE INVOICES =====

export interface PurchaseInvoiceHeader {
  id: string;
  po_number: string;
  supplier_id: string;
  fiscal_period_id: string;
  po_date: string;
  expected_delivery_date?: string;
  currency: string;
  total_before_tax: number;
  tax_amount: number;
  total_amount: number;
  status: 'DRAFT' | 'POSTED' | 'RECEIVED' | 'PAID' | 'CANCELLED';
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface PurchaseInvoiceLine {
  id: string;
  po_id: string;
  line_number: number;
  item_id: string;
  quantity: number;
  unit_price: number;
  line_amount: number;
  tax_rate: number;
  line_tax: number;
  received_quantity: number;
  notes?: string;
}

export interface PurchaseInvoice extends PurchaseInvoiceHeader {
  lines: PurchaseInvoiceLine[];
  supplier?: Supplier;
}

// ===== ACCOUNTS RECEIVABLE =====

export interface CustomerAR {
  id: string;
  customer_id: string;
  invoice_id: string;
  original_amount: number;
  amount_due: number;
  amount_paid: number;
  due_date: string;
  status: 'OPEN' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'WRITTEN_OFF';
  created_at: string;
  updated_at: string;
}

export interface CustomerPayment {
  id: string;
  ar_id: string;
  payment_date: string;
  payment_amount: number;
  payment_method?: 'CASH' | 'CHECK' | 'TRANSFER' | 'CREDIT_CARD';
  reference_number?: string;
  notes?: string;
  created_at: string;
}

// ===== ACCOUNTS PAYABLE =====

export interface SupplierAP {
  id: string;
  supplier_id: string;
  po_id: string;
  original_amount: number;
  amount_due: number;
  amount_paid: number;
  due_date: string;
  status: 'OPEN' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'DISPUTED';
  created_at: string;
  updated_at: string;
}

// ===== FINANCIAL REPORTING =====

export interface GLAccount {
  id: string;
  account_number: string;
  account_name_ar: string;
  account_name_en?: string;
  account_type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  balance: number;
  is_active: 0 | 1;
  created_at: string;
}

export interface GLTransaction {
  id: string;
  fiscal_period_id: string;
  transaction_date: string;
  source_type?: 'INVOICE' | 'PAYMENT' | 'ADJUSTMENT';
  source_id?: string;
  gl_account_id: string;
  debit_amount: number;
  credit_amount: number;
  description?: string;
  created_at: string;
}

export interface FinancialReport {
  id: string;
  fiscal_period_id: string;
  report_type: 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'TRIAL_BALANCE';
  report_data: Record<string, any>; // JSON
  generated_at: string;
  generated_by?: string;
}

// ===== AUDIT TRAIL =====

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  changed_by?: string;
  changed_at: string;
}

// ===== API REQUEST/RESPONSE TYPES =====

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ===== WORKBENCH BINDING =====

export interface Env {
  DB: D1Database;
  R2_STORAGE: R2Bucket;
  KV_STORE: KVNamespace;
  KV_SESSIONS: KVNamespace;
  ANALYTICS: AnalyticsEngineDataset;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  D1_DATABASE_ID: string;
  ENVIRONMENT: 'development' | 'production';
}

// ===== R2 FILE METADATA =====

export interface R2FileMetadata {
  key: string;
  size: number;
  etag: string;
  customMetadata?: Record<string, string>;
  httpMetadata?: {
    contentType?: string;
    contentLanguage?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    cacheControl?: string;
    expires?: string;
  };
}

export interface R2UploadOptions {
  contentType?: string;
  contentDisposition?: string;
  customMetadata?: Record<string, string>;
}

// ===== REPORTING TYPES =====

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  customerId?: string;
  supplierId?: string;
  status?: string;
  invoiceType?: 'SALES' | 'PURCHASE';
}

export interface ARAgingReport {
  current: number;
  days_30: number;
  days_60: number;
  days_90: number;
  days_120_plus: number;
  total: number;
}

export interface APAgingReport {
  current: number;
  days_30: number;
  days_60: number;
  days_90: number;
  days_120_plus: number;
  total: number;
}

export interface InventoryReport {
  item_id: string;
  item_code: string;
  item_name: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  reorder_level: number;
  needs_reorder: boolean;
}
