This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# 📡 EventSync

EventSync est une plateforme de gestion d’événements et d’interaction en temps réel (sessions, speakers, questions live).

## ⚙️ Stack technique

- Next.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Auth
- bcrypt / bcryptjs

## 📦 Installation

### Cloner le projet

git clone https://github.com/M-B-O-T/EventSync.git
cd EventSync/web

### Installer les dépendances
npm install

### 🧬 Configuration de la base de données
**Créer la base PostgreSQL**
CREATE DATABASE eventsync;
**Configurer le fichier .env**
DATABASE_URL="postgresql://user:password@localhost:5432/eventsync"
JWT_SECRET="super_secret_key"
