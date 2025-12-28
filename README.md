# PMS Admin Frontend

## Project Overview

The PMS Admin Frontend is an Angular-based web application designed to manage and administer parking sites. It provides a user-friendly interface for managing sites, and its entities. The application is structured to ensure maintainability, and ease of use.

## Features

- **Site Management**: Create, view, and manage sites.
- **Polygon Management**: Add and manage polygons associated with sites.
- **Pagination and Breadcrumbs**: Navigate through data efficiently.
- **Multi-language Support**: Supports multiple languages (e.g., Arabic and English).

## Project Structure

The project follows a modular structure to ensure maintainability and scalability. Below is an overview of the key directories and their purposes:

### `src/`

- **`app/`**: Contains the core application logic, including routing, configuration, and global styles.

  - `features/`: Houses feature-specific modules and components.
    - `create-site-form/`: Components and logic for creating sites.
    - `header/`: Header component for the application.
    - `leaf-site/`: Components for managing leaf sites page.
    - `site-card/`: Components for displaying site cards.
    - `sites-container/`: Components for managing and displaying a list of sites.
  - `shared/`: Contains shared models and services used across the application.
    - `models/`: TypeScript models for data structures.
    - `services/`: Services for handling business logic and API communication.
  - `environments/`: Environment-specific configurations (e.g., development and production).

- **`assets/`**: Static assets such as images, icons, and styles.
  - `i18n/`: JSON files for internationalization.
  - `_tokens/`: SCSS partials for design tokens like colors and fonts.

### Key Files

- `angular.json`: Angular CLI configuration file.
- `package.json`: Lists project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration file.
- `Dockerfile`: Docker configuration for containerizing the application.

## Installation

### Prerequisites

- Node.js (v21 or higher)
- Angular CLI
- Docker (optional, for containerized deployment)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/GS-PMS/pms-admin-frontend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd pms-admin-frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open the application in your browser at `http://localhost:4200`.

## Scripts

- `npm start`: Starts the development server.
- `npm run build`: Builds the application for production.

## Development server

To start a local development server, run:

```bash
ng serve
```

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Acknowledgments

- The Giza Systems team for their support and contributions.
