CREATE TABLE `branches` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `companyId` int NOT NULL,
  `code` varchar(30) NOT NULL,
  `name` varchar(200) NOT NULL,
  `active` int NOT NULL DEFAULT 1,
  CONSTRAINT `branch_company_code` UNIQUE (`companyId`, `code`)
);

CREATE TABLE `roles` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `code` varchar(60) NOT NULL UNIQUE,
  `name` varchar(160) NOT NULL,
  `active` int NOT NULL DEFAULT 1
);

CREATE TABLE `permissions` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `code` varchar(120) NOT NULL UNIQUE,
  `windowCode` varchar(160),
  `actionCode` varchar(80) NOT NULL,
  `description` varchar(300)
);

CREATE TABLE `user_roles` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `roleId` int NOT NULL,
  `branchId` int,
  CONSTRAINT `user_role_branch` UNIQUE (`userId`, `roleId`, `branchId`)
);

CREATE TABLE `role_permissions` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `roleId` int NOT NULL,
  `permissionId` int NOT NULL,
  CONSTRAINT `role_permission` UNIQUE (`roleId`, `permissionId`)
);

CREATE TABLE `accounts` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `companyId` int NOT NULL,
  `code` varchar(80) NOT NULL,
  `name` varchar(240) NOT NULL,
  `accountType` varchar(30) NOT NULL,
  `parentCode` varchar(80),
  `currencyCode` varchar(3) NOT NULL DEFAULT 'SAR',
  `active` int NOT NULL DEFAULT 1,
  CONSTRAINT `account_company_code` UNIQUE (`companyId`, `code`)
);

CREATE TABLE `fiscal_periods` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `companyId` int NOT NULL,
  `code` varchar(30) NOT NULL,
  `startsOn` timestamp NOT NULL,
  `endsOn` timestamp NOT NULL,
  `status` enum('OPEN','CLOSED') NOT NULL DEFAULT 'OPEN',
  CONSTRAINT `period_company_code` UNIQUE (`companyId`, `code`)
);

INSERT INTO `branches` (`companyId`, `code`, `name`, `active`) VALUES (1, 'MAIN', 'الفرع الرئيسي', 1);
INSERT INTO `roles` (`code`, `name`, `active`) VALUES ('ADMIN', 'مدير النظام', 1), ('ACCOUNTANT', 'محاسب', 1), ('SALES', 'مبيعات', 1), ('INVENTORY', 'مخزون', 1);
INSERT INTO `permissions` (`code`, `windowCode`, `actionCode`, `description`) VALUES
('GLST001:QUERY', 'GLST001', 'query', 'الاستعلام في دليل الحسابات'),
('GLST002:SAVE', 'GLST002', 'save', 'حفظ قيد يومي'),
('ARST004:POST', 'ARST004', 'post', 'ترحيل فاتورة مبيعات'),
('INVT003:SAVE', 'INVT003', 'save', 'حفظ بطاقة صنف'),
('RPT:PRINT', 'GLSR001', 'print', 'طباعة تقرير مالي');
INSERT INTO `accounts` (`companyId`, `code`, `name`, `accountType`, `currencyCode`, `active`) VALUES
(1, '1100', 'النقدية', 'ASSET', 'SAR', 1),
(1, '1300', 'المخزون', 'ASSET', 'SAR', 1),
(1, '4100', 'إيرادات المبيعات', 'REVENUE', 'SAR', 1),
(1, '5100', 'تكلفة المبيعات', 'EXPENSE', 'SAR', 1);
INSERT INTO `fiscal_periods` (`companyId`, `code`, `startsOn`, `endsOn`, `status`) VALUES (1, '2026-01', '2026-01-01 00:00:00', '2026-01-31 23:59:59', 'OPEN');
