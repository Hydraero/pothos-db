CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"expires_at" timestamp with time zone,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"name" text,
	"image" text,
	"username" text,
	"role" text DEFAULT 'USER' NOT NULL,
	"has_lifetime_access" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cultivar_images" (
	"id" text PRIMARY KEY NOT NULL,
	"cultivar_id" text NOT NULL,
	"url" text NOT NULL,
	"type" text DEFAULT 'GALLERY' NOT NULL,
	"caption" text,
	"is_premium" boolean DEFAULT false NOT NULL,
	"uploaded_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cultivar_traits" (
	"cultivar_id" text NOT NULL,
	"trait_id" text NOT NULL,
	CONSTRAINT "cultivar_traits_cultivar_id_trait_id_pk" PRIMARY KEY("cultivar_id","trait_id")
);
--> statement-breakpoint
CREATE TABLE "cultivars" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"common_name" text NOT NULL,
	"genus" text NOT NULL,
	"species" text,
	"origin" text,
	"parentage" text,
	"year_introduced" integer,
	"description" text,
	"rarity" text DEFAULT 'UNCOMMON' NOT NULL,
	"is_premium" boolean DEFAULT false NOT NULL,
	"leaf_shape" text,
	"variegation_type" text,
	"mature_size" text,
	"light_need" text,
	"premium_notes" text,
	"scent_notes" text,
	"growth_log" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cultivars_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "traits" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text,
	CONSTRAINT "traits_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_cultivars" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"cultivar_id" text NOT NULL,
	"nickname" text,
	"acquired_at" timestamp with time zone,
	"notes" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_plant_images" (
	"id" text PRIMARY KEY NOT NULL,
	"user_cultivar_id" text NOT NULL,
	"url" text NOT NULL,
	"taken_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications_collection" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"cultivar_id" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"code" text NOT NULL,
	"photo_url" text,
	"admin_notes" text,
	"fee_paid" boolean DEFAULT false NOT NULL,
	"amount" integer,
	"stripe_payment_id" text,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "verifications_collection_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"stripe_payment_id" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_stripe_payment_id_unique" UNIQUE("stripe_payment_id")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"status" text NOT NULL,
	"current_period_end" timestamp with time zone,
	"price_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "subscriptions_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cultivar_images" ADD CONSTRAINT "cultivar_images_cultivar_id_cultivars_id_fk" FOREIGN KEY ("cultivar_id") REFERENCES "public"."cultivars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cultivar_traits" ADD CONSTRAINT "cultivar_traits_cultivar_id_cultivars_id_fk" FOREIGN KEY ("cultivar_id") REFERENCES "public"."cultivars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cultivar_traits" ADD CONSTRAINT "cultivar_traits_trait_id_traits_id_fk" FOREIGN KEY ("trait_id") REFERENCES "public"."traits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cultivars" ADD CONSTRAINT "user_cultivars_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cultivars" ADD CONSTRAINT "user_cultivars_cultivar_id_cultivars_id_fk" FOREIGN KEY ("cultivar_id") REFERENCES "public"."cultivars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_plant_images" ADD CONSTRAINT "user_plant_images_user_cultivar_id_user_cultivars_id_fk" FOREIGN KEY ("user_cultivar_id") REFERENCES "public"."user_cultivars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verifications_collection" ADD CONSTRAINT "verifications_collection_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verifications_collection" ADD CONSTRAINT "verifications_collection_cultivar_id_cultivars_id_fk" FOREIGN KEY ("cultivar_id") REFERENCES "public"."cultivars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verifications_collection" ADD CONSTRAINT "verifications_collection_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;