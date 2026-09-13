ALTER TABLE `window_registry` ADD `compiledSize` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `rebuildLevel` varchar(60) DEFAULT 'catalog_specification' NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `sourceStatus` varchar(80) DEFAULT 'FMB_PLL_not_found' NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `observedProcedures` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `observedTriggers` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `observedLibraries` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `observedTableIndicators` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `riskFlags` text;--> statement-breakpoint
ALTER TABLE `window_registry` ADD `specPath` varchar(240);--> statement-breakpoint
ALTER TABLE `window_registry` ADD `nextRequiredEvidence` varchar(240);