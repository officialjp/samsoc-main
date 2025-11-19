# Surrey Anime and Manga Society Website

Welcome to the official website of the Surrey Anime and Manga Society (SAMSoC)! This is a modern web application built with cutting-edge technologies to serve our anime and manga community.

## 🌟 About

The Surrey Anime and Manga Society website is designed to be the central hub for our community, providing access to our manga library, event information, photo galleries, interactive games, and more. Whether you're a current member or interested in joining, this platform offers everything you need to stay connected with our society.

## 🚀 Features

### 📚 **Manga Library**
- Comprehensive filtering system to browse our collection
- Search by genre, author, title, and more
- Detailed information about each manga volume
- Member request system for new additions

### 📸 **Gallery**
- Photo collections from our events and collaborations
- Organized albums for easy browsing
- High-quality images showcasing our community activities

### 📅 **Events**
- Detailed descriptions of all society events
- Information about collaborations with other societies
- Past event archives and upcoming event previews

### 🗓️ **Calendar**
- Interactive calendar view
- Upcoming events and collaborations
- Easy-to-read schedule for the coming days/weeks
- Integration with society scheduling

### 🎮 **Games**
- Browser-based mini-games
- Anime-themed Wordle and other puzzles
- Fun activities for members to enjoy
- Regular updates with new games

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) - React framework for production
- **Database ORM:** [Prisma](https://www.prisma.io/) - Modern database toolkit
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **API Layer:** [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- **Package Manager:** [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager

## 🚦 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm package manager
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/samsoc-website.git
cd samsoc-website
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
pnpm prisma generate
pnpm prisma migrate dev
```

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio

## 🏗️ Project Structure

```
├── prisma/                 # Database schema and migrations
├── src/
│   ├── app/               # Next.js app directory
│   ├── components/        # Reusable React components
│   ├── lib/              # Utility functions and configurations
│   ├── server/           # tRPC routers and procedures
│   └── styles/           # Global styles and Tailwind config
├── public/               # Static assets
└── package.json
```

## 🤝 Contributing

We welcome contributions from our community! If you'd like to help improve the website:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to:
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Website:** [https://samsoc.co.uk](https://samsoc.co.uk)
- **Email:** [society email]
- **Discord:** [Join our Discord server](https://discord.gg/tQUrdxzUZ4)
- **Instagram:** [@unisamsoc](https://instagram.com/unisamsoc)

## 🙏 Acknowledgments

- University of Surrey Students' Union for their support
- All our committee members and volunteers
- The amazing anime and manga community at Surrey

---

Made with ❤️ by the Surrey Anime and Manga Society
