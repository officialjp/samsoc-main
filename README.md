# Surrey Anime and Manga Society Website

Welcome to the official website of the Surrey Anime and Manga Society (SAMSoC). This is a modern web application built using contemporary technologies to support and engage our anime and manga community.

## About

The Surrey Anime and Manga Society website serves as the central hub for our community. It provides access to our manga library, event information, photo galleries, interactive games, and more. Whether you are a current member or interested in joining, this platform offers the tools and information needed to stay connected with the society.

## Features

### Manga Library
- Comprehensive filtering system for browsing the collection
- Search functionality by genre, author, title, and more
- Detailed information for each manga volume
- Member request system for new additions

### Gallery
- Photo collections from society events and collaborations
- Organised albums for straightforward browsing
- High-quality images highlighting community activities

### Events
- Detailed descriptions of all society events
- Information on collaborations with other societies
- Archives of past events and previews of upcoming ones

### Calendar
- Interactive calendar interface
- Display of upcoming events and collaborations
- Clear and accessible scheduling for upcoming days and weeks
- Integration with society scheduling tools

### Games
- Browser-based mini-games
- Anime-themed word and puzzle games
- Interactive activities for members
- Regular updates with new content

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) – React framework for production-ready applications  
- **Database ORM:** [Prisma](https://www.prisma.io/) – Modern database toolkit  
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework  
- **API Layer:** [tRPC](https://trpc.io/) – End-to-end type-safe APIs  
- **Package Manager:** [pnpm](https://pnpm.io/) – Fast and disk space-efficient package manager  

## Getting Started

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

6. Open http://localhost:3000 in your browser.

## Available Scripts

- `pnpm dev` – Start the development server  
- `pnpm build` – Build the application for production  
- `pnpm start` – Start the production server  
- `pnpm lint` – Run ESLint  
- `pnpm prisma:generate` – Generate the Prisma client  
- `pnpm prisma:migrate` – Run database migrations  
- `pnpm prisma:studio` – Open Prisma Studio  

## Project Structure

```
├── prisma/                 # Database schema and migrations
├── src/
│   ├── app/               # Next.js app directory
│   ├── components/        # Reusable React components
│   ├── lib/               # Utility functions and configuration
│   ├── server/            # tRPC routers and procedures
│   └── styles/            # Global styles and Tailwind configuration
├── public/                # Static assets
└── package.json
```

## Contributing

Contributions from the community are welcome. To help improve the website:

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit your changes (`git commit -m 'Add some amazing feature'`)  
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request  

Please ensure that you:
- Follow the existing code style
- Add tests for new features
- Update documentation where necessary
- Verify that all tests pass before submitting

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

- **Website:** https://samsoc.co.uk  
- **Email:** [society email]  
- **Discord:** https://discord.gg/tQUrdxzUZ4  
- **Instagram:** https://instagram.com/unisamsoc  

## Acknowledgments

- University of Surrey Students' Union for their continued support  
- All committee members and volunteers  
- The anime and manga community at the University of Surrey  

---

Developed and maintained by the Surrey Anime and Manga Society
