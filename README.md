# Regen Network Keplr Integration

React-based Next.js application that integrates with Keplr wallet to interact with the Regen Redwood Testnet.

## Figma

* [Figma design](https://www.figma.com/design/n8LhPDLHjl11XYsgEM23Mf/Regen-Coding-Exercise?node-id=9-62&t=Io6axJpymPOVaBPE-1)
* The design was implemented with flexibility, allowing for iterative improvements and additional useful features to be incorporated during the development process.

![readme-mockup](https://github.com/user-attachments/assets/fb9dfddf-ba9d-4a4a-9384-92e584a6f377)

## Features

- Keplr wallet connection and Redwood testnet integration
- Display REGEN token balance
- Send REGEN tokens to other addresses
- Display account information
- Basic responsive UI with Tailwind CSS and shadcn/ui
- Basic error handling
- Integration with Coingecko API to fetch REGEN price
- Integration with toast notifications for feedback

## Tech Stack

- Next.js
- TypeScript
- Keplr Wallet
- CosmJS
- Tailwind CSS

## Prerequisites

- Node.js 18.17 or later
- Keplr browser extension
- Yarn (recommended) or npm

## Getting Started

First, install the dependencies:

```bash
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Keplr Wallet Documentation](https://docs.keplr.app/)
- [Regen Network Documentation](https://docs.regen.network/)
- [CosmJS Documentation](https://cosmos.github.io/cosmjs/)
