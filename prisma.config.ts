import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
	schema: 'prisma/schema.prisma',
	datasource: {
		// CLI operations use this URL.
		// For Accelerate, this is your prisma:// or prisma+postgres:// URL.
		url: env('DATABASE_URL'),
	},
});
