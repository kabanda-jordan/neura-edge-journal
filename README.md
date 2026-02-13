# Neura-Edge-Journal

AI-Powered Trading Journal & Analytics Engine
Everything you wanted to know about your trading… but your spreadsheets never told you.

Neura-Edge-Journal is a lightweight, edge-deployable trading journal that brings professional-grade analytics to traders worldwide. Connect brokers, auto-import trades, unlock 50+ performance reports, and get AI-driven insights—all running locally or on edge devices for privacy and speed.

Built for developers, traders, and fintech enthusiasts. Inspired by TradeMind, reimagined as open-source.

# 🚀 Features

Automated Journaling: Broker API integrations + CSV/manual uploads

50+ Performance Reports: Win rate, profit factor, drawdown analysis

AI Trade Insights: Edge ML models for pattern detection & optimization

Trading Playbooks: Strategy rule builder with backtesting

Real-Time Dashboard: Live stats across multiple accounts

Broker Support: Interactive Brokers, MetaTrader, Binance, + more

Edge-First: Runs on Raspberry Pi, Vercel Edge, Cloudflare Workers

Discord Integration: Bot for trade sharing & community alerts

# 🛠 Quick Start
# Clone & install
git clone https://github.com/kabanda-jordan/neura-edge-journal.git
cd neura-edge-journal
npm install   # or yarn/pnpm

# Run locally
npm run dev

# Deploy to edge (Vercel example)
npm run deploy


# Live Demo: neura-edge-journal.vercel.app

# 📊 Supported Brokers
Broker	Status	Auto-Import
Interactive Brokers	✅ Live	API + CSV
MetaTrader 4/5	✅ Live	CSV + MT4 Hook
Binance	✅ Live	API
TD Ameritrade	🛠 Beta	OAuth
…10+ more	📈 Coming	Request on Discord
💰 Pricing Tiers (SaaS Ready)
Plan	Price	Features
Free	$0/mo	15 trades, basic reports
Pro	$3.99/mo	Unlimited trades + AI insights
Enterprise	Custom	White-label + API, Crypto payments via Solana/USDC
# 🛡️ Self-Hosting

Perfect for privacy-focused traders.

Docker Example:

# services:
  app:
    image: kabanda-jordan/neura-edge-journal:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
      - OPENAI_API_KEY=your-key

# 📈 Roadmap

Core analytics engine

5+ broker integrations

AI insights (local Llama.cpp)

Mobile app (React Native)

Advanced backtesting

NFT trade certificates

# ⚡ Tech Stack

Frontend: Next.js 15 + Tailwind + shadcn/ui

Backend: Node.js + Prisma + PostgreSQL

AI: Transformers.js + ONNX Runtime (edge)

Deployment: Vercel Edge + Cloudflare Workers

Broker APIs: CCXT + Broker SDKs

# 🙌 Testimonials

"Neura-Edge-Journal turned my trading chaos into data-driven decisions. Win rate up 25%!" – Alex, Day Trader

"Self-hosted on my Pi 5. Zero latency, full privacy. Game-changer." – Sarah, Algo Trader

# 📄 License

MIT – Free for personal/commercial use. See LICENSE.

# 🤝 Contributing

Fork → Clone → PR

Follow CONTRIBUTING.md

Join our Discord for bounties

Built with ❤️ for traders by traders. Deploy in 60 seconds. Level up your edge.

⭐ GitHub | 💬 Discord
