--
-- PostgreSQL database dump
--

\restrict eEM6pMBUlfchGqPBhzMxIdbU0vyjEu1lFiynHoU7aybZgVmKQivTO0uu2nbTs9W

-- Dumped from database version 17.6 (Ubuntu 17.6-1.pgdg24.04+1)
-- Dumped by pg_dump version 17.6 (Ubuntu 17.6-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AdjustmentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AdjustmentType" AS ENUM (
    'REFUND',
    'CREDIT',
    'DEBIT',
    'TRANSFER',
    'CORRECTION',
    'WRITE_OFF'
);


ALTER TYPE public."AdjustmentType" OWNER TO postgres;

--
-- Name: AgeCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AgeCategory" AS ENUM (
    'ADULT',
    'YOUTH',
    'CHILD',
    'ELDERLY'
);


ALTER TYPE public."AgeCategory" OWNER TO postgres;

--
-- Name: ApprovalStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ApprovalStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'REQUIRES_REVIEW',
    'ESCALATED'
);


ALTER TYPE public."ApprovalStatus" OWNER TO postgres;

--
-- Name: AssetCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AssetCategory" AS ENUM (
    'FURNITURE',
    'EQUIPMENT',
    'ELECTRONICS',
    'VEHICLES',
    'PROPERTY',
    'INSTRUMENTS',
    'SOFTWARE',
    'OTHER'
);


ALTER TYPE public."AssetCategory" OWNER TO postgres;

--
-- Name: AssetCondition; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AssetCondition" AS ENUM (
    'EXCELLENT',
    'GOOD',
    'FAIR',
    'POOR',
    'DAMAGED',
    'OBSOLETE'
);


ALTER TYPE public."AssetCondition" OWNER TO postgres;

--
-- Name: BalanceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BalanceType" AS ENUM (
    'CREDIT',
    'DEBIT',
    'PLEDGE',
    'PREPAID'
);


ALTER TYPE public."BalanceType" OWNER TO postgres;

--
-- Name: BudgetStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BudgetStatus" AS ENUM (
    'DRAFT',
    'APPROVED',
    'ACTIVE',
    'CLOSED',
    'REVISED'
);


ALTER TYPE public."BudgetStatus" OWNER TO postgres;

--
-- Name: BudgetType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BudgetType" AS ENUM (
    'ANNUAL',
    'QUARTERLY',
    'MONTHLY',
    'PROJECT_BASED',
    'EVENT_BASED'
);


ALTER TYPE public."BudgetType" OWNER TO postgres;

--
-- Name: ContractStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ContractStatus" AS ENUM (
    'DRAFT',
    'PENDING_REVIEW',
    'PENDING_SIGNATURE',
    'ACTIVE',
    'COMPLETED',
    'TERMINATED',
    'EXPIRED'
);


ALTER TYPE public."ContractStatus" OWNER TO postgres;

--
-- Name: ContractType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ContractType" AS ENUM (
    'SERVICE',
    'SUPPLY',
    'CONSTRUCTION',
    'MAINTENANCE',
    'CONSULTING',
    'LEASE',
    'OTHER'
);


ALTER TYPE public."ContractType" OWNER TO postgres;

--
-- Name: ContributionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ContributionStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED',
    'CANCELLED'
);


ALTER TYPE public."ContributionStatus" OWNER TO postgres;

--
-- Name: DocumentCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DocumentCategory" AS ENUM (
    'GENERAL',
    'CONTRACTS',
    'PERMITS',
    'ARCHITECTURAL_PLANS',
    'BUDGET_DOCUMENTS',
    'PROGRESS_REPORTS',
    'MEETING_MINUTES',
    'CORRESPONDENCE',
    'TECHNICAL_SPECS',
    'PHOTOS',
    'VIDEOS',
    'AUDIO_RECORDINGS',
    'PRESENTATIONS',
    'MARKETING_MATERIALS'
);


ALTER TYPE public."DocumentCategory" OWNER TO postgres;

--
-- Name: DocumentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DocumentType" AS ENUM (
    'DOCUMENT',
    'SPREADSHEET',
    'PRESENTATION',
    'IMAGE',
    'VIDEO',
    'AUDIO',
    'ARCHIVE',
    'CODE',
    'OTHER'
);


ALTER TYPE public."DocumentType" OWNER TO postgres;

--
-- Name: ExpenditureCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ExpenditureCategory" AS ENUM (
    'OPERATIONAL',
    'PROJECT',
    'CAPITAL',
    'MAINTENANCE',
    'UTILITIES',
    'PERSONNEL',
    'MINISTRY',
    'OUTREACH',
    'EMERGENCY',
    'ADMINISTRATIVE'
);


ALTER TYPE public."ExpenditureCategory" OWNER TO postgres;

--
-- Name: ExpenseFrequency; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ExpenseFrequency" AS ENUM (
    'ONE_TIME',
    'DAILY',
    'WEEKLY',
    'MONTHLY',
    'QUARTERLY',
    'ANNUALLY',
    'IRREGULAR'
);


ALTER TYPE public."ExpenseFrequency" OWNER TO postgres;

--
-- Name: ExpenseUrgency; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ExpenseUrgency" AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'CRITICAL',
    'EMERGENCY'
);


ALTER TYPE public."ExpenseUrgency" OWNER TO postgres;

--
-- Name: MaintenanceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MaintenanceType" AS ENUM (
    'PREVENTIVE',
    'CORRECTIVE',
    'EMERGENCY',
    'UPGRADE',
    'INSPECTION'
);


ALTER TYPE public."MaintenanceType" OWNER TO postgres;

--
-- Name: MilestoneStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MilestoneStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'DELAYED',
    'CANCELLED',
    'BLOCKED'
);


ALTER TYPE public."MilestoneStatus" OWNER TO postgres;

--
-- Name: NotificationMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationMethod" AS ENUM (
    'EMAIL',
    'SMS',
    'PHONE_CALL',
    'IN_PERSON',
    'PUSH_NOTIFICATION'
);


ALTER TYPE public."NotificationMethod" OWNER TO postgres;

--
-- Name: PaymentFrequency; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentFrequency" AS ENUM (
    'DAILY',
    'WEEKLY',
    'BI_WEEKLY',
    'MONTHLY',
    'BI_MONTHLY',
    'QUARTERLY',
    'SEMI_ANNUALLY',
    'ANNUALLY',
    'CUSTOM'
);


ALTER TYPE public."PaymentFrequency" OWNER TO postgres;

--
-- Name: PaymentPattern; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentPattern" AS ENUM (
    'RECURRING',
    'FREQUENT',
    'OCCASIONAL',
    'ONE_TIME',
    'SEASONAL',
    'PLEDGE_BASED'
);


ALTER TYPE public."PaymentPattern" OWNER TO postgres;

--
-- Name: ProjectPriority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProjectPriority" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


ALTER TYPE public."ProjectPriority" OWNER TO postgres;

--
-- Name: ProjectStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProjectStatus" AS ENUM (
    'PLANNING',
    'ACTIVE',
    'ON_HOLD',
    'COMPLETED',
    'CANCELLED',
    'ARCHIVED'
);


ALTER TYPE public."ProjectStatus" OWNER TO postgres;

--
-- Name: RateSource; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RateSource" AS ENUM (
    'MANUAL',
    'BANK_API',
    'CENTRAL_BANK',
    'FOREX_API',
    'CRYPTO_API',
    'INTERNAL_CALC'
);


ALTER TYPE public."RateSource" OWNER TO postgres;

--
-- Name: ReceiptType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReceiptType" AS ENUM (
    'INVOICE',
    'RECEIPT',
    'VOUCHER',
    'BANK_STATEMENT',
    'CONTRACT',
    'QUOTE',
    'PURCHASE_ORDER',
    'DELIVERY_NOTE',
    'OTHER'
);


ALTER TYPE public."ReceiptType" OWNER TO postgres;

--
-- Name: ReminderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReminderStatus" AS ENUM (
    'PENDING',
    'SENT',
    'DELIVERED',
    'FAILED',
    'CANCELLED'
);


ALTER TYPE public."ReminderStatus" OWNER TO postgres;

--
-- Name: ReminderType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReminderType" AS ENUM (
    'CONTRIBUTION_DUE',
    'OVERDUE_PAYMENT',
    'UPCOMING_PAYMENT',
    'PLEDGE_REMINDER',
    'BALANCE_LOW'
);


ALTER TYPE public."ReminderType" OWNER TO postgres;

--
-- Name: RiskLevel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RiskLevel" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


ALTER TYPE public."RiskLevel" OWNER TO postgres;

--
-- Name: SupplierStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SupplierStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'BANNED',
    'UNDER_REVIEW',
    'PROBATION'
);


ALTER TYPE public."SupplierStatus" OWNER TO postgres;

--
-- Name: SupplierType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SupplierType" AS ENUM (
    'VENDOR',
    'CONTRACTOR',
    'SERVICE_PROVIDER',
    'CONSULTANT',
    'UTILITY_COMPANY',
    'GOVERNMENT_AGENCY'
);


ALTER TYPE public."SupplierType" OWNER TO postgres;

--
-- Name: TaskPriority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TaskPriority" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
);


ALTER TYPE public."TaskPriority" OWNER TO postgres;

--
-- Name: TaskStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TaskStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'ON_HOLD'
);


ALTER TYPE public."TaskStatus" OWNER TO postgres;

--
-- Name: UpdateType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UpdateType" AS ENUM (
    'PROGRESS',
    'MILESTONE',
    'ISSUE',
    'GENERAL',
    'FINANCIAL'
);


ALTER TYPE public."UpdateType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _CurrencyToCurrencyConversionHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_CurrencyToCurrencyConversionHistory" (
    "A" text NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_CurrencyToCurrencyConversionHistory" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: approval_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approval_history (
    id integer NOT NULL,
    expenditure_id integer NOT NULL,
    approver_level integer NOT NULL,
    approved_by integer NOT NULL,
    status public."ApprovalStatus" NOT NULL,
    comments text,
    approved_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.approval_history OWNER TO postgres;

--
-- Name: approval_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.approval_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.approval_history_id_seq OWNER TO postgres;

--
-- Name: approval_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.approval_history_id_seq OWNED BY public.approval_history.id;


--
-- Name: assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets (
    id integer NOT NULL,
    asset_number text NOT NULL,
    name text NOT NULL,
    description text,
    category public."AssetCategory" NOT NULL,
    expenditure_id integer,
    branch_code text NOT NULL,
    purchase_price numeric(120,2) NOT NULL,
    current_value numeric(120,2),
    currency_code text NOT NULL,
    purchase_date timestamp(3) without time zone NOT NULL,
    warranty_expiry timestamp(3) without time zone,
    condition public."AssetCondition" DEFAULT 'EXCELLENT'::public."AssetCondition" NOT NULL,
    location text,
    assigned_to integer,
    depreciation_rate numeric(5,2),
    is_insured boolean DEFAULT false NOT NULL,
    insurance_expiry timestamp(3) without time zone,
    serial_number text,
    barcode text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.assets OWNER TO postgres;

--
-- Name: assets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assets_id_seq OWNER TO postgres;

--
-- Name: assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assets_id_seq OWNED BY public.assets.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer,
    username text NOT NULL,
    action text NOT NULL,
    table_name text NOT NULL,
    record_id text NOT NULL,
    old_values jsonb,
    new_values jsonb,
    ip_address text,
    user_agent text,
    "timestamp" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: balance_adjustments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.balance_adjustments (
    id integer NOT NULL,
    member_balance_id integer NOT NULL,
    adjustment_type public."AdjustmentType" NOT NULL,
    amount numeric(120,2) NOT NULL,
    reason text NOT NULL,
    reference_number text,
    processed_by integer NOT NULL,
    processed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text
);


ALTER TABLE public.balance_adjustments OWNER TO postgres;

--
-- Name: balance_adjustments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.balance_adjustments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.balance_adjustments_id_seq OWNER TO postgres;

--
-- Name: balance_adjustments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.balance_adjustments_id_seq OWNED BY public.balance_adjustments.id;


--
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    code text NOT NULL,
    name text NOT NULL,
    address text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    phone_number text,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- Name: budget_allocations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_allocations (
    id integer NOT NULL,
    project_id integer NOT NULL,
    category text NOT NULL,
    allocated_amount numeric(120,2) NOT NULL,
    spent_amount numeric(120,2) DEFAULT 0 NOT NULL,
    currency_code text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.budget_allocations OWNER TO postgres;

--
-- Name: budget_allocations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.budget_allocations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.budget_allocations_id_seq OWNER TO postgres;

--
-- Name: budget_allocations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.budget_allocations_id_seq OWNED BY public.budget_allocations.id;


--
-- Name: budget_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_lines (
    id integer NOT NULL,
    budget_period_id integer NOT NULL,
    expenditure_head_code text NOT NULL,
    project_id integer,
    budgeted_amount numeric(120,2) NOT NULL,
    actual_amount numeric(120,2) DEFAULT 0 NOT NULL,
    variance numeric(120,2) DEFAULT 0 NOT NULL,
    variance_percent numeric(5,2) DEFAULT 0 NOT NULL,
    notes text
);


ALTER TABLE public.budget_lines OWNER TO postgres;

--
-- Name: budget_lines_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.budget_lines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.budget_lines_id_seq OWNER TO postgres;

--
-- Name: budget_lines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.budget_lines_id_seq OWNED BY public.budget_lines.id;


--
-- Name: budget_periods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_periods (
    id integer NOT NULL,
    name text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    budget_type public."BudgetType" NOT NULL,
    status public."BudgetStatus" DEFAULT 'DRAFT'::public."BudgetStatus" NOT NULL,
    total_budget numeric(120,2) NOT NULL,
    actual_spent numeric(120,2) DEFAULT 0 NOT NULL,
    currency_code text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.budget_periods OWNER TO postgres;

--
-- Name: budget_periods_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.budget_periods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.budget_periods_id_seq OWNER TO postgres;

--
-- Name: budget_periods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.budget_periods_id_seq OWNED BY public.budget_periods.id;


--
-- Name: contract_milestones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contract_milestones (
    id integer NOT NULL,
    contract_id integer NOT NULL,
    description text NOT NULL,
    due_date timestamp(3) without time zone NOT NULL,
    amount numeric(120,2),
    status public."MilestoneStatus" DEFAULT 'PENDING'::public."MilestoneStatus" NOT NULL,
    completed_at timestamp(3) without time zone,
    notes text
);


ALTER TABLE public.contract_milestones OWNER TO postgres;

--
-- Name: contract_milestones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contract_milestones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contract_milestones_id_seq OWNER TO postgres;

--
-- Name: contract_milestones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contract_milestones_id_seq OWNED BY public.contract_milestones.id;


--
-- Name: contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracts (
    id integer NOT NULL,
    contract_number text NOT NULL,
    supplier_id integer NOT NULL,
    project_id integer,
    title text NOT NULL,
    description text,
    contract_value numeric(120,2) NOT NULL,
    currency_code text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    renewal_date timestamp(3) without time zone,
    status public."ContractStatus" DEFAULT 'DRAFT'::public."ContractStatus" NOT NULL,
    contract_type public."ContractType" NOT NULL,
    payment_terms text,
    deliverables text,
    penalties text,
    signed_by integer,
    signed_date timestamp(3) without time zone,
    document_path text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.contracts OWNER TO postgres;

--
-- Name: contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contracts_id_seq OWNER TO postgres;

--
-- Name: contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contracts_id_seq OWNED BY public.contracts.id;


--
-- Name: contribution_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contribution_plans (
    id integer NOT NULL,
    member_id integer NOT NULL,
    project_id integer,
    revenue_head_code text,
    plan_name text NOT NULL,
    payment_pattern public."PaymentPattern" NOT NULL,
    frequency public."PaymentFrequency" DEFAULT 'MONTHLY'::public."PaymentFrequency" NOT NULL,
    amount numeric(120,2) NOT NULL,
    currency_code text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone,
    next_payment_date timestamp(3) without time zone,
    reminder_days integer DEFAULT 7 NOT NULL,
    auto_renew boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.contribution_plans OWNER TO postgres;

--
-- Name: contribution_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contribution_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contribution_plans_id_seq OWNER TO postgres;

--
-- Name: contribution_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contribution_plans_id_seq OWNED BY public.contribution_plans.id;


--
-- Name: currencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currencies (
    code text NOT NULL,
    name text NOT NULL,
    symbol text,
    is_active boolean DEFAULT true NOT NULL,
    is_base_currency boolean DEFAULT false NOT NULL,
    decimal_places integer DEFAULT 2 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.currencies OWNER TO postgres;

--
-- Name: currency_conversion_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency_conversion_history (
    id integer NOT NULL,
    exchange_rate_id integer NOT NULL,
    original_amount numeric(120,2) NOT NULL,
    original_currency_code text NOT NULL,
    converted_amount numeric(120,2) NOT NULL,
    converted_currency_code text NOT NULL,
    conversion_rate numeric(20,10) NOT NULL,
    transaction_type text NOT NULL,
    transaction_id integer NOT NULL,
    converted_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    converted_by integer NOT NULL
);


ALTER TABLE public.currency_conversion_history OWNER TO postgres;

--
-- Name: currency_conversion_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.currency_conversion_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.currency_conversion_history_id_seq OWNER TO postgres;

--
-- Name: currency_conversion_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.currency_conversion_history_id_seq OWNED BY public.currency_conversion_history.id;


--
-- Name: currency_payment_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency_payment_methods (
    currency_code text NOT NULL,
    payment_method_id integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.currency_payment_methods OWNER TO postgres;

--
-- Name: exchange_rate_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exchange_rate_history (
    id integer NOT NULL,
    base_currency_code text NOT NULL,
    target_currency_code text NOT NULL,
    rate numeric(20,10) NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    high_rate numeric(20,10),
    low_rate numeric(20,10),
    open_rate numeric(20,10),
    close_rate numeric(20,10),
    volume numeric(20,10),
    source public."RateSource" DEFAULT 'FOREX_API'::public."RateSource" NOT NULL,
    source_reference text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.exchange_rate_history OWNER TO postgres;

--
-- Name: exchange_rate_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exchange_rate_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exchange_rate_history_id_seq OWNER TO postgres;

--
-- Name: exchange_rate_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exchange_rate_history_id_seq OWNED BY public.exchange_rate_history.id;


--
-- Name: exchange_rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exchange_rates (
    id integer NOT NULL,
    base_currency_code text NOT NULL,
    target_currency_code text NOT NULL,
    rate numeric(20,10) NOT NULL,
    inverse_rate numeric(20,10),
    effective_date timestamp(3) without time zone NOT NULL,
    expiry_date timestamp(3) without time zone,
    source public."RateSource" DEFAULT 'MANUAL'::public."RateSource" NOT NULL,
    source_reference text,
    is_active boolean DEFAULT true NOT NULL,
    created_by integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.exchange_rates OWNER TO postgres;

--
-- Name: exchange_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exchange_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exchange_rates_id_seq OWNER TO postgres;

--
-- Name: exchange_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exchange_rates_id_seq OWNED BY public.exchange_rates.id;


--
-- Name: expenditure_heads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenditure_heads (
    code text NOT NULL,
    name text NOT NULL,
    branch_code text NOT NULL,
    approval_required boolean DEFAULT false NOT NULL,
    budget_limit numeric(120,2),
    category public."ExpenditureCategory" DEFAULT 'OPERATIONAL'::public."ExpenditureCategory" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.expenditure_heads OWNER TO postgres;

--
-- Name: expenditure_line_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenditure_line_items (
    id integer NOT NULL,
    expenditure_id integer NOT NULL,
    description text NOT NULL,
    quantity numeric(10,3) NOT NULL,
    unit_price numeric(120,2) NOT NULL,
    total_price numeric(120,2) NOT NULL,
    tax_rate numeric(5,2) DEFAULT 0,
    notes text
);


ALTER TABLE public.expenditure_line_items OWNER TO postgres;

--
-- Name: expenditure_line_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expenditure_line_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenditure_line_items_id_seq OWNER TO postgres;

--
-- Name: expenditure_line_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expenditure_line_items_id_seq OWNED BY public.expenditure_line_items.id;


--
-- Name: expenditures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenditures (
    id integer NOT NULL,
    voucher_number text NOT NULL,
    expenditure_head_code text NOT NULL,
    project_id integer,
    milestone_id integer,
    supplier_id integer,
    description text NOT NULL,
    amount numeric(120,2) NOT NULL,
    tax_amount numeric(120,2) DEFAULT 0,
    total_amount numeric(120,2) NOT NULL,
    currency_code text NOT NULL,
    payment_method_id integer NOT NULL,
    reference_number text,
    branch_code text NOT NULL,
    expense_date timestamp(3) without time zone NOT NULL,
    payment_date timestamp(3) without time zone,
    due_date timestamp(3) without time zone,
    frequency public."ExpenseFrequency" DEFAULT 'ONE_TIME'::public."ExpenseFrequency" NOT NULL,
    urgency public."ExpenseUrgency" DEFAULT 'NORMAL'::public."ExpenseUrgency" NOT NULL,
    is_recurring boolean DEFAULT false NOT NULL,
    recurring_until timestamp(3) without time zone,
    approval_status public."ApprovalStatus" DEFAULT 'PENDING'::public."ApprovalStatus" NOT NULL,
    approved_by integer,
    approved_at timestamp(3) without time zone,
    requested_by integer NOT NULL,
    processed_by integer,
    notes text,
    internal_notes text,
    tags text[],
    is_reimbursement boolean DEFAULT false NOT NULL,
    reimbursed_to integer,
    budget_year integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.expenditures OWNER TO postgres;

--
-- Name: expenditures_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expenditures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenditures_id_seq OWNER TO postgres;

--
-- Name: expenditures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expenditures_id_seq OWNED BY public.expenditures.id;


--
-- Name: expense_receipts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense_receipts (
    id integer NOT NULL,
    expenditure_id integer NOT NULL,
    file_name text NOT NULL,
    original_name text NOT NULL,
    file_path text NOT NULL,
    file_size integer NOT NULL,
    mime_type text NOT NULL,
    receipt_type public."ReceiptType" NOT NULL,
    receipt_number text,
    merchant_name text,
    receipt_date timestamp(3) without time zone,
    ocr_text text,
    is_verified boolean DEFAULT false NOT NULL,
    uploaded_by integer NOT NULL,
    uploaded_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    verified_by integer,
    verified_at timestamp(3) without time zone
);


ALTER TABLE public.expense_receipts OWNER TO postgres;

--
-- Name: expense_receipts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expense_receipts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expense_receipts_id_seq OWNER TO postgres;

--
-- Name: expense_receipts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expense_receipts_id_seq OWNED BY public.expense_receipts.id;


--
-- Name: login_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_history (
    id integer NOT NULL,
    user_id integer NOT NULL,
    ip_address text,
    user_agent text,
    success boolean NOT NULL,
    error text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.login_history OWNER TO postgres;

--
-- Name: login_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_history_id_seq OWNER TO postgres;

--
-- Name: login_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_history_id_seq OWNED BY public.login_history.id;


--
-- Name: maintenance_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_records (
    id integer NOT NULL,
    asset_id integer NOT NULL,
    maintenance_type public."MaintenanceType" NOT NULL,
    description text NOT NULL,
    cost numeric(120,2),
    currency_code text,
    supplier_id integer,
    scheduled_date timestamp(3) without time zone,
    completed_date timestamp(3) without time zone,
    next_service_date timestamp(3) without time zone,
    performed_by text,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.maintenance_records OWNER TO postgres;

--
-- Name: maintenance_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenance_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_records_id_seq OWNER TO postgres;

--
-- Name: maintenance_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenance_records_id_seq OWNED BY public.maintenance_records.id;


--
-- Name: member_balances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.member_balances (
    id integer NOT NULL,
    member_id integer NOT NULL,
    project_id integer,
    balance_type public."BalanceType" NOT NULL,
    balance numeric(120,2) NOT NULL,
    credit_limit numeric(120,2),
    currency_code text NOT NULL,
    last_updated timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.member_balances OWNER TO postgres;

--
-- Name: member_balances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.member_balances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.member_balances_id_seq OWNER TO postgres;

--
-- Name: member_balances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.member_balances_id_seq OWNED BY public.member_balances.id;


--
-- Name: member_contributions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.member_contributions (
    id integer NOT NULL,
    receipt_number text NOT NULL,
    member_id integer NOT NULL,
    project_id integer,
    amount numeric(120,2) NOT NULL,
    currency_code text NOT NULL,
    payment_method_id integer NOT NULL,
    reference_number text,
    payment_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    processed_by integer NOT NULL,
    notes text,
    status public."ContributionStatus" DEFAULT 'COMPLETED'::public."ContributionStatus" NOT NULL,
    is_recurring boolean DEFAULT false NOT NULL,
    recurring_plan_id integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.member_contributions OWNER TO postgres;

--
-- Name: member_contributions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.member_contributions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.member_contributions_id_seq OWNER TO postgres;

--
-- Name: member_contributions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.member_contributions_id_seq OWNED BY public.member_contributions.id;


--
-- Name: member_projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.member_projects (
    id integer NOT NULL,
    member_id integer NOT NULL,
    project_id integer NOT NULL,
    required_amount numeric(120,2) NOT NULL,
    currency_code text NOT NULL,
    is_exempt boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.member_projects OWNER TO postgres;

--
-- Name: member_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.member_projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.member_projects_id_seq OWNER TO postgres;

--
-- Name: member_projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.member_projects_id_seq OWNED BY public.member_projects.id;


--
-- Name: members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.members (
    id integer NOT NULL,
    member_number text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    date_of_birth timestamp(3) without time zone,
    age_category public."AgeCategory" DEFAULT 'ADULT'::public."AgeCategory" NOT NULL,
    phone_number text,
    email text,
    address text,
    branch_code text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    joined_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.members OWNER TO postgres;

--
-- Name: members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.members_id_seq OWNER TO postgres;

--
-- Name: members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.members_id_seq OWNED BY public.members.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id integer NOT NULL,
    token text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_seq OWNER TO postgres;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- Name: payment_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_methods (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.payment_methods OWNER TO postgres;

--
-- Name: payment_methods_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_methods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_methods_id_seq OWNER TO postgres;

--
-- Name: payment_methods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_methods_id_seq OWNED BY public.payment_methods.id;


--
-- Name: payment_pattern_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_pattern_history (
    id integer NOT NULL,
    member_id integer NOT NULL,
    previous_pattern public."PaymentPattern" NOT NULL,
    new_pattern public."PaymentPattern" NOT NULL,
    analysis_date timestamp(3) without time zone NOT NULL,
    confidence double precision DEFAULT 0.0 NOT NULL,
    reason_code text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.payment_pattern_history OWNER TO postgres;

--
-- Name: payment_pattern_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_pattern_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_pattern_history_id_seq OWNER TO postgres;

--
-- Name: payment_pattern_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_pattern_history_id_seq OWNED BY public.payment_pattern_history.id;


--
-- Name: payment_reminders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_reminders (
    id integer NOT NULL,
    member_id integer NOT NULL,
    contribution_plan_id integer,
    reminder_type public."ReminderType" NOT NULL,
    due_date timestamp(3) without time zone NOT NULL,
    amount numeric(120,2) NOT NULL,
    currency_code text NOT NULL,
    message text,
    sent_at timestamp(3) without time zone,
    method public."NotificationMethod" DEFAULT 'EMAIL'::public."NotificationMethod" NOT NULL,
    status public."ReminderStatus" DEFAULT 'PENDING'::public."ReminderStatus" NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.payment_reminders OWNER TO postgres;

--
-- Name: payment_reminders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_reminders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_reminders_id_seq OWNER TO postgres;

--
-- Name: payment_reminders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_reminders_id_seq OWNED BY public.payment_reminders.id;


--
-- Name: project_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_documents (
    id integer NOT NULL,
    project_id integer NOT NULL,
    file_name text NOT NULL,
    original_name text NOT NULL,
    file_path text NOT NULL,
    file_size integer NOT NULL,
    mime_type text NOT NULL,
    file_type public."DocumentType" NOT NULL,
    category public."DocumentCategory" DEFAULT 'GENERAL'::public."DocumentCategory" NOT NULL,
    description text,
    tags text[],
    is_public boolean DEFAULT false NOT NULL,
    download_count integer DEFAULT 0 NOT NULL,
    thumbnail_path text,
    duration integer,
    dimensions text,
    checksum text,
    uploaded_by integer NOT NULL,
    uploaded_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_accessed timestamp(3) without time zone,
    version_number integer DEFAULT 1 NOT NULL,
    parent_doc_id integer
);


ALTER TABLE public.project_documents OWNER TO postgres;

--
-- Name: project_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_documents_id_seq OWNER TO postgres;

--
-- Name: project_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_documents_id_seq OWNED BY public.project_documents.id;


--
-- Name: project_milestones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_milestones (
    id integer NOT NULL,
    project_id integer NOT NULL,
    name text NOT NULL,
    description text,
    target_date timestamp(3) without time zone NOT NULL,
    actual_date timestamp(3) without time zone,
    budget_allocation numeric(120,2),
    actual_cost numeric(120,2),
    status public."MilestoneStatus" DEFAULT 'PENDING'::public."MilestoneStatus" NOT NULL,
    priority integer DEFAULT 1 NOT NULL,
    progress double precision DEFAULT 0.0 NOT NULL,
    dependencies jsonb,
    deliverables text,
    completion_criteria text,
    notes text,
    completed_by integer,
    completed_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.project_milestones OWNER TO postgres;

--
-- Name: project_milestones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_milestones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_milestones_id_seq OWNER TO postgres;

--
-- Name: project_milestones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_milestones_id_seq OWNED BY public.project_milestones.id;


--
-- Name: project_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_tasks (
    id integer NOT NULL,
    project_id integer NOT NULL,
    milestone_id integer,
    title text NOT NULL,
    description text,
    assigned_to integer,
    due_date timestamp(3) without time zone,
    status public."TaskStatus" DEFAULT 'PENDING'::public."TaskStatus" NOT NULL,
    priority public."TaskPriority" DEFAULT 'MEDIUM'::public."TaskPriority" NOT NULL,
    estimated_hours integer,
    actual_hours integer,
    completed_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.project_tasks OWNER TO postgres;

--
-- Name: project_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_tasks_id_seq OWNER TO postgres;

--
-- Name: project_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_tasks_id_seq OWNED BY public.project_tasks.id;


--
-- Name: project_updates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_updates (
    id integer NOT NULL,
    project_id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    update_type public."UpdateType" NOT NULL,
    created_by text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.project_updates OWNER TO postgres;

--
-- Name: project_updates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_updates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_updates_id_seq OWNER TO postgres;

--
-- Name: project_updates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_updates_id_seq OWNED BY public.project_updates.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    target_amount numeric(120,2) NOT NULL,
    currency_code text NOT NULL,
    branch_code text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone,
    actual_start_date timestamp(3) without time zone,
    actual_end_date timestamp(3) without time zone,
    status public."ProjectStatus" DEFAULT 'PLANNING'::public."ProjectStatus" NOT NULL,
    priority public."ProjectPriority" DEFAULT 'MEDIUM'::public."ProjectPriority" NOT NULL,
    progress double precision DEFAULT 0.0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    token text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: refunds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refunds (
    id integer NOT NULL,
    transaction_id integer NOT NULL,
    amount numeric(120,2) NOT NULL,
    currency_code text NOT NULL,
    reason text NOT NULL,
    processed_by_id integer NOT NULL,
    processed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.refunds OWNER TO postgres;

--
-- Name: refunds_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refunds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refunds_id_seq OWNER TO postgres;

--
-- Name: refunds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refunds_id_seq OWNED BY public.refunds.id;


--
-- Name: revenue_heads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.revenue_heads (
    code text NOT NULL,
    name text NOT NULL,
    branch_code text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.revenue_heads OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name text NOT NULL,
    display_name text NOT NULL,
    description text,
    permissions jsonb NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: supplier_evaluations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_evaluations (
    id integer NOT NULL,
    supplier_id integer NOT NULL,
    evaluated_by integer NOT NULL,
    quality_rating integer NOT NULL,
    timeliness_rating integer NOT NULL,
    value_rating integer NOT NULL,
    service_rating integer NOT NULL,
    overall_rating double precision NOT NULL,
    comments text,
    would_recommend boolean DEFAULT true NOT NULL,
    evaluation_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.supplier_evaluations OWNER TO postgres;

--
-- Name: supplier_evaluations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supplier_evaluations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supplier_evaluations_id_seq OWNER TO postgres;

--
-- Name: supplier_evaluations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supplier_evaluations_id_seq OWNED BY public.supplier_evaluations.id;


--
-- Name: supplier_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_status_history (
    id integer NOT NULL,
    supplier_id integer NOT NULL,
    old_status public."SupplierStatus" NOT NULL,
    new_status public."SupplierStatus" NOT NULL,
    reason text NOT NULL,
    changed_by integer NOT NULL,
    changed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    review_date timestamp(3) without time zone
);


ALTER TABLE public.supplier_status_history OWNER TO postgres;

--
-- Name: supplier_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supplier_status_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supplier_status_history_id_seq OWNER TO postgres;

--
-- Name: supplier_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supplier_status_history_id_seq OWNED BY public.supplier_status_history.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    business_name text,
    contact_person text,
    email text,
    phone_number text,
    address text,
    tax_number text,
    bank_account text,
    payment_terms integer DEFAULT 30,
    credit_limit numeric(120,2),
    supplier_type public."SupplierType" DEFAULT 'VENDOR'::public."SupplierType" NOT NULL,
    rating integer DEFAULT 5,
    status public."SupplierStatus" DEFAULT 'ACTIVE'::public."SupplierStatus" NOT NULL,
    banned_reason text,
    banned_by integer,
    banned_at timestamp(3) without time zone,
    blacklist_until timestamp(3) without time zone,
    risk_level public."RiskLevel" DEFAULT 'LOW'::public."RiskLevel" NOT NULL,
    notes text,
    is_preferred boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_id_seq OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    receipt_number text NOT NULL,
    revenue_head_code text NOT NULL,
    amount numeric(120,2) NOT NULL,
    branch_code text NOT NULL,
    transaction_date timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    currency_code text NOT NULL,
    member_id integer NOT NULL,
    notes text,
    payment_method_id integer NOT NULL,
    reference_number text,
    status text DEFAULT 'completed'::text NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    locked boolean DEFAULT false NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    branch_code text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    email text,
    first_name text,
    is_active boolean DEFAULT true NOT NULL,
    last_login timestamp(6) with time zone,
    last_name text,
    phone_number text,
    role_id integer NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: approval_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_history ALTER COLUMN id SET DEFAULT nextval('public.approval_history_id_seq'::regclass);


--
-- Name: assets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets ALTER COLUMN id SET DEFAULT nextval('public.assets_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: balance_adjustments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.balance_adjustments ALTER COLUMN id SET DEFAULT nextval('public.balance_adjustments_id_seq'::regclass);


--
-- Name: budget_allocations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_allocations ALTER COLUMN id SET DEFAULT nextval('public.budget_allocations_id_seq'::regclass);


--
-- Name: budget_lines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_lines ALTER COLUMN id SET DEFAULT nextval('public.budget_lines_id_seq'::regclass);


--
-- Name: budget_periods id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_periods ALTER COLUMN id SET DEFAULT nextval('public.budget_periods_id_seq'::regclass);


--
-- Name: contract_milestones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract_milestones ALTER COLUMN id SET DEFAULT nextval('public.contract_milestones_id_seq'::regclass);


--
-- Name: contracts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts ALTER COLUMN id SET DEFAULT nextval('public.contracts_id_seq'::regclass);


--
-- Name: contribution_plans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contribution_plans ALTER COLUMN id SET DEFAULT nextval('public.contribution_plans_id_seq'::regclass);


--
-- Name: currency_conversion_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_conversion_history ALTER COLUMN id SET DEFAULT nextval('public.currency_conversion_history_id_seq'::regclass);


--
-- Name: exchange_rate_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rate_history ALTER COLUMN id SET DEFAULT nextval('public.exchange_rate_history_id_seq'::regclass);


--
-- Name: exchange_rates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates ALTER COLUMN id SET DEFAULT nextval('public.exchange_rates_id_seq'::regclass);


--
-- Name: expenditure_line_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditure_line_items ALTER COLUMN id SET DEFAULT nextval('public.expenditure_line_items_id_seq'::regclass);


--
-- Name: expenditures id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditures ALTER COLUMN id SET DEFAULT nextval('public.expenditures_id_seq'::regclass);


--
-- Name: expense_receipts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_receipts ALTER COLUMN id SET DEFAULT nextval('public.expense_receipts_id_seq'::regclass);


--
-- Name: login_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_history ALTER COLUMN id SET DEFAULT nextval('public.login_history_id_seq'::regclass);


--
-- Name: maintenance_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_records ALTER COLUMN id SET DEFAULT nextval('public.maintenance_records_id_seq'::regclass);


--
-- Name: member_balances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_balances ALTER COLUMN id SET DEFAULT nextval('public.member_balances_id_seq'::regclass);


--
-- Name: member_contributions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_contributions ALTER COLUMN id SET DEFAULT nextval('public.member_contributions_id_seq'::regclass);


--
-- Name: member_projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_projects ALTER COLUMN id SET DEFAULT nextval('public.member_projects_id_seq'::regclass);


--
-- Name: members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members ALTER COLUMN id SET DEFAULT nextval('public.members_id_seq'::regclass);


--
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- Name: payment_methods id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods ALTER COLUMN id SET DEFAULT nextval('public.payment_methods_id_seq'::regclass);


--
-- Name: payment_pattern_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_pattern_history ALTER COLUMN id SET DEFAULT nextval('public.payment_pattern_history_id_seq'::regclass);


--
-- Name: payment_reminders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_reminders ALTER COLUMN id SET DEFAULT nextval('public.payment_reminders_id_seq'::regclass);


--
-- Name: project_documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_documents ALTER COLUMN id SET DEFAULT nextval('public.project_documents_id_seq'::regclass);


--
-- Name: project_milestones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_milestones ALTER COLUMN id SET DEFAULT nextval('public.project_milestones_id_seq'::regclass);


--
-- Name: project_tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_tasks ALTER COLUMN id SET DEFAULT nextval('public.project_tasks_id_seq'::regclass);


--
-- Name: project_updates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_updates ALTER COLUMN id SET DEFAULT nextval('public.project_updates_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: refunds id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refunds ALTER COLUMN id SET DEFAULT nextval('public.refunds_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: supplier_evaluations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_evaluations ALTER COLUMN id SET DEFAULT nextval('public.supplier_evaluations_id_seq'::regclass);


--
-- Name: supplier_status_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_status_history ALTER COLUMN id SET DEFAULT nextval('public.supplier_status_history_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: _CurrencyToCurrencyConversionHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_CurrencyToCurrencyConversionHistory" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
59743247-cc92-4393-b668-a02a16a3f128	b470a7ba97776077e020a391005c13e8238f7fab2bed7b408eec1079a778fbd5	2025-08-26 10:16:11.421731+02	20250730171737_create_all_tables	\N	\N	2025-08-26 10:16:11.408151+02	1
b5f46070-d784-4c5b-8ce4-65f247282de6	cc7d9f5fddc0be77e9b24040e83c3c108241c5f50596858cfe4121a7281d00b9	2025-08-26 10:16:28.071468+02	20250826081627_new_migrations	\N	\N	2025-08-26 10:16:28.01242+02	1
\.


--
-- Data for Name: approval_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.approval_history (id, expenditure_id, approver_level, approved_by, status, comments, approved_at) FROM stdin;
\.


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assets (id, asset_number, name, description, category, expenditure_id, branch_code, purchase_price, current_value, currency_code, purchase_date, warranty_expiry, condition, location, assigned_to, depreciation_rate, is_insured, insurance_expiry, serial_number, barcode, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, username, action, table_name, record_id, old_values, new_values, ip_address, user_agent, "timestamp") FROM stdin;
1	1	admin	CREATE	revenue_heads	00R006	null	"{\\"code\\":\\"00R006\\",\\"name\\":\\"Thanks giving\\",\\"description\\":null,\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"createdAt\\":\\"2025-08-26T13:59:15.541Z\\",\\"updatedAt\\":\\"2025-08-26T13:59:15.541Z\\"}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-26 15:59:15.548+02
2	1	admin	DELETE	revenue_heads	00R006	"{\\"code\\":\\"00R006\\",\\"name\\":\\"Thanks giving\\",\\"description\\":null,\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"createdAt\\":\\"2025-08-26T13:59:15.541Z\\",\\"updatedAt\\":\\"2025-08-26T13:59:15.541Z\\",\\"_count\\":{\\"transactions\\":0,\\"contributionPlans\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-26 15:59:32.425+02
3	1	admin	CREATE	revenue_heads	00R006	null	"{\\"code\\":\\"00R006\\",\\"name\\":\\"thanks giving\\",\\"description\\":null,\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"createdAt\\":\\"2025-08-26T14:02:21.740Z\\",\\"updatedAt\\":\\"2025-08-26T14:02:21.740Z\\"}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-26 16:02:21.744+02
4	1	admin	CREATE	revenue_heads	00R007	null	"{\\"code\\":\\"00R007\\",\\"name\\":\\"thanks\\",\\"description\\":null,\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"createdAt\\":\\"2025-08-26T14:02:26.611Z\\",\\"updatedAt\\":\\"2025-08-26T14:02:26.611Z\\"}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-26 16:02:26.62+02
5	1	admin	CREATE	revenue_heads	00R008	null	"{\\"code\\":\\"00R008\\",\\"name\\":\\"other\\",\\"description\\":null,\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"createdAt\\":\\"2025-08-26T14:02:30.923Z\\",\\"updatedAt\\":\\"2025-08-26T14:02:30.923Z\\"}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-26 16:02:30.932+02
6	1	admin	DELETE	revenue_heads	00R005	"{\\"code\\":\\"00R005\\",\\"name\\":\\"Donations\\",\\"description\\":null,\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"createdAt\\":\\"2025-08-26T08:16:40.331Z\\",\\"updatedAt\\":\\"2025-08-26T08:16:40.331Z\\",\\"_count\\":{\\"transactions\\":0,\\"contributionPlans\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-26 16:03:24.044+02
7	1	admin	DELETE	revenue_heads	00R008	"{\\"code\\":\\"00R008\\",\\"name\\":\\"other\\",\\"description\\":null,\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"createdAt\\":\\"2025-08-26T14:02:30.923Z\\",\\"updatedAt\\":\\"2025-08-26T14:02:30.923Z\\",\\"_count\\":{\\"transactions\\":0,\\"contributionPlans\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-26 16:03:26.98+02
8	1	admin	DELETE	revenue_heads	00R001	"{\\"code\\":\\"00R001\\",\\"name\\":\\"Tithes\\",\\"description\\":null,\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"createdAt\\":\\"2025-08-26T08:16:40.331Z\\",\\"updatedAt\\":\\"2025-08-26T08:16:40.331Z\\",\\"_count\\":{\\"transactions\\":0,\\"contributionPlans\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-26 16:03:33.446+02
9	1	admin	CREATE	members	1	null	"{\\"id\\":1,\\"memberNumber\\":\\"98765\\",\\"firstName\\":\\"Jane\\",\\"lastName\\":\\"Doe\\",\\"dateOfBirth\\":\\"1995-07-21T00:00:00.000Z\\",\\"ageCategory\\":\\"CHILD\\",\\"phoneNumber\\":\\"555-123-4567\\",\\"email\\":\\"jane.doe@example.com\\",\\"address\\":\\"456 Oak Avenue, Anytown, USA\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-28T09:58:38.762Z\\",\\"createdAt\\":\\"2025-08-28T09:58:38.762Z\\",\\"updatedAt\\":\\"2025-08-28T09:58:38.762Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	PostmanRuntime/7.45.0	2025-08-28 11:58:38.773+02
10	1	admin	CREATE	members	2	null	"{\\"id\\":2,\\"memberNumber\\":\\"98769\\",\\"firstName\\":\\"Janje\\",\\"lastName\\":\\"Dreap\\",\\"dateOfBirth\\":\\"1995-07-21T00:00:00.000Z\\",\\"ageCategory\\":\\"CHILD\\",\\"phoneNumber\\":\\"555-123-4567\\",\\"email\\":\\"jane.doe@example.com\\",\\"address\\":\\"456 Oak Avenue, Anytown, USA\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-28T11:55:34.821Z\\",\\"createdAt\\":\\"2025-08-28T11:55:34.821Z\\",\\"updatedAt\\":\\"2025-08-28T11:55:34.821Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	PostmanRuntime/7.45.0	2025-08-28 13:55:34.826+02
11	1	admin	CREATE	members	3	null	"{\\"id\\":3,\\"memberNumber\\":\\"12345\\",\\"firstName\\":\\"james\\",\\"lastName\\":\\"Majoni\\",\\"dateOfBirth\\":\\"2001-01-10T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+263772830466\\",\\"email\\":\\"wendy@gmail.com\\",\\"address\\":\\"23 rf norton\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-28T11:58:49.828Z\\",\\"createdAt\\":\\"2025-08-28T11:58:49.828Z\\",\\"updatedAt\\":\\"2025-08-28T11:58:49.828Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	2025-08-28 13:58:49.832+02
12	1	admin	CREATE	members	4	null	"{\\"id\\":4,\\"memberNumber\\":\\"1233\\",\\"firstName\\":\\"itai\\",\\"lastName\\":\\"malcom\\",\\"dateOfBirth\\":\\"2001-01-10T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+263772830466\\",\\"email\\":\\"wendyZ@gmail.com\\",\\"address\\":\\"23 harare\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-28T12:00:57.515Z\\",\\"createdAt\\":\\"2025-08-28T12:00:57.515Z\\",\\"updatedAt\\":\\"2025-08-28T12:00:57.515Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	2025-08-28 14:00:57.525+02
13	1	admin	CREATE	members	5	null	"{\\"id\\":5,\\"memberNumber\\":\\"891\\",\\"firstName\\":\\"Kudzai\\",\\"lastName\\":\\"johnny\\",\\"dateOfBirth\\":\\"2002-05-03T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+263772830466\\",\\"email\\":\\"rcmurei1@gmail.com\\",\\"address\\":\\"12 nharira\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-28T12:23:03.898Z\\",\\"createdAt\\":\\"2025-08-28T12:23:03.898Z\\",\\"updatedAt\\":\\"2025-08-28T12:23:03.898Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	2025-08-28 14:23:03.906+02
14	1	admin	CREATE	members	6	null	"{\\"id\\":6,\\"memberNumber\\":\\"133\\",\\"firstName\\":\\"Tauya\\",\\"lastName\\":\\"Mhangami\\",\\"dateOfBirth\\":\\"1971-04-05T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+63772288819\\",\\"email\\":\\"tauya.mhangami@gmail.com\\",\\"address\\":\\"14555 Knowe\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-28T13:09:48.184Z\\",\\"createdAt\\":\\"2025-08-28T13:09:48.184Z\\",\\"updatedAt\\":\\"2025-08-28T13:09:48.184Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-28 15:09:48.188+02
15	1	admin	DELETE	members	6	"{\\"id\\":6,\\"memberNumber\\":\\"133\\",\\"firstName\\":\\"Tauya\\",\\"lastName\\":\\"Mhangami\\",\\"dateOfBirth\\":\\"1971-04-05T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+63772288819\\",\\"email\\":\\"tauya.mhangami@gmail.com\\",\\"address\\":\\"14555 Knowe\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-28T13:09:48.184Z\\",\\"createdAt\\":\\"2025-08-28T13:09:48.184Z\\",\\"updatedAt\\":\\"2025-08-28T13:09:48.184Z\\",\\"_count\\":{\\"contributions\\":0,\\"generalTransactions\\":0,\\"memberProjects\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-29 21:37:51.292+02
16	1	admin	DELETE	members	5	"{\\"id\\":5,\\"memberNumber\\":\\"891\\",\\"firstName\\":\\"Kudzai\\",\\"lastName\\":\\"johnny\\",\\"dateOfBirth\\":\\"2002-05-03T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+263772830466\\",\\"email\\":\\"rcmurei1@gmail.com\\",\\"address\\":\\"12 nharira\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-28T12:23:03.898Z\\",\\"createdAt\\":\\"2025-08-28T12:23:03.898Z\\",\\"updatedAt\\":\\"2025-08-28T12:23:03.898Z\\",\\"_count\\":{\\"contributions\\":0,\\"generalTransactions\\":0,\\"memberProjects\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-29 21:38:17.788+02
17	1	admin	DELETE	members	1	"{\\"id\\":1,\\"memberNumber\\":\\"98765\\",\\"firstName\\":\\"Jane\\",\\"lastName\\":\\"Doe\\",\\"dateOfBirth\\":\\"1995-07-21T00:00:00.000Z\\",\\"ageCategory\\":\\"CHILD\\",\\"phoneNumber\\":\\"555-123-4567\\",\\"email\\":\\"jane.doe@example.com\\",\\"address\\":\\"456 Oak Avenue, Anytown, USA\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-28T09:58:38.762Z\\",\\"createdAt\\":\\"2025-08-28T09:58:38.762Z\\",\\"updatedAt\\":\\"2025-08-28T09:58:38.762Z\\",\\"_count\\":{\\"contributions\\":0,\\"generalTransactions\\":0,\\"memberProjects\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-29 21:39:18.235+02
18	1	admin	DELETE	members	2	"{\\"id\\":2,\\"memberNumber\\":\\"98769\\",\\"firstName\\":\\"Janje\\",\\"lastName\\":\\"Dreap\\",\\"dateOfBirth\\":\\"1995-07-21T00:00:00.000Z\\",\\"ageCategory\\":\\"CHILD\\",\\"phoneNumber\\":\\"555-123-4567\\",\\"email\\":\\"jane.doe@example.com\\",\\"address\\":\\"456 Oak Avenue, Anytown, USA\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-28T11:55:34.821Z\\",\\"createdAt\\":\\"2025-08-28T11:55:34.821Z\\",\\"updatedAt\\":\\"2025-08-28T11:55:34.821Z\\",\\"_count\\":{\\"contributions\\":0,\\"generalTransactions\\":0,\\"memberProjects\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-29 21:41:12.858+02
19	1	admin	DELETE	members	4	"{\\"id\\":4,\\"memberNumber\\":\\"1233\\",\\"firstName\\":\\"itai\\",\\"lastName\\":\\"malcom\\",\\"dateOfBirth\\":\\"2001-01-10T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+263772830466\\",\\"email\\":\\"wendyZ@gmail.com\\",\\"address\\":\\"23 harare\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-28T12:00:57.515Z\\",\\"createdAt\\":\\"2025-08-28T12:00:57.515Z\\",\\"updatedAt\\":\\"2025-08-28T12:00:57.515Z\\",\\"_count\\":{\\"contributions\\":0,\\"generalTransactions\\":0,\\"memberProjects\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-29 21:50:19.244+02
20	1	admin	DELETE	members	3	"{\\"id\\":3,\\"memberNumber\\":\\"12345\\",\\"firstName\\":\\"james\\",\\"lastName\\":\\"Majoni\\",\\"dateOfBirth\\":\\"2001-01-10T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+263772830466\\",\\"email\\":\\"wendy@gmail.com\\",\\"address\\":\\"23 rf norton\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-28T11:58:49.828Z\\",\\"createdAt\\":\\"2025-08-28T11:58:49.828Z\\",\\"updatedAt\\":\\"2025-08-28T11:58:49.828Z\\",\\"_count\\":{\\"contributions\\":0,\\"generalTransactions\\":0,\\"memberProjects\\":0}}"	null	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	2025-08-29 23:12:18.412+02
21	1	admin	CREATE	branches	01	null	"{\\"code\\":\\"01\\",\\"name\\":\\"Bindura Branch\\",\\"address\\":null,\\"phoneNumber\\":null,\\"isActive\\":true,\\"createdAt\\":\\"2025-08-29T21:16:20.355Z\\",\\"updatedAt\\":\\"2025-08-29T21:16:20.355Z\\"}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-29 23:16:20.358+02
22	1	admin	CREATE	members	7	null	"{\\"id\\":7,\\"memberNumber\\":\\"98769\\",\\"firstName\\":\\"Janje\\",\\"lastName\\":\\"Dreap\\",\\"dateOfBirth\\":\\"1995-07-21T00:00:00.000Z\\",\\"ageCategory\\":\\"CHILD\\",\\"phoneNumber\\":\\"555-123-4567\\",\\"email\\":\\"jane.doe@example.com\\",\\"address\\":\\"456 Oak Avenue, Anytown, USA\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-29T21:20:15.200Z\\",\\"createdAt\\":\\"2025-08-29T21:20:15.200Z\\",\\"updatedAt\\":\\"2025-08-29T21:20:15.200Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	PostmanRuntime/7.45.0	2025-08-29 23:20:15.206+02
23	1	admin	CREATE	members	8	null	"{\\"id\\":8,\\"memberNumber\\":\\"54321\\",\\"firstName\\":\\"anesu\\",\\"lastName\\":\\"Chiridza\\",\\"dateOfBirth\\":\\"2002-05-03T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+263772830466\\",\\"email\\":\\"wendy@gmail.com\\",\\"address\\":\\"katanga\\",\\"branchCode\\":\\"01\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-29T21:36:42.419Z\\",\\"createdAt\\":\\"2025-08-29T21:36:42.419Z\\",\\"updatedAt\\":\\"2025-08-29T21:36:42.419Z\\",\\"branch\\":{\\"name\\":\\"Bindura Branch\\"}}"	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	2025-08-29 23:36:42.422+02
24	1	admin	DELETE	members	7	"{\\"id\\":7,\\"memberNumber\\":\\"98769\\",\\"firstName\\":\\"Janje\\",\\"lastName\\":\\"Dreap\\",\\"dateOfBirth\\":\\"1995-07-21T00:00:00.000Z\\",\\"ageCategory\\":\\"CHILD\\",\\"phoneNumber\\":\\"555-123-4567\\",\\"email\\":\\"jane.doe@example.com\\",\\"address\\":\\"456 Oak Avenue, Anytown, USA\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-29T21:20:15.200Z\\",\\"createdAt\\":\\"2025-08-29T21:20:15.200Z\\",\\"updatedAt\\":\\"2025-08-29T21:20:15.200Z\\",\\"_count\\":{\\"contributions\\":0,\\"generalTransactions\\":0,\\"memberProjects\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-29 23:37:56.985+02
25	1	admin	CREATE	members	9	null	"{\\"id\\":9,\\"memberNumber\\":\\"234\\",\\"firstName\\":\\"Tina\\",\\"lastName\\":\\"mira\\",\\"dateOfBirth\\":\\"2000-05-08T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+63772288819\\",\\"email\\":\\"rcmurei1@gmail.com\\",\\"address\\":\\"we\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-29T21:53:57.695Z\\",\\"createdAt\\":\\"2025-08-29T21:53:57.695Z\\",\\"updatedAt\\":\\"2025-08-29T21:53:57.695Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-29 23:53:57.703+02
26	1	admin	DELETE	members	9	"{\\"id\\":9,\\"memberNumber\\":\\"234\\",\\"firstName\\":\\"Tina\\",\\"lastName\\":\\"mira\\",\\"dateOfBirth\\":\\"2000-05-08T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+63772288819\\",\\"email\\":\\"rcmurei1@gmail.com\\",\\"address\\":\\"we\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-29T21:53:57.695Z\\",\\"createdAt\\":\\"2025-08-29T21:53:57.695Z\\",\\"updatedAt\\":\\"2025-08-29T21:53:57.695Z\\",\\"_count\\":{\\"contributions\\":0,\\"generalTransactions\\":0,\\"memberProjects\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-29 23:57:31.552+02
27	1	admin	CREATE	members	10	null	"{\\"id\\":10,\\"memberNumber\\":\\"970\\",\\"firstName\\":\\"Jona\\",\\"lastName\\":\\"nyakudya\\",\\"dateOfBirth\\":\\"1980-07-09T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+263772830466\\",\\"email\\":\\"kmfodmfodmfd@gmail.com\\",\\"address\\":\\"3 knowe\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-29T21:58:20.862Z\\",\\"createdAt\\":\\"2025-08-29T21:58:20.862Z\\",\\"updatedAt\\":\\"2025-08-29T21:58:20.862Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-29 23:58:20.87+02
28	1	admin	CREATE	members	11	null	"{\\"id\\":11,\\"memberNumber\\":\\"098\\",\\"firstName\\":\\"Tadiwa\\",\\"lastName\\":\\"ngoni\\",\\"dateOfBirth\\":\\"2001-05-03T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+63772288819\\",\\"email\\":\\"rcmurei1@gmail.com\\",\\"address\\":\\"5 jacaranda close\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-29T22:01:54.605Z\\",\\"createdAt\\":\\"2025-08-29T22:01:54.605Z\\",\\"updatedAt\\":\\"2025-08-29T22:01:54.605Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-30 00:01:54.614+02
29	1	admin	CREATE	members	12	null	"{\\"id\\":12,\\"memberNumber\\":\\"145\\",\\"firstName\\":\\"Glen\\",\\"lastName\\":\\"Chiridza\\",\\"dateOfBirth\\":\\"2004-04-04T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+263772830466\\",\\"email\\":\\"rcmurei1@gmail.com\\",\\"address\\":\\"3 glenview\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-29T22:05:27.577Z\\",\\"createdAt\\":\\"2025-08-29T22:05:27.577Z\\",\\"updatedAt\\":\\"2025-08-29T22:05:27.577Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-30 00:05:27.584+02
30	1	admin	DELETE	members	12	"{\\"id\\":12,\\"memberNumber\\":\\"145\\",\\"firstName\\":\\"Glen\\",\\"lastName\\":\\"Chiridza\\",\\"dateOfBirth\\":\\"2004-04-04T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+263772830466\\",\\"email\\":\\"rcmurei1@gmail.com\\",\\"address\\":\\"3 glenview\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-29T22:05:27.577Z\\",\\"createdAt\\":\\"2025-08-29T22:05:27.577Z\\",\\"updatedAt\\":\\"2025-08-29T22:05:27.577Z\\",\\"_count\\":{\\"contributions\\":0,\\"generalTransactions\\":0,\\"memberProjects\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-30 11:49:02.535+02
31	1	admin	CREATE	members	13	null	"{\\"id\\":13,\\"memberNumber\\":\\"568\\",\\"firstName\\":\\"Simbarashe\\",\\"lastName\\":\\"Mukuvari\\",\\"dateOfBirth\\":\\"1998-08-02T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+263772830466\\",\\"email\\":\\"simcasper@gmail.com\\",\\"address\\":\\"4 jacaranda close\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-30T09:51:44.923Z\\",\\"createdAt\\":\\"2025-08-30T09:51:44.923Z\\",\\"updatedAt\\":\\"2025-08-30T09:51:44.923Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-30 11:51:44.932+02
32	1	admin	CREATE	members	14	null	"{\\"id\\":14,\\"memberNumber\\":\\"543218\\",\\"firstName\\":\\"Juliet\\",\\"lastName\\":\\"malcom\\",\\"dateOfBirth\\":\\"1999-09-09T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+63772288819\\",\\"email\\":\\"glen.chiridza@nbs.co.zw\\",\\"address\\":\\"45 Jacaranda close\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-30T09:55:46.348Z\\",\\"createdAt\\":\\"2025-08-30T09:55:46.348Z\\",\\"updatedAt\\":\\"2025-08-30T09:55:46.348Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-30 11:55:46.356+02
33	1	admin	CREATE	members	15	null	"{\\"id\\":15,\\"memberNumber\\":\\"891\\",\\"firstName\\":\\"itai\\",\\"lastName\\":\\"Mukuvari\\",\\"dateOfBirth\\":\\"2003-01-01T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+63772288819\\",\\"email\\":\\"rcmurei1@gmail.com\\",\\"address\\":\\"weren park\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-30T10:01:51.854Z\\",\\"createdAt\\":\\"2025-08-30T10:01:51.854Z\\",\\"updatedAt\\":\\"2025-08-30T10:01:51.854Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-30 12:01:51.868+02
34	1	admin	DELETE	members	15	"{\\"id\\":15,\\"memberNumber\\":\\"891\\",\\"firstName\\":\\"itai\\",\\"lastName\\":\\"Mukuvari\\",\\"dateOfBirth\\":\\"2003-01-01T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+63772288819\\",\\"email\\":\\"rcmurei1@gmail.com\\",\\"address\\":\\"weren park\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-30T10:01:51.854Z\\",\\"createdAt\\":\\"2025-08-30T10:01:51.854Z\\",\\"updatedAt\\":\\"2025-08-30T10:01:51.854Z\\",\\"_count\\":{\\"contributions\\":0,\\"generalTransactions\\":0,\\"memberProjects\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-30 12:02:07.094+02
35	1	admin	DELETE	members	14	"{\\"id\\":14,\\"memberNumber\\":\\"543218\\",\\"firstName\\":\\"Juliet\\",\\"lastName\\":\\"malcom\\",\\"dateOfBirth\\":\\"1999-09-09T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+63772288819\\",\\"email\\":\\"glen.chiridza@nbs.co.zw\\",\\"address\\":\\"45 Jacaranda close\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-30T09:55:46.348Z\\",\\"createdAt\\":\\"2025-08-30T09:55:46.348Z\\",\\"updatedAt\\":\\"2025-08-30T09:55:46.348Z\\",\\"_count\\":{\\"contributions\\":0,\\"generalTransactions\\":0,\\"memberProjects\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-08-30 12:02:16.348+02
36	1	admin	CREATE	members	16	null	"{\\"id\\":16,\\"memberNumber\\":\\"48291\\",\\"firstName\\":\\"James\\",\\"lastName\\":\\"Carter\\",\\"dateOfBirth\\":\\"1987-04-12T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"555-839-2741\\",\\"email\\":\\"james.carter@example.com\\",\\"address\\":\\"123 Maple Street, Anytown, USA\\",\\"branchCode\\":\\"00\\",\\"isActive\\":true,\\"joinedDate\\":\\"2025-08-30T10:20:27.306Z\\",\\"createdAt\\":\\"2025-08-30T10:20:27.306Z\\",\\"updatedAt\\":\\"2025-08-30T10:20:27.306Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	PostmanRuntime/7.45.0	2025-08-30 12:20:27.31+02
37	1	admin	CREATE	members	17	null	"{\\"id\\":17,\\"memberNumber\\":\\"35039\\",\\"firstName\\":\\"Natalie\\",\\"lastName\\":\\"Castillo\\",\\"dateOfBirth\\":\\"1966-11-18T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"+1-324-135-5366x3687\\",\\"email\\":\\"maryburke@hotmail.com\\",\\"address\\":\\"195 Lowe Dale Suite 211, Cunninghamland, NM 50259\\",\\"branchCode\\":\\"00\\",\\"isActive\\":false,\\"joinedDate\\":\\"2025-08-30T10:20:58.229Z\\",\\"createdAt\\":\\"2025-08-30T10:20:58.229Z\\",\\"updatedAt\\":\\"2025-08-30T10:20:58.229Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	PostmanRuntime/7.45.0	2025-08-30 12:20:58.231+02
38	1	admin	CREATE	members	18	null	"{\\"id\\":18,\\"memberNumber\\":\\"95212\\",\\"firstName\\":\\"Tyler\\",\\"lastName\\":\\"Murray\\",\\"dateOfBirth\\":\\"1968-12-19T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"713-220-4554x576\\",\\"email\\":\\"calderondonald@arias.com\\",\\"address\\":\\"Unit 7024 Box 4082, DPO AE 44395\\",\\"branchCode\\":\\"00\\",\\"isActive\\":false,\\"joinedDate\\":\\"2025-08-30T10:21:36.292Z\\",\\"createdAt\\":\\"2025-08-30T10:21:36.292Z\\",\\"updatedAt\\":\\"2025-08-30T10:21:36.292Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	PostmanRuntime/7.45.0	2025-08-30 12:21:36.3+02
39	1	admin	CREATE	members	19	null	"{\\"id\\":19,\\"memberNumber\\":\\"63410\\",\\"firstName\\":\\"Amanda\\",\\"lastName\\":\\"Moore\\",\\"dateOfBirth\\":\\"1948-06-07T00:00:00.000Z\\",\\"ageCategory\\":\\"ADULT\\",\\"phoneNumber\\":\\"610.656.5972\\",\\"email\\":\\"pcruz@hotmail.com\\",\\"address\\":\\"30331 Pearson Isle Apt. 760, Barnesport, WV 58099\\",\\"branchCode\\":\\"00\\",\\"isActive\\":false,\\"joinedDate\\":\\"2025-08-30T10:22:50.270Z\\",\\"createdAt\\":\\"2025-08-30T10:22:50.270Z\\",\\"updatedAt\\":\\"2025-08-30T10:22:50.270Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	PostmanRuntime/7.45.0	2025-08-30 12:22:50.281+02
40	1	admin	CREATE	members	20	null	"{\\"id\\":20,\\"memberNumber\\":\\"75694\\",\\"firstName\\":\\"Tammy\\",\\"lastName\\":\\"Porter\\",\\"dateOfBirth\\":\\"1979-03-20T00:00:00.000Z\\",\\"ageCategory\\":\\"YOUTH\\",\\"phoneNumber\\":\\"760.686.4665x0435\\",\\"email\\":\\"qvincent@thompson-nelson.biz\\",\\"address\\":\\"18094 Church Road Suite 429, North Austin, AL 74490\\",\\"branchCode\\":\\"00\\",\\"isActive\\":false,\\"joinedDate\\":\\"2025-08-30T10:23:37.089Z\\",\\"createdAt\\":\\"2025-08-30T10:23:37.089Z\\",\\"updatedAt\\":\\"2025-08-30T10:23:37.089Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	PostmanRuntime/7.45.0	2025-08-30 12:23:37.092+02
41	1	admin	CREATE	members	21	null	"{\\"id\\":21,\\"memberNumber\\":\\"71722\\",\\"firstName\\":\\"David\\",\\"lastName\\":\\"Ramirez\\",\\"dateOfBirth\\":\\"1979-06-07T00:00:00.000Z\\",\\"ageCategory\\":\\"YOUTH\\",\\"phoneNumber\\":\\"(094)853-3580x219\\",\\"email\\":\\"careysamuel@campbell-whitaker.com\\",\\"address\\":\\"40329 Orr Camp, Connerview, ND 26529\\",\\"branchCode\\":\\"00\\",\\"isActive\\":false,\\"joinedDate\\":\\"2025-08-30T10:28:29.047Z\\",\\"createdAt\\":\\"2025-08-30T10:28:29.047Z\\",\\"updatedAt\\":\\"2025-08-30T10:28:29.047Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	PostmanRuntime/7.45.0	2025-08-30 12:28:29.052+02
42	1	admin	CREATE	members	22	null	"{\\"id\\":22,\\"memberNumber\\":\\"18267\\",\\"firstName\\":\\"Jon\\",\\"lastName\\":\\"Lee\\",\\"dateOfBirth\\":\\"1961-10-20T00:00:00.000Z\\",\\"ageCategory\\":\\"CHILD\\",\\"phoneNumber\\":\\"(896)306-1813x0760\\",\\"email\\":\\"ysmith@hotmail.com\\",\\"address\\":\\"9105 Anthony Locks Suite 292, Randytown, DE 27219\\",\\"branchCode\\":\\"00\\",\\"isActive\\":false,\\"joinedDate\\":\\"2025-08-30T10:31:01.428Z\\",\\"createdAt\\":\\"2025-08-30T10:31:01.428Z\\",\\"updatedAt\\":\\"2025-08-30T10:31:01.428Z\\",\\"branch\\":{\\"name\\":\\"Head Office\\"}}"	::1	PostmanRuntime/7.45.0	2025-08-30 12:31:01.431+02
43	1	admin	DELETE	members	21	"{\\"id\\":21,\\"memberNumber\\":\\"71722\\",\\"firstName\\":\\"David\\",\\"lastName\\":\\"Ramirez\\",\\"dateOfBirth\\":\\"1979-06-07T00:00:00.000Z\\",\\"ageCategory\\":\\"YOUTH\\",\\"phoneNumber\\":\\"(094)853-3580x219\\",\\"email\\":\\"careysamuel@campbell-whitaker.com\\",\\"address\\":\\"40329 Orr Camp, Connerview, ND 26529\\",\\"branchCode\\":\\"00\\",\\"isActive\\":false,\\"joinedDate\\":\\"2025-08-30T10:28:29.047Z\\",\\"createdAt\\":\\"2025-08-30T10:28:29.047Z\\",\\"updatedAt\\":\\"2025-08-30T10:28:29.047Z\\",\\"_count\\":{\\"contributions\\":0,\\"generalTransactions\\":0,\\"memberProjects\\":0}}"	null	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-09-01 11:55:10.27+02
44	1	admin	CREATE	branches	02	null	"{\\"code\\":\\"02\\",\\"name\\":\\"Gweru Branch\\",\\"address\\":null,\\"phoneNumber\\":null,\\"isActive\\":true,\\"createdAt\\":\\"2025-09-01T11:53:15.851Z\\",\\"updatedAt\\":\\"2025-09-01T11:53:15.851Z\\"}"	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-09-01 13:53:15.857+02
45	1	admin	CREATE	users	2	null	"{\\"id\\":2,\\"username\\":\\"anesu\\",\\"firstName\\":\\"anesu\\",\\"lastName\\":\\"nyakonda\\",\\"email\\":\\"nyakondaa@africau.edu\\",\\"phoneNumber\\":\\"0772830466\\",\\"role\\":{\\"id\\":2,\\"name\\":\\"supervisor\\"},\\"branch\\":{\\"code\\":\\"00\\",\\"name\\":\\"Head Office\\"},\\"isActive\\":true,\\"createdAt\\":\\"2025-09-02T08:05:57.786Z\\",\\"createdBy\\":\\"admin\\"}"	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-09-02 10:05:57.797+02
46	1	admin	CREATE	users	3	null	"{\\"id\\":3,\\"username\\":\\"sifisomahlangu\\",\\"firstName\\":\\"sifiso\\",\\"lastName\\":\\"mahlangu\\",\\"email\\":\\"sifisomahlangu@gmail.com\\",\\"phoneNumber\\":\\"07798176975\\",\\"role\\":{\\"id\\":3,\\"name\\":\\"cashier\\"},\\"branch\\":{\\"code\\":\\"00\\",\\"name\\":\\"Head Office\\"},\\"isActive\\":true,\\"createdAt\\":\\"2025-09-09T08:18:14.991Z\\",\\"createdBy\\":\\"admin\\"}"	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-09-09 10:18:15+02
47	1	admin	DELETE	users	3	"{\\"id\\":3,\\"username\\":\\"sifisomahlangu\\",\\"password_hash\\":\\"$2b$12$32wL00jH0hpDrXZtM1ixjeol0/rzypKREdD6eSGW4tswkxyj1mdKi\\",\\"firstName\\":\\"sifiso\\",\\"lastName\\":\\"mahlangu\\",\\"email\\":\\"sifisomahlangu@gmail.com\\",\\"phoneNumber\\":\\"07798176975\\",\\"roleId\\":3,\\"branchCode\\":\\"00\\",\\"locked\\":false,\\"attempts\\":0,\\"lastLogin\\":\\"2025-09-09T08:54:29.278Z\\",\\"isActive\\":true,\\"createdAt\\":\\"2025-09-09T08:18:14.991Z\\",\\"updatedAt\\":\\"2025-09-09T08:54:29.279Z\\",\\"createdBy\\":\\"admin\\"}"	null	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-09-09 10:55:51.955+02
48	1	admin	CREATE	users	4	null	"{\\"id\\":4,\\"username\\":\\"sifisom\\",\\"firstName\\":\\"sifiso\\",\\"lastName\\":\\"mahlangu\\",\\"email\\":\\"mahlangu.sifiso@nbs.co.zw\\",\\"phoneNumber\\":\\"0778176975\\",\\"role\\":{\\"id\\":3,\\"name\\":\\"cashier\\"},\\"branch\\":{\\"code\\":\\"02\\",\\"name\\":\\"Gweru Branch\\"},\\"isActive\\":true,\\"createdAt\\":\\"2025-09-09T08:58:08.171Z\\",\\"createdBy\\":\\"admin\\"}"	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-09-09 10:58:08.179+02
49	1	admin	DELETE	users	2	"{\\"id\\":2,\\"username\\":\\"anesu\\",\\"password_hash\\":\\"$2b$12$vpCGCRnt1hecIcUgOxRuSuFJ9a5hqHIovUEW3KzU6hiIXEWEwTvW.\\",\\"firstName\\":\\"anesu\\",\\"lastName\\":\\"nyakonda\\",\\"email\\":\\"nyakondaa@africau.edu\\",\\"phoneNumber\\":\\"0772830466\\",\\"roleId\\":2,\\"branchCode\\":\\"00\\",\\"locked\\":false,\\"attempts\\":0,\\"lastLogin\\":null,\\"isActive\\":true,\\"createdAt\\":\\"2025-09-02T08:05:57.786Z\\",\\"updatedAt\\":\\"2025-09-02T08:05:57.786Z\\",\\"createdBy\\":\\"admin\\"}"	null	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-09-09 11:01:37.608+02
50	1	admin	CREATE	users	5	null	"{\\"id\\":5,\\"username\\":\\"anesunyakonda\\",\\"firstName\\":\\"anesu\\",\\"lastName\\":\\"nyakonda\\",\\"email\\":\\"nyakonda.anesu@nbs.co.zw\\",\\"phoneNumber\\":\\"0789045158\\",\\"role\\":{\\"id\\":2,\\"name\\":\\"supervisor\\"},\\"branch\\":{\\"code\\":\\"02\\",\\"name\\":\\"Gweru Branch\\"},\\"isActive\\":true,\\"createdAt\\":\\"2025-09-09T09:02:24.850Z\\",\\"createdBy\\":\\"admin\\"}"	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-09-09 11:02:24.859+02
51	1	admin	DELETE	users	5	"{\\"id\\":5,\\"username\\":\\"anesunyakonda\\",\\"password_hash\\":\\"$2b$12$y4Io8UqJSe4tj26KCPOV2eBZ5Z6NXL8ZDij5/LSatjYLnBP9kNkke\\",\\"firstName\\":\\"anesu\\",\\"lastName\\":\\"nyakonda\\",\\"email\\":\\"nyakonda.anesu@nbs.co.zw\\",\\"phoneNumber\\":\\"0789045158\\",\\"roleId\\":2,\\"branchCode\\":\\"02\\",\\"locked\\":false,\\"attempts\\":0,\\"lastLogin\\":\\"2025-09-09T09:02:43.809Z\\",\\"isActive\\":true,\\"createdAt\\":\\"2025-09-09T09:02:24.850Z\\",\\"updatedAt\\":\\"2025-09-09T09:02:43.810Z\\",\\"createdBy\\":\\"admin\\"}"	null	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-09-09 11:05:20.822+02
52	1	admin	DELETE	users	4	"{\\"id\\":4,\\"username\\":\\"sifisom\\",\\"password_hash\\":\\"$2b$12$k4Y1ITL5NVbLHD8/fL5QMODCWXpSc1FgjpiiexVp42rfYGUwd2TQq\\",\\"firstName\\":\\"sifiso\\",\\"lastName\\":\\"mahlangu\\",\\"email\\":\\"mahlangu.sifiso@nbs.co.zw\\",\\"phoneNumber\\":\\"0778176975\\",\\"roleId\\":3,\\"branchCode\\":\\"02\\",\\"locked\\":false,\\"attempts\\":0,\\"lastLogin\\":\\"2025-09-09T08:59:50.121Z\\",\\"isActive\\":true,\\"createdAt\\":\\"2025-09-09T08:58:08.171Z\\",\\"updatedAt\\":\\"2025-09-09T08:59:50.122Z\\",\\"createdBy\\":\\"admin\\"}"	null	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-09-09 11:05:27.021+02
53	1	admin	CREATE	users	6	null	"{\\"id\\":6,\\"username\\":\\"anesunyakonda\\",\\"firstName\\":\\"anesu\\",\\"lastName\\":\\"nyakonda\\",\\"email\\":\\"anesu.nyakonda@nbs.co.zw\\",\\"phoneNumber\\":\\"0789045158\\",\\"role\\":{\\"id\\":1,\\"name\\":\\"admin\\"},\\"branch\\":{\\"code\\":\\"02\\",\\"name\\":\\"Gweru Branch\\"},\\"isActive\\":true,\\"createdAt\\":\\"2025-09-09T09:09:29.219Z\\",\\"createdBy\\":\\"admin\\"}"	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-09-09 11:09:29.228+02
54	6	anesunyakonda	CREATE	users	7	null	"{\\"id\\":7,\\"username\\":\\"sifisom\\",\\"firstName\\":\\"sifiso\\",\\"lastName\\":\\"mahlanga\\",\\"email\\":\\"mahlanga.sifiso@nbs.co.zw\\",\\"phoneNumber\\":\\"0789995158\\",\\"role\\":{\\"id\\":3,\\"name\\":\\"cashier\\"},\\"branch\\":{\\"code\\":\\"01\\",\\"name\\":\\"Bindura Branch\\"},\\"isActive\\":true,\\"createdAt\\":\\"2025-09-09T09:21:03.661Z\\",\\"createdBy\\":\\"anesunyakonda\\"}"	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-09-09 11:21:03.669+02
55	1	admin	CREATE	users	8	null	"{\\"id\\":8,\\"username\\":\\"james\\",\\"firstName\\":\\"james\\",\\"lastName\\":\\"chimombe\\",\\"email\\":\\"jamesc@gmail.com\\",\\"phoneNumber\\":\\"0898045158\\",\\"role\\":{\\"id\\":2,\\"name\\":\\"supervisor\\"},\\"branch\\":{\\"code\\":\\"00\\",\\"name\\":\\"Head Office\\"},\\"isActive\\":true,\\"createdAt\\":\\"2025-09-09T13:34:52.345Z\\",\\"createdBy\\":\\"admin\\"}"	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	2025-09-09 15:34:52.355+02
\.


--
-- Data for Name: balance_adjustments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.balance_adjustments (id, member_balance_id, adjustment_type, amount, reason, reference_number, processed_by, processed_at, notes) FROM stdin;
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branches (code, name, address, created_at, is_active, phone_number, updated_at) FROM stdin;
00	Head Office	\N	2025-08-26 08:16:40.328	t	\N	2025-08-26 08:16:40.328
01	Bindura Branch	\N	2025-08-29 21:16:20.355	t	\N	2025-08-29 21:16:20.355
02	Gweru Branch	\N	2025-09-01 11:53:15.851	t	\N	2025-09-01 11:53:15.851
\.


--
-- Data for Name: budget_allocations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_allocations (id, project_id, category, allocated_amount, spent_amount, currency_code, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: budget_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_lines (id, budget_period_id, expenditure_head_code, project_id, budgeted_amount, actual_amount, variance, variance_percent, notes) FROM stdin;
\.


--
-- Data for Name: budget_periods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_periods (id, name, start_date, end_date, budget_type, status, total_budget, actual_spent, currency_code, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: contract_milestones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contract_milestones (id, contract_id, description, due_date, amount, status, completed_at, notes) FROM stdin;
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contracts (id, contract_number, supplier_id, project_id, title, description, contract_value, currency_code, start_date, end_date, renewal_date, status, contract_type, payment_terms, deliverables, penalties, signed_by, signed_date, document_path, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: contribution_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contribution_plans (id, member_id, project_id, revenue_head_code, plan_name, payment_pattern, frequency, amount, currency_code, start_date, end_date, next_payment_date, reminder_days, auto_renew, is_active, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currencies (code, name, symbol, is_active, is_base_currency, decimal_places, created_at, updated_at) FROM stdin;
ZIG	Zimbabwe Gold	ZIG	t	t	2	2025-08-26 08:16:40.321	2025-08-26 08:16:40.321
USD	US Dollar	$	t	f	2	2025-08-26 08:16:40.321	2025-08-26 08:16:40.321
ZAR	South African Rand	R	t	f	2	2025-08-26 08:16:40.321	2025-08-26 08:16:40.321
GBP	British Pound	£	t	f	2	2025-08-26 08:16:40.321	2025-08-26 08:16:40.321
ZWL	Zimbabwe Dollar	ZWL	t	f	2	2025-08-26 08:16:40.321	2025-08-26 08:16:40.321
\.


--
-- Data for Name: currency_conversion_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_conversion_history (id, exchange_rate_id, original_amount, original_currency_code, converted_amount, converted_currency_code, conversion_rate, transaction_type, transaction_id, converted_at, converted_by) FROM stdin;
\.


--
-- Data for Name: currency_payment_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_payment_methods (currency_code, payment_method_id, is_active) FROM stdin;
\.


--
-- Data for Name: exchange_rate_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exchange_rate_history (id, base_currency_code, target_currency_code, rate, date, high_rate, low_rate, open_rate, close_rate, volume, source, source_reference, created_at) FROM stdin;
\.


--
-- Data for Name: exchange_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exchange_rates (id, base_currency_code, target_currency_code, rate, inverse_rate, effective_date, expiry_date, source, source_reference, is_active, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: expenditure_heads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenditure_heads (code, name, branch_code, approval_required, budget_limit, category, created_at, description, is_active, updated_at) FROM stdin;
00E002	Utilities	00	f	\N	UTILITIES	2025-08-26 08:16:40.356	\N	t	2025-08-26 08:16:40.356
00E005	Travel	00	f	\N	OPERATIONAL	2025-08-26 08:16:40.357	\N	t	2025-08-26 08:16:40.357
00E001	Salaries	00	f	\N	PERSONNEL	2025-08-26 08:16:40.356	\N	t	2025-08-26 08:16:40.356
00E004	Office Supplies	00	f	\N	ADMINISTRATIVE	2025-08-26 08:16:40.357	\N	t	2025-08-26 08:16:40.357
00E003	Maintenance	00	f	\N	MAINTENANCE	2025-08-26 08:16:40.356	\N	t	2025-08-26 08:16:40.356
\.


--
-- Data for Name: expenditure_line_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenditure_line_items (id, expenditure_id, description, quantity, unit_price, total_price, tax_rate, notes) FROM stdin;
\.


--
-- Data for Name: expenditures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenditures (id, voucher_number, expenditure_head_code, project_id, milestone_id, supplier_id, description, amount, tax_amount, total_amount, currency_code, payment_method_id, reference_number, branch_code, expense_date, payment_date, due_date, frequency, urgency, is_recurring, recurring_until, approval_status, approved_by, approved_at, requested_by, processed_by, notes, internal_notes, tags, is_reimbursement, reimbursed_to, budget_year, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: expense_receipts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense_receipts (id, expenditure_id, file_name, original_name, file_path, file_size, mime_type, receipt_type, receipt_number, merchant_name, receipt_date, ocr_text, is_verified, uploaded_by, uploaded_at, verified_by, verified_at) FROM stdin;
\.


--
-- Data for Name: login_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_history (id, user_id, ip_address, user_agent, success, error, created_at) FROM stdin;
1	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-26 09:14:58.948
2	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-26 10:12:36.64
3	1	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-08-26 12:37:31.826
4	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-26 13:28:10.125
5	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-26 13:54:20.154
6	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-26 14:09:32.207
7	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-27 06:19:57.999
8	1	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-08-27 10:00:23.018
9	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-28 06:26:14.377
10	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-28 08:46:05.795
11	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-28 09:19:34.45
12	1	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-08-28 09:53:35.686
13	1	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-08-28 12:18:45.972
14	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-29 06:28:46.991
15	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-29 19:19:15.397
16	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-29 19:50:14.052
17	1	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-08-29 20:57:20.602
18	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-30 10:07:46.231
19	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-31 19:04:19.627
20	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-08-31 19:59:07.344
21	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-01 06:11:40.412
22	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-01 06:29:20.311
23	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-01 09:05:47.296
24	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-01 09:11:58.102
25	1	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-01 11:22:43.84
26	1	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-02 07:29:45.314
27	1	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-04 08:01:30.074
28	1	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-09-05 06:45:26.121
29	1	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-05 06:54:33.477
30	1	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-09-05 07:33:15.206
31	1	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-09-05 07:40:45.368
32	1	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-09-05 08:38:24.541
33	1	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-09-05 08:45:07.101
34	1	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-09-05 09:02:51.196
35	1	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-08 06:41:17.304
36	1	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-09 07:28:03.128
37	1	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-09 08:15:32.678
41	1	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-09-09 08:55:27.826
45	1	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-09-09 09:00:54.116
47	1	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-09-09 09:04:35.559
48	6	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-09 09:09:57.202
49	7	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-09 09:21:23.329
50	7	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-09 10:39:46.704
51	7	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-09 12:41:39.545
52	7	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-09-09 13:07:28.963
53	1	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-09 13:33:21.143
54	7	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-09 13:35:45.172
55	7	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	t	\N	2025-09-09 14:06:26.275
56	7	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-10 09:03:25.555
57	1	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-10 09:06:35.957
58	8	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-10 09:23:59.944
59	1	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-11 13:06:36.862
60	1	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-11 13:35:24.764
61	7	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	t	\N	2025-09-11 13:37:56.853
\.


--
-- Data for Name: maintenance_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance_records (id, asset_id, maintenance_type, description, cost, currency_code, supplier_id, scheduled_date, completed_date, next_service_date, performed_by, notes, created_at) FROM stdin;
\.


--
-- Data for Name: member_balances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.member_balances (id, member_id, project_id, balance_type, balance, credit_limit, currency_code, last_updated, created_at) FROM stdin;
\.


--
-- Data for Name: member_contributions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.member_contributions (id, receipt_number, member_id, project_id, amount, currency_code, payment_method_id, reference_number, payment_date, processed_by, notes, status, is_recurring, recurring_plan_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: member_projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.member_projects (id, member_id, project_id, required_amount, currency_code, is_exempt, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.members (id, member_number, first_name, last_name, date_of_birth, age_category, phone_number, email, address, branch_code, is_active, joined_date, created_at, updated_at) FROM stdin;
8	54321	anesu	Chiridza	2002-05-03 00:00:00	ADULT	+263772830466	wendy@gmail.com	katanga	01	t	2025-08-29 21:36:42.419	2025-08-29 21:36:42.419	2025-08-29 21:36:42.419
10	970	Jona	nyakudya	1980-07-09 00:00:00	ADULT	+263772830466	kmfodmfodmfd@gmail.com	3 knowe	00	t	2025-08-29 21:58:20.862	2025-08-29 21:58:20.862	2025-08-29 21:58:20.862
11	098	Tadiwa	ngoni	2001-05-03 00:00:00	ADULT	+63772288819	rcmurei1@gmail.com	5 jacaranda close	00	t	2025-08-29 22:01:54.605	2025-08-29 22:01:54.605	2025-08-29 22:01:54.605
13	568	Simbarashe	Mukuvari	1998-08-02 00:00:00	ADULT	+263772830466	simcasper@gmail.com	4 jacaranda close	00	t	2025-08-30 09:51:44.923	2025-08-30 09:51:44.923	2025-08-30 09:51:44.923
16	48291	James	Carter	1987-04-12 00:00:00	ADULT	555-839-2741	james.carter@example.com	123 Maple Street, Anytown, USA	00	t	2025-08-30 10:20:27.306	2025-08-30 10:20:27.306	2025-08-30 10:20:27.306
17	35039	Natalie	Castillo	1966-11-18 00:00:00	ADULT	+1-324-135-5366x3687	maryburke@hotmail.com	195 Lowe Dale Suite 211, Cunninghamland, NM 50259	00	f	2025-08-30 10:20:58.229	2025-08-30 10:20:58.229	2025-08-30 10:20:58.229
18	95212	Tyler	Murray	1968-12-19 00:00:00	ADULT	713-220-4554x576	calderondonald@arias.com	Unit 7024 Box 4082, DPO AE 44395	00	f	2025-08-30 10:21:36.292	2025-08-30 10:21:36.292	2025-08-30 10:21:36.292
19	63410	Amanda	Moore	1948-06-07 00:00:00	ADULT	610.656.5972	pcruz@hotmail.com	30331 Pearson Isle Apt. 760, Barnesport, WV 58099	00	f	2025-08-30 10:22:50.27	2025-08-30 10:22:50.27	2025-08-30 10:22:50.27
20	75694	Tammy	Porter	1979-03-20 00:00:00	YOUTH	760.686.4665x0435	qvincent@thompson-nelson.biz	18094 Church Road Suite 429, North Austin, AL 74490	00	f	2025-08-30 10:23:37.089	2025-08-30 10:23:37.089	2025-08-30 10:23:37.089
22	18267	Jon	Lee	1961-10-20 00:00:00	CHILD	(896)306-1813x0760	ysmith@hotmail.com	9105 Anthony Locks Suite 292, Randytown, DE 27219	00	f	2025-08-30 10:31:01.428	2025-08-30 10:31:01.428	2025-08-30 10:31:01.428
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (id, token, expires_at, created_at, user_id) FROM stdin;
\.


--
-- Data for Name: payment_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_methods (id, name, description, is_active, created_at, updated_at) FROM stdin;
1	Cash	Physical cash payment	t	2025-08-26 08:16:40.324	2025-08-26 08:16:40.324
2	Ecocash	Ecocash mobile money	t	2025-08-26 08:16:40.324	2025-08-26 08:16:40.324
3	One Money	One Money mobile money	t	2025-08-26 08:16:40.324	2025-08-26 08:16:40.324
4	Telecash	Telecel mobile money	t	2025-08-26 08:16:40.324	2025-08-26 08:16:40.324
5	Bank Transfer	Direct bank transfer	t	2025-08-26 08:16:40.324	2025-08-26 08:16:40.324
6	Card Swipe	Card payment via POS	t	2025-08-26 08:16:40.324	2025-08-26 08:16:40.324
7	PayPal	PayPal online payment	t	2025-08-26 08:16:40.324	2025-08-26 08:16:40.324
\.


--
-- Data for Name: payment_pattern_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_pattern_history (id, member_id, previous_pattern, new_pattern, analysis_date, confidence, reason_code, created_at) FROM stdin;
\.


--
-- Data for Name: payment_reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_reminders (id, member_id, contribution_plan_id, reminder_type, due_date, amount, currency_code, message, sent_at, method, status, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: project_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_documents (id, project_id, file_name, original_name, file_path, file_size, mime_type, file_type, category, description, tags, is_public, download_count, thumbnail_path, duration, dimensions, checksum, uploaded_by, uploaded_at, last_accessed, version_number, parent_doc_id) FROM stdin;
\.


--
-- Data for Name: project_milestones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_milestones (id, project_id, name, description, target_date, actual_date, budget_allocation, actual_cost, status, priority, progress, dependencies, deliverables, completion_criteria, notes, completed_by, completed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: project_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_tasks (id, project_id, milestone_id, title, description, assigned_to, due_date, status, priority, estimated_hours, actual_hours, completed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: project_updates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_updates (id, project_id, title, content, update_type, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, name, description, target_amount, currency_code, branch_code, start_date, end_date, actual_start_date, actual_end_date, status, priority, progress, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, token, expires_at, created_at, user_id) FROM stdin;
173	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2NDkzOTY2LCJleHAiOjE3NTcwOTg3NjZ9.MAizML5BMl1cz2GgNUIQ4WAcCw11MwdvDABKI7icuF4	2025-09-05 18:59:26.386	2025-08-29 18:59:26.386	1
2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2MjAwMTQxLCJleHAiOjE3NTY4MDQ5NDF9.twsI3ViR2zSPAfakLocXB0esqzHOMFhOQcyKN691XM8	2025-09-02 09:22:21.873	2025-08-26 09:22:21.874	1
236	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2NzE3NTQ3LCJleHAiOjE3NTczMjIzNDd9.U_EeTHTnNUlFFniaj1Ch19BnMwfKvMx4G90sjt9rF_0	2025-09-08 09:05:47.305	2025-09-01 09:05:47.306	1
63	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2MzYyMjk5LCJleHAiOjE3NTY5NjcwOTl9.2Vc_J7ml944er6LLZP5zu30QljYDEZwyzauIvsAlIfI	2025-09-04 06:24:59.35	2025-08-28 06:24:59.351	1
177	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2NDk2MDU2LCJleHAiOjE3NTcxMDA4NTZ9.bnbdFWFSaDINOsH1oY_Gcsz4dU1Dr-wzNlVxC4X_0Tw	2025-09-05 19:34:16.356	2025-08-29 19:34:16.357	1
124	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2Mzg5NjI5LCJleHAiOjE3NTY5OTQ0Mjl9.DXpq-okWiZuIFuYkOaxTyrSslkYbraalQ_L-bZH48bA	2025-09-04 14:00:29.342	2025-08-28 14:00:29.343	1
11	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2MjA1NjQ4LCJleHAiOjE3NTY4MTA0NDh9.m2Yu8_PgL9AUNZYFmjjEzuGGNQRdOFEC2N-tsGtrx4I	2025-09-02 10:54:08.359	2025-08-26 10:54:08.36	1
387	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzU3NDIzMjAwLCJleHAiOjE3NTgwMjgwMDB9.GH9rxSPlGX5fwBJKkmEaLzyKQbrrWBdalwiy9y9p5yg	2025-09-16 13:06:40.294	2025-09-09 13:06:40.295	7
242	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2NzIxNDQ2LCJleHAiOjE3NTczMjYyNDZ9.ZKw6DlcaG_J7Yx95kDzHwppy_biO0SAGestubPLd22A	2025-09-08 10:10:46.063	2025-09-01 10:10:46.064	1
16	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2MjEzMTc1LCJleHAiOjE3NTY4MTc5NzV9.sEVc4C-FPdLvR8uEaRVmrHYOIoSiS_Rrn9mVLtOxFRg	2025-09-02 12:59:35.478	2025-08-26 12:59:35.479	1
17	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2MjE0ODkwLCJleHAiOjE3NTY4MTk2OTB9.RnjeZHuEaOJwpbqzzEXLcP5yMs7Vd_wA9hPUZhpMXgY	2025-09-02 13:28:10.14	2025-08-26 13:28:10.141	1
18	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2MjE2NDYwLCJleHAiOjE3NTY4MjEyNjB9.NLB5iGr9GZwxOkRxLjTVhUfhi226I2AWdW2JzvMKQ0E	2025-09-02 13:54:20.17	2025-08-26 13:54:20.171	1
21	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2Mjc1MTA2LCJleHAiOjE3NTY4Nzk5MDZ9.jxtzMr2TlVF-R12NVUEufnCEUvgWxKSNpz91E2S3o7U	2025-09-03 06:11:46.828	2025-08-27 06:11:46.829	1
76	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2MzY5NjEyLCJleHAiOjE3NTY5NzQ0MTJ9.DuPJywMTPA_BEFozu3AQnQM_2jMwc73XzLMRmgbPlAQ	2025-09-04 08:26:52.614	2025-08-28 08:26:52.615	1
186	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2NTAwMTA0LCJleHAiOjE3NTcxMDQ5MDR9.L4S14sEw2OQiRAjtXV8t8BQWFHrFIER7Sstc2srUR_o	2025-09-05 20:41:44.361	2025-08-29 20:41:44.362	1
78	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2MzcxMjYxLCJleHAiOjE3NTY5NzYwNjF9.BeHlQ7A1fsH7u4m85hHclwM5AA86SBRXCrz7r7E7arM	2025-09-04 08:54:21.351	2025-08-28 08:54:21.352	1
82	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2MzczOTE3LCJleHAiOjE3NTY5Nzg3MTd9.aV_Z27n3OSRRg-Ew8Y-brsbWLaR-Z6RjjTh0koe71EI	2025-09-04 09:38:37.352	2025-08-28 09:38:37.353	1
329	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU3NDAwNTE5LCJleHAiOjE3NTgwMDUzMTl9.3ZJz470csWXqQ547NNxCCARTknZe4vRWyhHbi3opM4I	2025-09-16 06:48:39.89	2025-09-09 06:48:39.89	1
335	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU3NDA0OTcxLCJleHAiOjE3NTgwMDk3NzF9.q6WqqX_JxHpSiKnUDsGG86bM-BVFUHJfjbB50w_JKWs	2025-09-16 08:02:51.913	2025-09-09 08:02:51.914	1
198	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2NTQ3OTMzLCJleHAiOjE3NTcxNTI3MzN9.5krLLzQSvYppcLwM2lK4sxO-Tj27MTBslqYhmpjQ6QM	2025-09-06 09:58:53.827	2025-08-30 09:58:53.828	1
341	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU3NDA3NjU2LCJleHAiOjE3NTgwMTI0NTZ9.5yXy9uwIjNoINj2HVLwjPqK5S0NVjSWIAzkh6skeIfQ	2025-09-16 08:47:36.193	2025-09-09 08:47:36.194	1
263	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2NzM0Njg2LCJleHAiOjE3NTczMzk0ODZ9._6DQYFXMTI-fVLf1eZa6fiC6D1AaMmOzFm7zNms1HEw	2025-09-08 13:51:26.651	2025-09-01 13:51:26.652	1
205	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2NTUxMDY5LCJleHAiOjE3NTcxNTU4Njl9.n6-VXAywaf_dTzdNphQFKbSXbzcTa6YD1NWAOXgcenQ	2025-09-06 10:51:09.83	2025-08-30 10:51:09.831	1
47	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2Mjg4NzUwLCJleHAiOjE3NTY4OTM1NTB9.DUnQ1hH6UHTZCDPU_6M8-_IYEkfEmn-_1ptUZgQoAXY	2025-09-03 09:59:10.434	2025-08-27 09:59:10.435	1
212	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2NjY5MzUyLCJleHAiOjE3NTcyNzQxNTJ9.K-zlUhOiMeqBF3Wi3aeqctpO8DDg1dc9nj6EiYZk1ws	2025-09-07 19:42:32.068	2025-08-31 19:42:32.069	1
106	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2MzgyNjQwLCJleHAiOjE3NTY5ODc0NDB9.sYFmwqLzlJQVviQnvN-0zPCzmD1DjIgehELN2bxgtk4	2025-09-04 12:04:00.346	2025-08-28 12:04:00.347	1
270	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2ODAwMTIwLCJleHAiOjE3NTc0MDQ5MjB9.-lcPCx5Ub3Tzlo22syzi2oawRszZbJMZsVzp0RUZ4mQ	2025-09-09 08:02:00.293	2025-09-02 08:02:00.295	1
271	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2OTcyODkwLCJleHAiOjE3NTc1Nzc2OTB9.qraIZLy7fCtBHi-v16zOvxng0aCJfaZGFhIpeNg5HfY	2025-09-11 08:01:30.088	2025-09-04 08:01:30.089	1
272	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU3MDU0NzI2LCJleHAiOjE3NTc2NTk1MjZ9.GCyi2eKVVLfgchgLq9PArzRPYT0ZTM_gx1QZ4f6hir4	2025-09-12 06:45:26.141	2025-09-05 06:45:26.142	1
216	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2NjcyNDM0LCJleHAiOjE3NTcyNzcyMzR9.fUd4qGkOGtuQKBDU1KWVeS9R66LJaUrhvOaLeRSmdB8	2025-09-07 20:33:54.07	2025-08-31 20:33:54.071	1
217	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2NzA3MTAwLCJleHAiOjE3NTczMTE5MDB9.1oJK-N556hmczQ_m9C70thoDjrhqopAWtsqs0FB6tYI	2025-09-08 06:11:40.435	2025-09-01 06:11:40.436	1
275	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU3MDU2NjE0LCJleHAiOjE3NTc2NjE0MTR9.0xFkw62Xb7RUMy39uIMaZhy8_6GtzLuiiDeu7L6pBhs	2025-09-12 07:16:54.296	2025-09-05 07:16:54.297	1
276	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU3MDU3NTk1LCJleHAiOjE3NTc2NjIzOTV9.1GVQMXxzPAg_sf8J4eZHsuFHnTNoFMzZEXmuLWj5y6I	2025-09-12 07:33:15.217	2025-09-05 07:33:15.218	1
282	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU3MDYwNTA0LCJleHAiOjE3NTc2NjUzMDR9.kPj26_8Rvj69fRdsYf_zSqK6iYbHjHURJb0gYyzq07I	2025-09-12 08:21:44.534	2025-09-05 08:21:44.535	1
283	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU3MDYxNTA0LCJleHAiOjE3NTc2NjYzMDR9.FBXktmrDNAUmzpkj-KnQRH4L4NaTtmbMHp4E-Cf5Ays	2025-09-12 08:38:24.554	2025-09-05 08:38:24.555	1
285	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU3MDYyMjA3LCJleHAiOjE3NTc2NjcwMDd9.xfdVhcp3Fiz5yWSVZbbV2QZjv23VtJi2nUODIaujx_Q	2025-09-12 08:50:07.518	2025-09-05 08:50:07.519	1
235	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2NzE2ODg4LCJleHAiOjE3NTczMjE2ODh9.05ifDQkj0N_eIAxWtJhPkFtL_fMGjUtrGKE8xK9KcN8	2025-09-08 08:54:48.363	2025-09-01 08:54:48.364	1
314	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU3MDgwNDM4LCJleHAiOjE3NTc2ODUyMzh9.T-G5iqGocFOmLgDNuXRGa_4cRcw-mCiW72iD_aSgZCM	2025-09-12 13:53:58.709	2025-09-05 13:53:58.71	1
397	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzU3NDI2NDQ1LCJleHAiOjE3NTgwMzEyNDV9.gh2KhkfUemGxwZAJHYMMWBpJQKjQO6VyBYzuacdAZsQ	2025-09-16 14:00:45.306	2025-09-09 14:00:45.307	7
398	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzU3NDI2Nzg2LCJleHAiOjE3NTgwMzE1ODZ9.QsdJ2CT122RvTtWVbp6xSoBV6iKzv6pioATPJZT6DtI	2025-09-16 14:06:26.332	2025-09-09 14:06:26.333	7
403	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzU3NDk2MjM5LCJleHAiOjE3NTgxMDEwMzl9.CTEzUQt-UgzJCqOf9hwPOj7AQX8Hgba8B5pORZkhOzs	2025-09-17 09:23:59.955	2025-09-10 09:23:59.956	8
405	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU3NTk2Mjk3LCJleHAiOjE3NTgyMDEwOTd9.gY2R6m9-LYlRWhnWmCjWnp63w_iYalLld4zTwCl5GKs	2025-09-18 13:11:37.296	2025-09-11 13:11:37.297	1
\.


--
-- Data for Name: refunds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refunds (id, transaction_id, amount, currency_code, reason, processed_by_id, processed_at) FROM stdin;
\.


--
-- Data for Name: revenue_heads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.revenue_heads (code, name, branch_code, created_at, description, is_active, updated_at) FROM stdin;
00R002	Pledges	00	2025-08-26 08:16:40.331	\N	t	2025-08-26 08:16:40.331
00R003	Offerings	00	2025-08-26 08:16:40.331	\N	t	2025-08-26 08:16:40.331
00R004	Seeds	00	2025-08-26 08:16:40.331	\N	t	2025-08-26 08:16:40.331
00R006	thanks giving	00	2025-08-26 14:02:21.74	\N	t	2025-08-26 14:02:21.74
00R007	thanks	00	2025-08-26 14:02:26.611	\N	t	2025-08-26 14:02:26.611
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, display_name, description, permissions, is_active, created_at, updated_at) FROM stdin;
1	admin	Administrator	Full system access with all permissions	{"roles": ["read", "create", "update", "delete"], "users": ["read", "create", "update", "delete", "lock_unlock"], "assets": ["read", "create", "update", "delete"], "budgets": ["read", "create", "update", "delete"], "members": ["read", "create", "update", "delete"], "reports": ["read", "export", "advanced"], "branches": ["read", "create", "update", "delete"], "projects": ["read", "create", "update", "delete"], "settings": ["read", "update", "system_config"], "contracts": ["read", "create", "update", "delete"], "suppliers": ["read", "create", "update", "delete"], "currencies": ["read", "manage"], "expenditures": ["read", "create", "update", "delete", "approve"], "transactions": ["read", "create", "update", "delete", "refund"], "revenue_heads": ["read", "create", "update", "delete"], "payment_methods": ["read", "manage"], "expenditure_heads": ["read", "create", "update", "delete"]}	t	2025-08-26 08:16:40.368	2025-08-26 08:16:40.368
2	supervisor	Supervisor	Branch supervisor with elevated permissions	{"users": ["read", "create", "update", "lock_unlock"], "assets": ["read", "create", "update"], "members": ["read", "create", "update"], "reports": ["read", "export"], "branches": ["read"], "projects": ["read", "create", "update"], "contracts": ["read", "create", "update"], "suppliers": ["read", "create", "update"], "currencies": ["read"], "expenditures": ["read", "create", "update"], "transactions": ["read", "create", "update", "refund"], "revenue_heads": ["read", "create"], "payment_methods": ["read"], "expenditure_heads": ["read", "create"]}	t	2025-08-26 08:16:40.378	2025-09-09 14:04:55.682
3	cashier	Cashier	Standard cashier with basic permissions	{"users": ["read"], "assets": ["read"], "members": ["read", "create"], "reports": ["read"], "branches": ["read"], "projects": ["read"], "suppliers": ["read"], "currencies": ["read"], "expenditures": ["read"], "transactions": ["read", "create"], "revenue_heads": ["read"], "payment_methods": ["read"], "expenditure_heads": ["read"]}	t	2025-08-26 08:16:40.378	2025-09-09 14:04:55.691
\.


--
-- Data for Name: supplier_evaluations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_evaluations (id, supplier_id, evaluated_by, quality_rating, timeliness_rating, value_rating, service_rating, overall_rating, comments, would_recommend, evaluation_date) FROM stdin;
\.


--
-- Data for Name: supplier_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_status_history (id, supplier_id, old_status, new_status, reason, changed_by, changed_at, review_date) FROM stdin;
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, code, name, business_name, contact_person, email, phone_number, address, tax_number, bank_account, payment_terms, credit_limit, supplier_type, rating, status, banned_reason, banned_by, banned_at, blacklist_until, risk_level, notes, is_preferred, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, receipt_number, revenue_head_code, amount, branch_code, transaction_date, created_at, currency_code, member_id, notes, payment_method_id, reference_number, status, updated_at, user_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password_hash, locked, attempts, branch_code, created_at, created_by, email, first_name, is_active, last_login, last_name, phone_number, role_id, updated_at) FROM stdin;
6	anesunyakonda	$2b$12$W3.1kW022ltxrg0H37uHkOPvSO/AWRU/WENBFOUtLXEZWwDLQCime	f	0	02	2025-09-09 09:09:29.219	admin	anesu.nyakonda@nbs.co.zw	anesu	t	2025-09-09 11:09:57.202+02	nyakonda	0789045158	1	2025-09-09 09:09:57.203
8	james	$2b$12$QNNHl3Z2W.erjv/L.dK0Yecs96r7dnJCmLjZL6CZp/.y1jgCmgeGi	f	0	00	2025-09-09 13:34:52.345	admin	jamesc@gmail.com	james	t	2025-09-10 11:23:59.95+02	chimombe	0898045158	2	2025-09-10 09:23:59.951
1	admin	$2b$12$lv0GwgsVyYWv/7NokE3tiOFBCP3shZDvd45TDsdmXe9cIPS/rPAiy	f	0	00	2025-08-26 09:14:24.788	system	\N	System	t	2025-09-11 15:35:24.767+02	Administrator	\N	1	2025-09-11 13:35:24.768
7	sifisom	$2b$12$yA3USj5XPohxC8nwiB682OLE9t8RsdOZMo7lgsm1944QtNVbvjqXe	f	0	01	2025-09-09 09:21:03.661	anesunyakonda	mahlanga.sifiso@nbs.co.zw	sifiso	t	2025-09-11 15:37:56.859+02	mahlanga	0789995158	3	2025-09-11 13:37:56.86
\.


--
-- Name: approval_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.approval_history_id_seq', 1, false);


--
-- Name: assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assets_id_seq', 1, false);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 55, true);


--
-- Name: balance_adjustments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.balance_adjustments_id_seq', 1, false);


--
-- Name: budget_allocations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budget_allocations_id_seq', 1, false);


--
-- Name: budget_lines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budget_lines_id_seq', 1, false);


--
-- Name: budget_periods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budget_periods_id_seq', 1, false);


--
-- Name: contract_milestones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contract_milestones_id_seq', 1, false);


--
-- Name: contracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contracts_id_seq', 1, false);


--
-- Name: contribution_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contribution_plans_id_seq', 1, false);


--
-- Name: currency_conversion_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.currency_conversion_history_id_seq', 1, false);


--
-- Name: exchange_rate_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exchange_rate_history_id_seq', 1, false);


--
-- Name: exchange_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exchange_rates_id_seq', 1, false);


--
-- Name: expenditure_line_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenditure_line_items_id_seq', 1, false);


--
-- Name: expenditures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenditures_id_seq', 1, false);


--
-- Name: expense_receipts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expense_receipts_id_seq', 1, false);


--
-- Name: login_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_history_id_seq', 61, true);


--
-- Name: maintenance_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maintenance_records_id_seq', 1, false);


--
-- Name: member_balances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.member_balances_id_seq', 1, false);


--
-- Name: member_contributions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.member_contributions_id_seq', 1, false);


--
-- Name: member_projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.member_projects_id_seq', 1, false);


--
-- Name: members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.members_id_seq', 22, true);


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 1, false);


--
-- Name: payment_methods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_methods_id_seq', 35, true);


--
-- Name: payment_pattern_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_pattern_history_id_seq', 1, false);


--
-- Name: payment_reminders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_reminders_id_seq', 1, false);


--
-- Name: project_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_documents_id_seq', 1, false);


--
-- Name: project_milestones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_milestones_id_seq', 1, false);


--
-- Name: project_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_tasks_id_seq', 1, false);


--
-- Name: project_updates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_updates_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 1, false);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 407, true);


--
-- Name: refunds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refunds_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 11, true);


--
-- Name: supplier_evaluations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supplier_evaluations_id_seq', 1, false);


--
-- Name: supplier_status_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supplier_status_history_id_seq', 1, false);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 1, false);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: _CurrencyToCurrencyConversionHistory _CurrencyToCurrencyConversionHistory_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CurrencyToCurrencyConversionHistory"
    ADD CONSTRAINT "_CurrencyToCurrencyConversionHistory_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: approval_history approval_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_history
    ADD CONSTRAINT approval_history_pkey PRIMARY KEY (id);


--
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: balance_adjustments balance_adjustments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.balance_adjustments
    ADD CONSTRAINT balance_adjustments_pkey PRIMARY KEY (id);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (code);


--
-- Name: budget_allocations budget_allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_allocations
    ADD CONSTRAINT budget_allocations_pkey PRIMARY KEY (id);


--
-- Name: budget_lines budget_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_lines
    ADD CONSTRAINT budget_lines_pkey PRIMARY KEY (id);


--
-- Name: budget_periods budget_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_periods
    ADD CONSTRAINT budget_periods_pkey PRIMARY KEY (id);


--
-- Name: contract_milestones contract_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract_milestones
    ADD CONSTRAINT contract_milestones_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: contribution_plans contribution_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contribution_plans
    ADD CONSTRAINT contribution_plans_pkey PRIMARY KEY (id);


--
-- Name: currencies currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_pkey PRIMARY KEY (code);


--
-- Name: currency_conversion_history currency_conversion_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_conversion_history
    ADD CONSTRAINT currency_conversion_history_pkey PRIMARY KEY (id);


--
-- Name: currency_payment_methods currency_payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_payment_methods
    ADD CONSTRAINT currency_payment_methods_pkey PRIMARY KEY (currency_code, payment_method_id);


--
-- Name: exchange_rate_history exchange_rate_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rate_history
    ADD CONSTRAINT exchange_rate_history_pkey PRIMARY KEY (id);


--
-- Name: exchange_rates exchange_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT exchange_rates_pkey PRIMARY KEY (id);


--
-- Name: expenditure_heads expenditure_heads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditure_heads
    ADD CONSTRAINT expenditure_heads_pkey PRIMARY KEY (code);


--
-- Name: expenditure_line_items expenditure_line_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditure_line_items
    ADD CONSTRAINT expenditure_line_items_pkey PRIMARY KEY (id);


--
-- Name: expenditures expenditures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_pkey PRIMARY KEY (id);


--
-- Name: expense_receipts expense_receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_receipts
    ADD CONSTRAINT expense_receipts_pkey PRIMARY KEY (id);


--
-- Name: login_history login_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_history
    ADD CONSTRAINT login_history_pkey PRIMARY KEY (id);


--
-- Name: maintenance_records maintenance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_records
    ADD CONSTRAINT maintenance_records_pkey PRIMARY KEY (id);


--
-- Name: member_balances member_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_balances
    ADD CONSTRAINT member_balances_pkey PRIMARY KEY (id);


--
-- Name: member_contributions member_contributions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_contributions
    ADD CONSTRAINT member_contributions_pkey PRIMARY KEY (id);


--
-- Name: member_projects member_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_projects
    ADD CONSTRAINT member_projects_pkey PRIMARY KEY (id);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: payment_methods payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT payment_methods_pkey PRIMARY KEY (id);


--
-- Name: payment_pattern_history payment_pattern_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_pattern_history
    ADD CONSTRAINT payment_pattern_history_pkey PRIMARY KEY (id);


--
-- Name: payment_reminders payment_reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_reminders
    ADD CONSTRAINT payment_reminders_pkey PRIMARY KEY (id);


--
-- Name: project_documents project_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_documents
    ADD CONSTRAINT project_documents_pkey PRIMARY KEY (id);


--
-- Name: project_milestones project_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT project_milestones_pkey PRIMARY KEY (id);


--
-- Name: project_tasks project_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_tasks
    ADD CONSTRAINT project_tasks_pkey PRIMARY KEY (id);


--
-- Name: project_updates project_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_updates
    ADD CONSTRAINT project_updates_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refunds refunds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refunds
    ADD CONSTRAINT refunds_pkey PRIMARY KEY (id);


--
-- Name: revenue_heads revenue_heads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.revenue_heads
    ADD CONSTRAINT revenue_heads_pkey PRIMARY KEY (code);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: supplier_evaluations supplier_evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_evaluations
    ADD CONSTRAINT supplier_evaluations_pkey PRIMARY KEY (id);


--
-- Name: supplier_status_history supplier_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_status_history
    ADD CONSTRAINT supplier_status_history_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: _CurrencyToCurrencyConversionHistory_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_CurrencyToCurrencyConversionHistory_B_index" ON public."_CurrencyToCurrencyConversionHistory" USING btree ("B");


--
-- Name: assets_asset_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX assets_asset_number_key ON public.assets USING btree (asset_number);


--
-- Name: assets_expenditure_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX assets_expenditure_id_key ON public.assets USING btree (expenditure_id);


--
-- Name: branches_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX branches_name_key ON public.branches USING btree (name);


--
-- Name: budget_lines_budget_period_id_expenditure_head_code_project_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX budget_lines_budget_period_id_expenditure_head_code_project_key ON public.budget_lines USING btree (budget_period_id, expenditure_head_code, project_id);


--
-- Name: contracts_contract_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX contracts_contract_number_key ON public.contracts USING btree (contract_number);


--
-- Name: currencies_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX currencies_name_key ON public.currencies USING btree (name);


--
-- Name: exchange_rate_history_base_currency_code_target_currency_co_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX exchange_rate_history_base_currency_code_target_currency_co_key ON public.exchange_rate_history USING btree (base_currency_code, target_currency_code, date);


--
-- Name: exchange_rates_base_currency_code_target_currency_code_effe_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX exchange_rates_base_currency_code_target_currency_code_effe_key ON public.exchange_rates USING btree (base_currency_code, target_currency_code, effective_date);


--
-- Name: expenditure_heads_name_branch_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX expenditure_heads_name_branch_code_key ON public.expenditure_heads USING btree (name, branch_code);


--
-- Name: expenditures_voucher_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX expenditures_voucher_number_key ON public.expenditures USING btree (voucher_number);


--
-- Name: member_balances_member_id_project_id_balance_type_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX member_balances_member_id_project_id_balance_type_key ON public.member_balances USING btree (member_id, project_id, balance_type);


--
-- Name: member_contributions_receipt_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX member_contributions_receipt_number_key ON public.member_contributions USING btree (receipt_number);


--
-- Name: member_projects_member_id_project_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX member_projects_member_id_project_id_key ON public.member_projects USING btree (member_id, project_id);


--
-- Name: members_member_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX members_member_number_key ON public.members USING btree (member_number);


--
-- Name: password_reset_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX password_reset_tokens_token_key ON public.password_reset_tokens USING btree (token);


--
-- Name: payment_methods_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX payment_methods_name_key ON public.payment_methods USING btree (name);


--
-- Name: refresh_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX refresh_tokens_token_key ON public.refresh_tokens USING btree (token);


--
-- Name: revenue_heads_name_branch_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX revenue_heads_name_branch_code_key ON public.revenue_heads USING btree (name, branch_code);


--
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- Name: suppliers_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX suppliers_code_key ON public.suppliers USING btree (code);


--
-- Name: transactions_receipt_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX transactions_receipt_number_key ON public.transactions USING btree (receipt_number);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: _CurrencyToCurrencyConversionHistory _CurrencyToCurrencyConversionHistory_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CurrencyToCurrencyConversionHistory"
    ADD CONSTRAINT "_CurrencyToCurrencyConversionHistory_A_fkey" FOREIGN KEY ("A") REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _CurrencyToCurrencyConversionHistory _CurrencyToCurrencyConversionHistory_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CurrencyToCurrencyConversionHistory"
    ADD CONSTRAINT "_CurrencyToCurrencyConversionHistory_B_fkey" FOREIGN KEY ("B") REFERENCES public.currency_conversion_history(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: approval_history approval_history_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_history
    ADD CONSTRAINT approval_history_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: approval_history approval_history_expenditure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_history
    ADD CONSTRAINT approval_history_expenditure_id_fkey FOREIGN KEY (expenditure_id) REFERENCES public.expenditures(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assets assets_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: assets assets_branch_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_branch_code_fkey FOREIGN KEY (branch_code) REFERENCES public.branches(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assets assets_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assets assets_expenditure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_expenditure_id_fkey FOREIGN KEY (expenditure_id) REFERENCES public.expenditures(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: balance_adjustments balance_adjustments_member_balance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.balance_adjustments
    ADD CONSTRAINT balance_adjustments_member_balance_id_fkey FOREIGN KEY (member_balance_id) REFERENCES public.member_balances(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: balance_adjustments balance_adjustments_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.balance_adjustments
    ADD CONSTRAINT balance_adjustments_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: budget_allocations budget_allocations_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_allocations
    ADD CONSTRAINT budget_allocations_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: budget_allocations budget_allocations_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_allocations
    ADD CONSTRAINT budget_allocations_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: budget_lines budget_lines_budget_period_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_lines
    ADD CONSTRAINT budget_lines_budget_period_id_fkey FOREIGN KEY (budget_period_id) REFERENCES public.budget_periods(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: budget_lines budget_lines_expenditure_head_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_lines
    ADD CONSTRAINT budget_lines_expenditure_head_code_fkey FOREIGN KEY (expenditure_head_code) REFERENCES public.expenditure_heads(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: budget_lines budget_lines_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_lines
    ADD CONSTRAINT budget_lines_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: budget_periods budget_periods_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_periods
    ADD CONSTRAINT budget_periods_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: contract_milestones contract_milestones_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract_milestones
    ADD CONSTRAINT contract_milestones_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: contracts contracts_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: contracts contracts_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: contracts contracts_signed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_signed_by_fkey FOREIGN KEY (signed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: contracts contracts_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: contribution_plans contribution_plans_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contribution_plans
    ADD CONSTRAINT contribution_plans_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: contribution_plans contribution_plans_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contribution_plans
    ADD CONSTRAINT contribution_plans_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: contribution_plans contribution_plans_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contribution_plans
    ADD CONSTRAINT contribution_plans_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: contribution_plans contribution_plans_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contribution_plans
    ADD CONSTRAINT contribution_plans_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: contribution_plans contribution_plans_revenue_head_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contribution_plans
    ADD CONSTRAINT contribution_plans_revenue_head_code_fkey FOREIGN KEY (revenue_head_code) REFERENCES public.revenue_heads(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: currency_conversion_history currency_conversion_history_converted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_conversion_history
    ADD CONSTRAINT currency_conversion_history_converted_by_fkey FOREIGN KEY (converted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: currency_conversion_history currency_conversion_history_converted_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_conversion_history
    ADD CONSTRAINT currency_conversion_history_converted_currency_code_fkey FOREIGN KEY (converted_currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: currency_conversion_history currency_conversion_history_exchange_rate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_conversion_history
    ADD CONSTRAINT currency_conversion_history_exchange_rate_id_fkey FOREIGN KEY (exchange_rate_id) REFERENCES public.exchange_rates(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: currency_conversion_history currency_conversion_history_original_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_conversion_history
    ADD CONSTRAINT currency_conversion_history_original_currency_code_fkey FOREIGN KEY (original_currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: currency_payment_methods currency_payment_methods_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_payment_methods
    ADD CONSTRAINT currency_payment_methods_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: currency_payment_methods currency_payment_methods_payment_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_payment_methods
    ADD CONSTRAINT currency_payment_methods_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exchange_rate_history exchange_rate_history_base_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rate_history
    ADD CONSTRAINT exchange_rate_history_base_currency_code_fkey FOREIGN KEY (base_currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exchange_rate_history exchange_rate_history_target_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rate_history
    ADD CONSTRAINT exchange_rate_history_target_currency_code_fkey FOREIGN KEY (target_currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exchange_rates exchange_rates_base_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT exchange_rates_base_currency_code_fkey FOREIGN KEY (base_currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exchange_rates exchange_rates_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT exchange_rates_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: exchange_rates exchange_rates_target_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT exchange_rates_target_currency_code_fkey FOREIGN KEY (target_currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: expenditure_heads expenditure_heads_branch_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditure_heads
    ADD CONSTRAINT expenditure_heads_branch_code_fkey FOREIGN KEY (branch_code) REFERENCES public.branches(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: expenditure_line_items expenditure_line_items_expenditure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditure_line_items
    ADD CONSTRAINT expenditure_line_items_expenditure_id_fkey FOREIGN KEY (expenditure_id) REFERENCES public.expenditures(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: expenditures expenditures_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: expenditures expenditures_branch_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_branch_code_fkey FOREIGN KEY (branch_code) REFERENCES public.branches(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: expenditures expenditures_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: expenditures expenditures_expenditure_head_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_expenditure_head_code_fkey FOREIGN KEY (expenditure_head_code) REFERENCES public.expenditure_heads(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: expenditures expenditures_milestone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_milestone_id_fkey FOREIGN KEY (milestone_id) REFERENCES public.project_milestones(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: expenditures expenditures_payment_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: expenditures expenditures_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: expenditures expenditures_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: expenditures expenditures_reimbursed_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_reimbursed_to_fkey FOREIGN KEY (reimbursed_to) REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: expenditures expenditures_requested_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: expenditures expenditures_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: expense_receipts expense_receipts_expenditure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_receipts
    ADD CONSTRAINT expense_receipts_expenditure_id_fkey FOREIGN KEY (expenditure_id) REFERENCES public.expenditures(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: expense_receipts expense_receipts_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_receipts
    ADD CONSTRAINT expense_receipts_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: expense_receipts expense_receipts_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_receipts
    ADD CONSTRAINT expense_receipts_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: login_history login_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_history
    ADD CONSTRAINT login_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: maintenance_records maintenance_records_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_records
    ADD CONSTRAINT maintenance_records_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: maintenance_records maintenance_records_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_records
    ADD CONSTRAINT maintenance_records_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: maintenance_records maintenance_records_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_records
    ADD CONSTRAINT maintenance_records_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: member_balances member_balances_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_balances
    ADD CONSTRAINT member_balances_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: member_balances member_balances_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_balances
    ADD CONSTRAINT member_balances_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: member_balances member_balances_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_balances
    ADD CONSTRAINT member_balances_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: member_contributions member_contributions_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_contributions
    ADD CONSTRAINT member_contributions_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: member_contributions member_contributions_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_contributions
    ADD CONSTRAINT member_contributions_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: member_contributions member_contributions_payment_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_contributions
    ADD CONSTRAINT member_contributions_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: member_contributions member_contributions_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_contributions
    ADD CONSTRAINT member_contributions_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: member_contributions member_contributions_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_contributions
    ADD CONSTRAINT member_contributions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: member_projects member_projects_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_projects
    ADD CONSTRAINT member_projects_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: member_projects member_projects_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_projects
    ADD CONSTRAINT member_projects_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: member_projects member_projects_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_projects
    ADD CONSTRAINT member_projects_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: members members_branch_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_branch_code_fkey FOREIGN KEY (branch_code) REFERENCES public.branches(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_pattern_history payment_pattern_history_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_pattern_history
    ADD CONSTRAINT payment_pattern_history_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payment_reminders payment_reminders_contribution_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_reminders
    ADD CONSTRAINT payment_reminders_contribution_plan_id_fkey FOREIGN KEY (contribution_plan_id) REFERENCES public.contribution_plans(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payment_reminders payment_reminders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_reminders
    ADD CONSTRAINT payment_reminders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payment_reminders payment_reminders_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_reminders
    ADD CONSTRAINT payment_reminders_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payment_reminders payment_reminders_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_reminders
    ADD CONSTRAINT payment_reminders_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: project_documents project_documents_parent_doc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_documents
    ADD CONSTRAINT project_documents_parent_doc_id_fkey FOREIGN KEY (parent_doc_id) REFERENCES public.project_documents(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: project_documents project_documents_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_documents
    ADD CONSTRAINT project_documents_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: project_documents project_documents_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_documents
    ADD CONSTRAINT project_documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: project_milestones project_milestones_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT project_milestones_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: project_tasks project_tasks_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_tasks
    ADD CONSTRAINT project_tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: project_tasks project_tasks_milestone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_tasks
    ADD CONSTRAINT project_tasks_milestone_id_fkey FOREIGN KEY (milestone_id) REFERENCES public.project_milestones(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: project_tasks project_tasks_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_tasks
    ADD CONSTRAINT project_tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: project_updates project_updates_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_updates
    ADD CONSTRAINT project_updates_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: projects projects_branch_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_branch_code_fkey FOREIGN KEY (branch_code) REFERENCES public.branches(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: projects projects_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refunds refunds_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refunds
    ADD CONSTRAINT refunds_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: refunds refunds_processed_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refunds
    ADD CONSTRAINT refunds_processed_by_id_fkey FOREIGN KEY (processed_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: refunds refunds_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refunds
    ADD CONSTRAINT refunds_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: revenue_heads revenue_heads_branch_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.revenue_heads
    ADD CONSTRAINT revenue_heads_branch_code_fkey FOREIGN KEY (branch_code) REFERENCES public.branches(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: supplier_evaluations supplier_evaluations_evaluated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_evaluations
    ADD CONSTRAINT supplier_evaluations_evaluated_by_fkey FOREIGN KEY (evaluated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: supplier_evaluations supplier_evaluations_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_evaluations
    ADD CONSTRAINT supplier_evaluations_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: supplier_status_history supplier_status_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_status_history
    ADD CONSTRAINT supplier_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: supplier_status_history supplier_status_history_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_status_history
    ADD CONSTRAINT supplier_status_history_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: suppliers suppliers_banned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_banned_by_fkey FOREIGN KEY (banned_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transactions transactions_branch_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_branch_code_fkey FOREIGN KEY (branch_code) REFERENCES public.branches(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_currency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_payment_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_revenue_head_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_revenue_head_code_fkey FOREIGN KEY (revenue_head_code) REFERENCES public.revenue_heads(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users users_branch_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_branch_code_fkey FOREIGN KEY (branch_code) REFERENCES public.branches(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict eEM6pMBUlfchGqPBhzMxIdbU0vyjEu1lFiynHoU7aybZgVmKQivTO0uu2nbTs9W

