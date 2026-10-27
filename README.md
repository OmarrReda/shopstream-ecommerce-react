# ShopStream — E-Commerce Web Application

ShopStream is a React-based e-commerce web application built to practice modern front-end development. It provides a shopping experience with product browsing, search and filtering, a shopping cart, user authentication, and an admin dashboard.

## Features

- **Product Browsing:** Browse products and view detailed product information.
- **Search and Filtering:** Search products and filter by category, brand, and price.
- **Pagination:** Navigate through products in manageable pages.
- **Shopping Cart:** Add products to the cart, manage quantities, and view the total amount.
- **User Authentication:** Login and registration flows.
- **Checkout Flow:** Navigate through the checkout process and order success page.
- **User Profile:** Access the user profile area.
- **Admin Dashboard:** Dedicated pages for inventory, orders, and customer management.
- **Dark and Light Themes:** Switch between application themes.
- **Responsive UI:** Built with React Bootstrap for responsive layouts.
- **Notifications:** Display feedback using toast notifications.

## Tech Stack

- **React** — Component-based user interface
- **Vite** — Development server and build tool
- **JavaScript (ES6+)**
- **React Router** — Client-side routing
- **Redux Toolkit** — Global state management
- **React Bootstrap** — UI components and styling
- **Axios** — HTTP requests
- **React Hot Toast** — Notifications
- **DummyJSON API** — Product data and API-based functionality
- **ESLint** — Code quality and linting

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd shopstream-ecommerce-react
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

## Available Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Starts the development server |
| `npm run build`   | Creates a production build    |
| `npm run preview` | Previews the production build |
| `npm run lint`    | Runs ESLint checks            |

## Project Structure

```text
shopstream-ecommerce-react/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── store/
│   │       ├── slices/
│   │       └── store.js
│   ├── pages/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## API

ShopStream uses [DummyJSON](https://dummyjson.com/) to retrieve product data and support selected API-based functionality.

## Purpose

This project was developed as a learning project to strengthen practical skills in React, component design, routing, state management, API integration, and building a multi-page web application.

## Future Improvements

- Improve authentication and authorization with a dedicated backend.
- Connect the application to a persistent database.
- Implement production-ready order processing and payment integration.
- Add automated tests and improve error handling.

---

**ShopStream** — A modern shopping experience built with React.
