// D1 Database Service for ONEX ERP
// Handles all database operations for invoices, inventory, AR/AP, and financials

import {
  SalesInvoice,
  SalesInvoiceHeader,
  PurchaseInvoice,
  Customer,
  Supplier,
  Item,
  StockLevel,
  CustomerAR,
  SupplierAP,
  GLAccount,
  GLTransaction,
  FinancialReport,
  FiscalPeriod,
  ApiResponse,
  PaginatedResponse,
  ReportFilter,
  ARAgingReport,
  APAgingReport,
  InventoryReport,
  Env,
} from '../types';

export class D1DatabaseService {
  private db: D1Database;

  constructor(env: Env) {
    this.db = env.DB;
  }

  // ===== FISCAL PERIOD OPERATIONS =====

  async createFiscalPeriod(period: FiscalPeriod): Promise<ApiResponse<FiscalPeriod>> {
    try {
      await this.db
        .prepare(
          `INSERT INTO fiscal_periods (id, fiscal_year, period_number, period_name, start_date, end_date)
         VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          period.id,
          period.fiscal_year,
          period.period_number,
          period.period_name,
          period.start_date,
          period.end_date
        )
        .run();

      return {
        success: true,
        data: period,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create fiscal period',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getCurrentFiscalPeriod(): Promise<ApiResponse<FiscalPeriod>> {
    try {
      const result = await this.db
        .prepare('SELECT * FROM fiscal_periods WHERE is_closed = 0 ORDER BY period_number DESC LIMIT 1')
        .first<FiscalPeriod>();

      if (!result) {
        return {
          success: false,
          error: 'No open fiscal period found',
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch fiscal period',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ===== CUSTOMER OPERATIONS =====

  async createCustomer(customer: Customer): Promise<ApiResponse<Customer>> {
    try {
      await this.db
        .prepare(
          `INSERT INTO customers (id, code, name_ar, name_en, email, phone, address_ar, address_en, city, country, tax_id, credit_limit)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          customer.id,
          customer.code,
          customer.name_ar,
          customer.name_en,
          customer.email,
          customer.phone,
          customer.address_ar,
          customer.address_en,
          customer.city,
          customer.country,
          customer.tax_id,
          customer.credit_limit
        )
        .run();

      return {
        success: true,
        data: customer,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create customer',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getCustomer(customerId: string): Promise<ApiResponse<Customer>> {
    try {
      const result = await this.db
        .prepare('SELECT * FROM customers WHERE id = ?')
        .bind(customerId)
        .first<Customer>();

      if (!result) {
        return {
          success: false,
          error: `Customer ${customerId} not found`,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch customer',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async listCustomers(page: number = 1, limit: number = 50): Promise<ApiResponse<PaginatedResponse<Customer>>> {
    try {
      const offset = (page - 1) * limit;
      const results = await this.db
        .prepare('SELECT * FROM customers WHERE is_active = 1 ORDER BY name_ar LIMIT ? OFFSET ?')
        .bind(limit, offset)
        .all<Customer>();

      const countResult = await this.db.prepare('SELECT COUNT(*) as total FROM customers WHERE is_active = 1').first<{ total: number }>();

      const total = countResult?.total || 0;
      const pages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          data: results.results,
          total,
          page,
          limit,
          pages,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list customers',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ===== SALES INVOICE OPERATIONS =====

  async createSalesInvoice(invoice: SalesInvoice): Promise<ApiResponse<SalesInvoice>> {
    try {
      // Insert header
      await this.db
        .prepare(
          `INSERT INTO sales_invoices (id, invoice_number, customer_id, fiscal_period_id, invoice_date, due_date, total_before_tax, tax_amount, total_amount, status, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          invoice.id,
          invoice.invoice_number,
          invoice.customer_id,
          invoice.fiscal_period_id,
          invoice.invoice_date,
          invoice.due_date,
          invoice.total_before_tax,
          invoice.tax_amount,
          invoice.total_amount,
          'DRAFT',
          invoice.created_by
        )
        .run();

      // Insert lines
      for (const line of invoice.lines) {
        await this.db
          .prepare(
            `INSERT INTO sales_invoice_lines (id, invoice_id, line_number, item_id, quantity, unit_price, line_amount, tax_rate, line_tax)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            line.id,
            line.invoice_id,
            line.line_number,
            line.item_id,
            line.quantity,
            line.unit_price,
            line.line_amount,
            line.tax_rate,
            line.line_tax
          )
          .run();
      }

      return {
        success: true,
        data: invoice,
        message: `Invoice ${invoice.invoice_number} created successfully`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create sales invoice',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getSalesInvoice(invoiceId: string): Promise<ApiResponse<SalesInvoice>> {
    try {
      const header = await this.db
        .prepare('SELECT * FROM sales_invoices WHERE id = ?')
        .bind(invoiceId)
        .first<SalesInvoiceHeader>();

      if (!header) {
        return {
          success: false,
          error: `Invoice ${invoiceId} not found`,
          timestamp: new Date().toISOString(),
        };
      }

      const lines = await this.db
        .prepare('SELECT * FROM sales_invoice_lines WHERE invoice_id = ? ORDER BY line_number')
        .bind(invoiceId)
        .all();

      const customer = await this.db.prepare('SELECT * FROM customers WHERE id = ?').bind(header.customer_id).first<Customer>();

      return {
        success: true,
        data: {
          ...header,
          lines: lines.results,
          customer,
        } as SalesInvoice,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch sales invoice',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async postSalesInvoice(invoiceId: string): Promise<ApiResponse<void>> {
    try {
      await this.db
        .prepare('UPDATE sales_invoices SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind('POSTED', invoiceId)
        .run();

      // Create AR entry
      const invoice = await this.db
        .prepare('SELECT * FROM sales_invoices WHERE id = ?')
        .bind(invoiceId)
        .first<SalesInvoiceHeader>();

      if (invoice) {
        const arId = crypto.randomUUID();
        await this.db
          .prepare(
            `INSERT INTO customer_ar (id, customer_id, invoice_id, original_amount, amount_due, due_date, status)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(arId, invoice.customer_id, invoiceId, invoice.total_amount, invoice.total_amount, invoice.due_date, 'OPEN')
          .run();
      }

      return {
        success: true,
        message: `Invoice posted successfully`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to post invoice',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async listSalesInvoices(filter?: ReportFilter, page: number = 1, limit: number = 50): Promise<ApiResponse<PaginatedResponse<SalesInvoiceHeader>>> {
    try {
      let query = 'SELECT * FROM sales_invoices WHERE 1=1';
      const params: any[] = [];

      if (filter?.customerId) {
        query += ' AND customer_id = ?';
        params.push(filter.customerId);
      }

      if (filter?.status) {
        query += ' AND status = ?';
        params.push(filter.status);
      }

      if (filter?.startDate) {
        query += ' AND invoice_date >= ?';
        params.push(filter.startDate);
      }

      if (filter?.endDate) {
        query += ' AND invoice_date <= ?';
        params.push(filter.endDate);
      }

      query += ' ORDER BY invoice_date DESC LIMIT ? OFFSET ?';
      params.push(limit, (page - 1) * limit);

      const results = await this.db.prepare(query).bind(...params).all<SalesInvoiceHeader>();

      return {
        success: true,
        data: {
          data: results.results,
          total: results.results.length,
          page,
          limit,
          pages: Math.ceil(results.results.length / limit),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list sales invoices',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ===== INVENTORY OPERATIONS =====

  async getStockLevel(itemId: string, warehouse?: string): Promise<ApiResponse<StockLevel>> {
    try {
      let query = 'SELECT * FROM stock_levels WHERE item_id = ?';
      const params: any[] = [itemId];

      if (warehouse) {
        query += ' AND warehouse = ?';
        params.push(warehouse);
      }

      const result = await this.db.prepare(query).bind(...params).first<StockLevel>();

      if (!result) {
        return {
          success: false,
          error: `Stock level not found for item ${itemId}`,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stock level',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async updateStockLevel(itemId: string, quantityChange: number, warehouse?: string, reference?: string): Promise<ApiResponse<void>> {
    try {
      // Update stock level
      await this.db
        .prepare(
          `UPDATE stock_levels 
         SET quantity_on_hand = quantity_on_hand + ?,
             quantity_available = quantity_on_hand + ? - quantity_reserved,
             updated_at = CURRENT_TIMESTAMP
         WHERE item_id = ? AND (warehouse IS NULL OR warehouse = ?)`
        )
        .bind(quantityChange, quantityChange, itemId, warehouse || null)
        .run();

      // Log movement
      const movementId = crypto.randomUUID();
      await this.db
        .prepare(
          `INSERT INTO stock_movements (id, item_id, warehouse, movement_type, quantity, reference_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
        )
        .bind(
          movementId,
          itemId,
          warehouse || null,
          quantityChange > 0 ? 'IN' : 'OUT',
          Math.abs(quantityChange),
          reference || null
        )
        .run();

      return {
        success: true,
        message: `Stock updated for item ${itemId}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update stock level',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ===== ACCOUNTS RECEIVABLE OPERATIONS =====

  async getARAgingReport(customerId?: string): Promise<ApiResponse<ARAgingReport>> {
    try {
      let query = `
        SELECT 
          SUM(CASE WHEN days_overdue <= 0 THEN amount_due ELSE 0 END) as current,
          SUM(CASE WHEN days_overdue BETWEEN 1 AND 30 THEN amount_due ELSE 0 END) as days_30,
          SUM(CASE WHEN days_overdue BETWEEN 31 AND 60 THEN amount_due ELSE 0 END) as days_60,
          SUM(CASE WHEN days_overdue BETWEEN 61 AND 90 THEN amount_due ELSE 0 END) as days_90,
          SUM(CASE WHEN days_overdue > 90 THEN amount_due ELSE 0 END) as days_120_plus,
          SUM(amount_due) as total
        FROM (
          SELECT 
            amount_due,
            CAST((julianday('now') - julianday(due_date)) as INTEGER) as days_overdue
          FROM customer_ar
          WHERE status IN ('OPEN', 'PARTIAL', 'OVERDUE')
      `;

      const params: any[] = [];
      if (customerId) {
        query += ' AND customer_id = ?';
        params.push(customerId);
      }

      query += ')';

      const result = await this.db.prepare(query).bind(...params).first<ARAgingReport>();

      return {
        success: true,
        data: result || { current: 0, days_30: 0, days_60: 0, days_90: 0, days_120_plus: 0, total: 0 },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate AR aging report',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ===== INVENTORY REPORTING =====

  async getInventoryReport(): Promise<ApiResponse<InventoryReport[]>> {
    try {
      const results = await this.db
        .prepare(
          `SELECT 
          i.id, i.code as item_code, i.name_ar as item_name,
          sl.quantity_on_hand, sl.quantity_reserved, sl.quantity_available, sl.reorder_level,
          CASE WHEN sl.quantity_available <= sl.reorder_level THEN 1 ELSE 0 END as needs_reorder
        FROM items i
        LEFT JOIN stock_levels sl ON i.id = sl.item_id
        WHERE i.is_active = 1
        ORDER BY sl.quantity_available ASC`
        )
        .all<InventoryReport>();

      return {
        success: true,
        data: results.results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate inventory report',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
