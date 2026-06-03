# AgentScript — Real Estate Agent AI Assistant

An AI-powered writing assistant for real estate agents. Generate listing descriptions, follow-up emails, offer letters, and social media captions in seconds.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Database**: Supabase (PostgreSQL + RLS)
- **Auth**: Clerk
- **Payments**: Stripe
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

1. Copy `.env.example` to `.env.local` and fill in your keys
2. Run `npm install`
3. Run the Supabase schema: copy `supabase/schema.sql` into your Supabase SQL editor and execute
4. Set up Clerk webhooks (point to `/api/webhooks/clerk`)
5. Set up Stripe webhooks (point to `/api/webhooks/stripe`)
6. Run `npm run dev`

## Environment Variables

See `.env.example` for all required variables.
