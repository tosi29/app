# Next.js Application

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Features

### Broadcast Listing
- View past broadcasts organized by series
- Expand/collapse series groups
- View broadcast details

### Broadcast Search
- Search broadcasts by keyword (in title or description)
- Filter by series
- Filter by date range
- View search results in a table format

### Development

#### Linting
This project uses SuperLinter with ReviewDog integration for code quality checks on pull requests:

- JavaScript/TypeScript: ESLint with Next.js configuration
- CSS: Stylelint with standard configuration
- Automated PR comments for lint issues

To run linting locally:
```bash
# JavaScript/TypeScript linting
npm run lint

# CSS linting
npm run lint:style

# Type checking
npm run type-check
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
