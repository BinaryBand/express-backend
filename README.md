# ExpressJS Backend Project

## Introduction

This project is a web application that allows users to create an account and authenticate using a cryptographic-generated token. The project is built using Express.js, Bootstrap, sqlite3, and Handlebars.

## Requirements

* Node.js
* npm

## Getting Started

### Installation

    1. Clone this repository to your local machine.
```bash
    git clone https://github.com/BinaryBand/express-backend.git
```

    2. Navigate to the project directory.
```bash
    cd express-backend
```

    3. Install the required dependencies.
```bash
    npm install
```

    4. Create a .env file in the project root and add the following environment variables:
```
    ENCRYPTION_KEY=your_encryption_key
    HASH_SALT=your_hash_salt
    TOKEN_SECRET=your_token_secret
```

    5. Start the development server. The application will be available at http://localhost:3000.
```bash
    npm start
```

### Usage

* Create an account by providing a username and password.
* Login to your account using the generated authentication token.

## Built With

* <ins>Express.js</ins> - The web framework used
* <ins>Bootstrap</ins> - The CSS framework used
* <ins>sqlite3</ins> - The database used
* <ins>Handlebars</ins> - The template engine used

## Author

* Shane Davenport