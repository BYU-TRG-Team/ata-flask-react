# ATA React Frontend

This is the frontend application for the ATA project, built using React and Vite.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Building the App](#building-the-app)
- [Docker](#docker)
- [Nginx Configuration](#nginx-configuration)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/BYU-TRG-Team/ata_flask_react.git
    cd ata_flask_react/frontend
    ```

2. Install the required dependencies:
    ```sh
    npm install
    ```

## Running the App

1. Start the development server:
    ```sh
    npm run dev
    ```

2. Open your browser and navigate to `http://localhost:3000`.

## Building the App

1. Build the production-ready app:
    ```sh
    npm run build
    ```

2. The built files will be located in the `dist` directory.

## Docker

1. Build the Docker image:
    ```sh
    docker build -t ata-frontend .
    ```

2. Run the Docker container:
    ```sh
    docker run -p 443:443 ata-frontend
    ```

## Nginx Configuration

The app uses Nginx as a web server with SSL enabled. The Nginx configuration is defined in the `nginx-ssl.conf` file. A self-signed SSL certificate is generated during the Docker build process.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.