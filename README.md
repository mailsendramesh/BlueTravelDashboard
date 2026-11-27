
# BlueTrail Travel Operations Dashboard

A responsive travel operations dashboard built using React, Vite, and Node.js.

## Features

- Travel booking overview dashboard
- Gross paid revenue
- Total bookings
- Pending payments
- Average paid transaction value
- Transaction search by ID and package
- Payment status filtering
- Transaction sorting
- Pagination
- Responsive desktop and mobile layouts
- BlueTrail branding

## Technology Stack

- React
- JavaScript
- Vite
- CSS Modules
- Node.js
- JSON-based data storage

## Project Structure

- API/ - Node.js API server
- BRAND_ASSETS/ - Brand logos and assets
- DATA/ - Transaction and package datasets
- REACT_STARTER/ - React frontend application

## Installation

### Frontend

```bash
cd REACT_STARTER
npm install
```

### Backend

```bash
cd API
node server.mjs
```

### Run Frontend

```bash
cd REACT_STARTER
npm run dev -- --port 5143
```

## Production Build

```bash
cd REACT_STARTER
npm run build
npm run preview
```

## API Configuration

The backend provides transaction and package data through API endpoints.

Configure the production API URL before deployment.

Do not use localhost URLs in production.

## Testing

See ACCEPTANCE_TEST_MATRIX.csv for acceptance testing results.

## Deployment

Production frontend URL: Pending

Production API URL: Pending

## License

Project developed for the BlueTrail Travel Operations Dashboard assignment.
