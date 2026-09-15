// ONEX ERP Main API Handler
// Routes and handlers for all ONEX operations on Cloudflare Workers

import { Router } from 'itty-router';
import { Env, ApiResponse } from './types';
import { D1DatabaseService } from './services/d1-database';
import { R2StorageService } from './services/r2-storage';

const router = Router();

// ===== MIDDLEWARE =====

// CORS Headers
const setCorsHeaders = (response: Response): Response => {
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return newResponse;
};

// Request logging
const logRequest = (request: Request): void => {
  console.log(`[${new Date().toISOString()}] ${request.method} ${new URL(request.url).pathname}`);
};

// ===== HEALTH CHECK =====

router.get('/health', (request: Request) => {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      service: 'ONEX ERP',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
});

// ===== FISCAL PERIOD ROUTES =====

router.post('/api/fiscal-periods', async (request: Request, env: Env) => {
  try {
    const body = await request.json();
    const dbService = new D1DatabaseService(env);
    const result = await dbService.createFiscalPeriod(body);
    return new Response(JSON.stringify(result), {
      status: result.success ? 201 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

router.get('/api/fiscal-periods/current', async (request: Request, env: Env) => {
  try {
    const dbService = new D1DatabaseService(env);
    const result = await dbService.getCurrentFiscalPeriod();
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 404,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

// ===== CUSTOMER ROUTES =====

router.post('/api/customers', async (request: Request, env: Env) => {
  try {
    const body = await request.json();
    body.id = body.id || crypto.randomUUID();
    const dbService = new D1DatabaseService(env);
    const result = await dbService.createCustomer(body);
    return new Response(JSON.stringify(result), {
      status: result.success ? 201 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

router.get('/api/customers/:id', async (request: Request, env: Env) => {
  try {
    const { id } = request.params as { id: string };
    const dbService = new D1DatabaseService(env);
    const result = await dbService.getCustomer(id);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 404,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

router.get('/api/customers', async (request: Request, env: Env) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const dbService = new D1DatabaseService(env);
    const result = await dbService.listCustomers(page, limit);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

// ===== SALES INVOICE ROUTES =====

router.post('/api/sales-invoices', async (request: Request, env: Env) => {
  try {
    const body = await request.json();
    body.id = body.id || crypto.randomUUID();
    body.lines = body.lines.map((line: any) => ({
      ...line,
      id: line.id || crypto.randomUUID(),
    }));
    const dbService = new D1DatabaseService(env);
    const result = await dbService.createSalesInvoice(body);
    return new Response(JSON.stringify(result), {
      status: result.success ? 201 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

router.get('/api/sales-invoices/:id', async (request: Request, env: Env) => {
  try {
    const { id } = request.params as { id: string };
    const dbService = new D1DatabaseService(env);
    const result = await dbService.getSalesInvoice(id);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 404,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

router.post('/api/sales-invoices/:id/post', async (request: Request, env: Env) => {
  try {
    const { id } = request.params as { id: string };
    const dbService = new D1DatabaseService(env);
    const result = await dbService.postSalesInvoice(id);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

router.get('/api/sales-invoices', async (request: Request, env: Env) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const customerId = url.searchParams.get('customerId') || undefined;
    const status = url.searchParams.get('status') || undefined;

    const dbService = new D1DatabaseService(env);
    const result = await dbService.listSalesInvoices({ customerId, status }, page, limit);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

// ===== INVENTORY ROUTES =====

router.get('/api/inventory/stock/:itemId', async (request: Request, env: Env) => {
  try {
    const { itemId } = request.params as { itemId: string };
    const url = new URL(request.url);
    const warehouse = url.searchParams.get('warehouse') || undefined;

    const dbService = new D1DatabaseService(env);
    const result = await dbService.getStockLevel(itemId, warehouse);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 404,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

router.post('/api/inventory/stock/:itemId/adjust', async (request: Request, env: Env) => {
  try {
    const { itemId } = request.params as { itemId: string };
    const { quantity, warehouse, reference } = await request.json();

    const dbService = new D1DatabaseService(env);
    const result = await dbService.updateStockLevel(itemId, quantity, warehouse, reference);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

router.get('/api/inventory/report', async (request: Request, env: Env) => {
  try {
    const dbService = new D1DatabaseService(env);
    const result = await dbService.getInventoryReport();
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

// ===== REPORTS ROUTES =====

router.get('/api/reports/ar-aging', async (request: Request, env: Env) => {
  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId') || undefined;

    const dbService = new D1DatabaseService(env);
    const result = await dbService.getARAgingReport(customerId);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

// ===== STORAGE ROUTES =====

router.post('/api/storage/upload', async (request: Request, env: Env) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const invoiceNumber = formData.get('invoiceNumber') as string;
    const type = formData.get('type') as 'sales' | 'purchase';

    if (!file || !invoiceNumber || !type) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const r2Service = new R2StorageService(env);
    const buffer = await file.arrayBuffer();
    const result = await r2Service.uploadInvoice(invoiceNumber, type, buffer, file.name);

    return new Response(JSON.stringify(result), {
      status: result.success ? 201 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

router.get('/api/storage/files', async (request: Request, env: Env) => {
  try {
    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix') || 'invoices/';
    const limit = parseInt(url.searchParams.get('limit') || '100');

    const r2Service = new R2StorageService(env);
    const result = await r2Service.listFiles(prefix, limit);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'List operation failed',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

// ===== 404 HANDLER =====

router.all('*', () => {
  return new Response(JSON.stringify({ success: false, error: 'Route not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
});

// ===== MAIN EXPORT =====

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    logRequest(request);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return setCorsHeaders(new Response(null, { status: 204 }));
    }

    try {
      const response = await router.handle(request, env, ctx);
      return setCorsHeaders(response);
    } catch (error) {
      console.error('Handler error:', error);
      return setCorsHeaders(
        new Response(
          JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
            timestamp: new Date().toISOString(),
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );
    }
  },
};
