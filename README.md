# Loyalty Forge

Loyalty Forge is a Next.js application that allows businesses to create and manage loyalty programs using NFTs. It leverages the Crossmint API for blockchain interactions and user authentication.

## Features

- Create and manage loyalty programs (NFT collections)
- Mint NFTs for loyalty program members
- User authentication with Crossmint
- Dashboard for managing collections and wallets (WIP)

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn
- A Crossmint account and API keys

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/loyalty-forge.git
cd loyalty-forge
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory and add the following variables:

```
NEXT_PUBLIC_CROSSMINT_API_KEY=your_crossmint_public_api_key
CROSSMINT_SERVER_API_KEY=your_crossmint_server_api_key
DATABASE_URL=your_database_url
BASE_URL=http://localhost:3000
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app`: Contains the main application code
- `/app/api`: API routes for server-side operations
- `/app/(components)`: Reusable React components
- `/lib`: Utility functions and helpers
- `/prisma`: Database schema and migrations
- `/providers`: Context providers for the application


## API Routes

- Collections (GET, POST): `/api/collections`
- Mint NFT (POST): `/api/mint-nft`

They both need a `jwt` header with the user's JWT token or setting `userId` which can be copied from the console.

## Database

The project uses Prisma with a SQLite database. The schema can be found in `/prisma/schema.prisma`.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.