# Project Setup

This guide provides instructions for setting up the development environment for the portfolio project.

## Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js**: Version 18.20.2 or higher.
-   **pnpm**: Version 9 or 10.
-   **Docker**: For running the PostgreSQL database.

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd portfolio-project
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

## Configuration

1.  **Create an environment file**:
    Copy the example environment file to a new `.env` file:
    ```bash
    cp env.example .env
    ```

2.  **Configure environment variables**:
    Open the `.env` file and fill in the following values:

    -   `PAYLOAD_SECRET`: A secret key for PayloadCMS. You can generate one with the following command:
        ```bash
        openssl rand -base64 32
        ```
    -   `POSTGRES_HOST`: The hostname of your PostgreSQL database (e.g., `localhost`).
    -   `POSTGRES_PORT`: The port of your PostgreSQL database (e.g., `5432`).
    -   `POSTGRES_DB`: The name of the PostgreSQL database.
    -   `POSTGRES_USER`: The username for the PostgreSQL database.
    -   `POSTGRES_PASSWORD`: The password for the PostgreSQL database.
    -   `NEXT_PUBLIC_SERVER_URL`: The public URL of your server (e.g., `http://localhost:3000`).

## Running the Application

1.  **Start the database**:
    If you are using Docker, you can start a PostgreSQL instance with the following command (assuming you have a `docker-compose.yml` file for it):
    ```bash
    docker-compose up -d
    ```

2.  **Start the development server**:
    ```bash
    pnpm dev
    ```

3.  **Access the application**:
    -   **Frontend**: [http://localhost:3000](http://localhost:3000)
    -   **PayloadCMS Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

## Available Scripts

-   `pnpm dev`: Starts the development server.
-   `pnpm build`: Builds the application for production.
-   `pnpm start`: Starts the production server.
-   `pnpm lint`: Lints the codebase.
-   `pnpm generate:types`: Generates TypeScript types for PayloadCMS collections.
-   `pnpm payload`: Access the PayloadCMS CLI.
