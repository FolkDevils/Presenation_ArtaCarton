# Next.js Template

A minimal Next.js template with TypeScript and Tailwind CSS, designed for quick project bootstrapping.

## Features

- Next.js 14
- TypeScript
- Tailwind CSS
- Custom font (Rubik) with variable weights
- Dark/Light mode support
- Minimal dependencies
- Clean project structure

## Getting Started

1. Clone this template:
```bash
git clone [your-repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
.
├── public/
│   └── fonts/              # Font files
├── src/
│   ├── app/
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   └── components/         # React components
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## Customization

### Colors
The template includes a simple color scheme with light/dark mode support. You can customize the colors in:
- `src/app/globals.css` - CSS variables
- `tailwind.config.ts` - Tailwind theme configuration

### Typography
The template uses Rubik as the default font. To change the font:
1. Add your font files to `public/fonts/`
2. Update the font face declaration in `src/app/globals.css`
3. Update the font family in `tailwind.config.ts`

## License

MIT
