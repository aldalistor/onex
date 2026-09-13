ALTER TABLE `window_registry` ADD `screenNo` varchar(40) DEFAULT 'SYS-0000' NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `screenName` varchar(240) DEFAULT 'Legacy Window' NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `parentId` varchar(160);--> statement-breakpoint
ALTER TABLE `window_registry` ADD `systemNo` varchar(40) DEFAULT 'ONEX' NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `itemType` varchar(40) DEFAULT 'FORM' NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `formName` varchar(160) DEFAULT 'LEGACY.fmx' NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `displayOrder` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `userPermission` varchar(120) DEFAULT 'ROLE_USER' NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `companyBranchPermission` varchar(160) DEFAULT 'COMPANY_BRANCH_SCOPE' NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `buildState` varchar(40) DEFAULT 'INDEXED' NOT NULL;