CREATE TABLE `audit_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actor` varchar(100) NOT NULL,
	`actionCode` varchar(80) NOT NULL,
	`entityType` varchar(80) NOT NULL,
	`entityId` varchar(120) NOT NULL,
	`requestId` varchar(120),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(30) NOT NULL,
	`name` varchar(200) NOT NULL,
	`baseCurrency` varchar(3) NOT NULL DEFAULT 'SAR',
	CONSTRAINT `companies_id` PRIMARY KEY(`id`),
	CONSTRAINT `companies_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`code` varchar(50) NOT NULL,
	`legalName` varchar(250) NOT NULL,
	`currencyCode` varchar(3) NOT NULL DEFAULT 'SAR',
	`status` enum('ACTIVE','BLOCKED','CLOSED') NOT NULL DEFAULT 'ACTIVE',
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `customer_company_code` UNIQUE(`companyId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `invoice_lines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoiceId` int NOT NULL,
	`itemId` int NOT NULL,
	`quantity` decimal(20,6) NOT NULL,
	`unitPrice` decimal(20,6) NOT NULL,
	`taxAmount` decimal(20,6) NOT NULL DEFAULT '0',
	`lineTotal` decimal(20,6) NOT NULL,
	CONSTRAINT `invoice_lines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`docNo` varchar(80) NOT NULL,
	`customerId` int NOT NULL,
	`warehouseId` int NOT NULL,
	`currencyCode` varchar(3) NOT NULL DEFAULT 'SAR',
	`subtotal` decimal(20,6) NOT NULL DEFAULT '0',
	`taxTotal` decimal(20,6) NOT NULL DEFAULT '0',
	`grandTotal` decimal(20,6) NOT NULL DEFAULT '0',
	`status` enum('DRAFT','POSTED','REVERSED') NOT NULL DEFAULT 'DRAFT',
	`idempotencyKey` varchar(160) NOT NULL,
	`sourceForm` varchar(80) NOT NULL DEFAULT 'ARST004',
	`createdBy` varchar(100) NOT NULL DEFAULT 'demo.user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`postedAt` timestamp,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_docNo_unique` UNIQUE(`docNo`),
	CONSTRAINT `invoices_idempotencyKey_unique` UNIQUE(`idempotencyKey`)
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`code` varchar(80) NOT NULL,
	`description` varchar(500) NOT NULL,
	`stockFlag` int NOT NULL DEFAULT 1,
	`unitCost` decimal(20,6) NOT NULL DEFAULT '0',
	`revenueAccount` varchar(80) NOT NULL DEFAULT '4100',
	`inventoryAccount` varchar(80) NOT NULL DEFAULT '1300',
	`cogsAccount` varchar(80) NOT NULL DEFAULT '5100',
	`active` int NOT NULL DEFAULT 1,
	CONSTRAINT `items_id` PRIMARY KEY(`id`),
	CONSTRAINT `item_company_code` UNIQUE(`companyId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `journal_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`journalNo` varchar(80) NOT NULL,
	`sourceInvoiceId` int,
	`entryType` varchar(40) NOT NULL,
	`totalDebit` decimal(20,6) NOT NULL,
	`totalCredit` decimal(20,6) NOT NULL,
	`status` enum('POSTED','REVERSED') NOT NULL DEFAULT 'POSTED',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `journal_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `journal_entries_journalNo_unique` UNIQUE(`journalNo`)
);
--> statement-breakpoint
CREATE TABLE `stock_balances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`itemId` int NOT NULL,
	`warehouseId` int NOT NULL,
	`quantity` decimal(20,6) NOT NULL DEFAULT '0',
	`reservedQuantity` decimal(20,6) NOT NULL DEFAULT '0',
	`unitCost` decimal(20,6) NOT NULL DEFAULT '0',
	`totalCost` decimal(20,6) NOT NULL DEFAULT '0',
	`versionNo` int NOT NULL DEFAULT 1,
	CONSTRAINT `stock_balances_id` PRIMARY KEY(`id`),
	CONSTRAINT `stock_item_warehouse` UNIQUE(`itemId`,`warehouseId`)
);
--> statement-breakpoint
CREATE TABLE `stock_movements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`itemId` int NOT NULL,
	`warehouseId` int NOT NULL,
	`sourceInvoiceId` int,
	`movementType` varchar(40) NOT NULL,
	`quantityIn` decimal(20,6) NOT NULL DEFAULT '0',
	`quantityOut` decimal(20,6) NOT NULL DEFAULT '0',
	`unitCost` decimal(20,6) NOT NULL DEFAULT '0',
	`totalCost` decimal(20,6) NOT NULL DEFAULT '0',
	`balanceAfter` decimal(20,6) NOT NULL DEFAULT '0',
	`createdBy` varchar(100) NOT NULL DEFAULT 'demo.user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stock_movements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `warehouses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`code` varchar(30) NOT NULL,
	`name` varchar(200) NOT NULL,
	`active` int NOT NULL DEFAULT 1,
	CONSTRAINT `warehouses_id` PRIMARY KEY(`id`),
	CONSTRAINT `warehouse_company_code` UNIQUE(`companyId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `window_registry` (
	`id` int AUTO_INCREMENT NOT NULL,
	`legacyForm` varchar(160) NOT NULL,
	`domainCode` varchar(40) NOT NULL,
	`capability` varchar(100) NOT NULL,
	`migrationPhase` int NOT NULL DEFAULT 3,
	`status` enum('cataloged','spec_only','in_progress','verified') NOT NULL DEFAULT 'cataloged',
	`sourceConfidence` varchar(40) NOT NULL DEFAULT 'FMX_STRING_EVIDENCE',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `window_registry_id` PRIMARY KEY(`id`),
	CONSTRAINT `window_registry_legacyForm_unique` UNIQUE(`legacyForm`)
);
--> statement-breakpoint
CREATE INDEX `invoice_status_idx` ON `invoices` (`status`);--> statement-breakpoint
CREATE INDEX `window_registry_domain_idx` ON `window_registry` (`domainCode`);