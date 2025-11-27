CREATE TABLE `user_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nickname` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_accounts_nickname_unique` UNIQUE(`nickname`)
);
--> statement-breakpoint
CREATE TABLE `user_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` varchar(64) NOT NULL,
	`totalAttempts` int NOT NULL DEFAULT 0,
	`correctAnswers` int NOT NULL DEFAULT 0,
	`lastAttemptAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_stats_id` PRIMARY KEY(`id`)
);
