# Blessed Drinks

A modern beverage storefront built with Next.js and Payload CMS. Blessed Drinks provides a responsive shopping experience, persistent cart, checkout flow, order confirmation, and a dedicated content-management interface.

[Live site](https://blesseddrinks.vercel.app) · [Source code](https://github.com/prinxe404/Blessed-Drinks)

## Overview

Blessed Drinks combines a polished customer-facing storefront with Payload's structured content management system. Products and store content are managed through Payload, while Next.js provides the application UI and API routes.

### Key Features

- Responsive drink storefront
- Product browsing and presentation
- Persistent shopping cart
- Checkout and order confirmation flow
- Payload CMS administration panel
- PostgreSQL-backed content and order storage
- TypeScript across the application
- Tailwind CSS interface styling

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **UI:** React 19 and Tailwind CSS
- **CMS:** Payload CMS 3
- **Database:** PostgreSQL
- **Validation:** Zod
- **Media Storage:** Cloudinary
- **Deployment:** Vercel

## Project Structure

```text
src/
├── app/                 # Next.js routes, layouts, and API handlers
│   ├── admin/           # Payload admin integration
│   ├── api/             # Application API routes
│   ├── cart/            # Shopping cart page
│   ├── order-confirmed/ # Post-checkout confirmation page
│   └── page.tsx         # Storefront entry point
├── components/          # Shared storefront and admin components
├── context/             # Cart and application state providers
├── lib/                 # Shared application utilities
├── payload/             # Payload collections and globals
├── payload.config.ts    # Payload CMS configuration
├── middleware.ts        # Request middleware
└── types/               # Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A PostgreSQL database
- A Payload secret
- Cloudinary credentials if media uploads are used

### Installation

1. Clone the repository:

```bash
git clone https://github.com/prinxe404/Blessed-Drinks.git
cd Blessed-Drinks
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the project root:

```dotenv
DATABASE_URI=postgresql://username:password@host:5432/database
PAYLOAD_SECRET=your-long-random-secret

# Add these only if media uploads are enabled
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Payload admin interface is available under the configured admin route, typically at [http://localhost:3000/admin](http://localhost:3000/admin).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |

## Environment Configuration

Environment variable names may vary based on the final Payload and Cloudinary configuration. Add any required variables to `.env.local` and never commit secrets to source control.

Recommended production settings:

- Use a managed PostgreSQL database.
- Generate a strong, unique `PAYLOAD_SECRET`.
- Configure HTTPS and trusted host settings when deploying.
- Add production database and media credentials as platform environment variables.

## Deployment

The application can be deployed to Vercel or another platform that supports Next.js.

Before deploying:

1. Configure the PostgreSQL connection.
2. Set required Payload and Cloudinary environment variables.
3. Run a production build:

```bash
npm run build
```

4. Deploy the application and verify both the storefront and `/admin` routes.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Run `npm run lint` and `npm run build`.
5. Open a pull request with a clear description of the changes.

## License

No license has been specified for this project. All rights are reserved by the repository owner unless a license is added.
