# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **AfricanShops Control Dashboard**, an admin control panel for managing a multi-country e-commerce marketplace. The application is built with **React 18**, **Vite**, **Material-UI v5**, and the **Fuse React** admin template framework. It manages markets, shops, products, orders, locations (countries/states/LGAs), and various operational aspects of the AfricanShops platform.

## Common Commands

### Development
```bash
npm start          # or `npm run dev` - Start development server on port 3000
npm run build      # Production build (uses increased memory: --max-old-space-size=4096)
npm run preview    # Preview production build
```

### Code Quality
```bash
npm run lint       # Run ESLint on .js and .jsx files
```

### Analysis
```bash
npm run analyze    # Bundle analysis with source-map-explorer
```

## Architecture Overview

### Framework & Core Structure

The application uses the **Fuse React** admin template, which provides a comprehensive structure for enterprise admin applications:

- **Fuse Core** (`src/@fuse/`): Framework utilities, components, and configurations
  - `FuseLayout`: Main layout system with theme support
  - `FuseTheme`: Material-UI theming wrapper
  - `FuseSettings`: App-wide settings management

- **Custom Modules** (`src/app/main/`):
  - `africanshops-control-dashboard/`: Core business modules (countries, states, markets, products, orders, etc.)
  - `africanshops-finance/`: Financial operations dashboard
  - `africanshops-messenger/`: Messaging functionality
  - `users/`: User and admin staff management
  - `vendors-shop/`: Vendor/merchant shop management
  - `homes/`: Property/estate management features
  - `bookings-homes/`: Hospitality/booking properties

### State Management

- **Redux Toolkit** (`@reduxjs/toolkit`): Global state management
- **React Query** (`react-query`): Server state, data fetching, and caching
  - Query hooks located in `src/app/api/` and `src/app/aaqueryhooks/`
  - Custom hooks pattern: `useAdmins`, `useCountries`, etc.
- **Redux Store** (`src/app/store/`):
  - Dynamic slice loading with `withReducer` and `withSlices` HOCs
  - Lazy-loaded slices for code splitting

### Authentication System

**JWT-based authentication** using a custom provider pattern:

- **Provider**: `src/app/auth/services/jwt/JwtAuthProvider.jsx`
  - Manages auth state, token storage, and session lifecycle
  - Uses `js-cookie` for credential storage (not localStorage for sensitive data)
  - Auto-login on mount if valid token exists
  - Token validation with `jwt-decode`

- **Auth Context**: `JwtAuthContext` provides:
  - `user`, `isAuthenticated`, `authStatus`, `isLoading`
  - `signIn()`, `signOut()`, `updateUser()`, `refreshToken()`

- **Admin Login Flow**: Located in `src/app/api/auth/admin-auth.js`
  - Uses React Query mutation: `useAdminLogin()`
  - Endpoint: `POST /authadmin/adminlogin`

### API Layer

**Centralized API management** (`src/app/api/apiRoutes.js`):

- **Base Configuration**:
  - API base URL from env: `VITE_API_BASE_URL_PROD`
  - Two axios instances:
    - `Api()`: Unauthenticated requests
    - `authApi()`: Authenticated requests with access token header

- **Interceptors**:
  - 403 responses → Unauthorized handling
  - 422 responses → Validation error formatting
  - Global error toasts via `react-toastify`

- **API Endpoints**: Organized by domain (all documented inline):
  - Admin authentication (`/authadmin/*`)
  - Countries & shipping (`/buzcountries/*`)
  - States (`/buzstates/*`)
  - LGAs/Counties (`/buz-lgas/*`)
  - Markets (`/markets/*`)
  - Shops/Merchants (`/shops/*`)
  - Orders (`/adminorders/*`, `/financehandleorders/*`)
  - Products, categories, units (`/products/*`, `/productcats/*`)
  - Users & admin staff (`/users/*`, `/admin/*`)
  - And many more...

### Routing

**React Router v6** with config-based routing:

- **Route Configuration**: `src/app/configs/routesConfig.jsx`
  - Imports individual feature configs (e.g., `CountriesAppConfig`, `MarketsAppConfig`)
  - Each module exports its own route config with paths, components, and settings

- **Route Structure Pattern**:
  ```javascript
  {
    path: '/manage-countries',
    auth: ['admin'],
    element: <CountriesApp />,
    settings: { layout: { config: {...} } }
  }
  ```

### Path Aliases

**Important path mappings** (defined in `jsconfig.json` and `vite.config.mjs`):

```javascript
@fuse/*           → src/@fuse/*
@mock-api/*       → src/@mock-api/*
@lodash           → src/@lodash
app/store         → src/app/store
app/configs       → src/app/configs
app/shared-components → src/app/shared-components
app/theme-layouts → src/app/theme-layouts
```

Always use these aliases instead of relative imports for core paths.

### Data Fetching Patterns

The app uses **two main patterns** for data fetching:

1. **React Query Hooks** (preferred for new code):
   ```javascript
   // Located in src/app/api/
   export function useCountries() {
     return useQuery(['countries'], getCountries);
   }
   ```

2. **Legacy Query Hooks** (`src/app/aaqueryhooks/`):
   - Older pattern, gradually being migrated
   - Similar to React Query but custom implementation

### Component Patterns

- **Material-UI Components**: Use MUI v5 components throughout
- **Tables**: `material-react-table` for advanced data tables
- **Forms**: `react-hook-form` with `@hookform/resolvers` for validation
- **Notifications**:
  - `notistack` for snackbars
  - `react-toastify` for toast messages
- **Emotion CSS-in-JS**: `@emotion/react` and `@emotion/styled` for styling

### Environment Variables

**Key environment variables** (`.env`):

- `VITE_API_BASE_URL_PROD`: Backend API URL (required)
- `VITE_MAP_KEY`: Google Maps API key
- `VITE_FIREBASE_*`: Firebase auth configuration (optional)
- `VITE_AWS_*`: AWS Cognito configuration (optional)

All Vite env vars must be prefixed with `VITE_` to be exposed to the client.

## Development Guidelines

### Working with the API

1. **Always use the centralized API functions** from `src/app/api/apiRoutes.js`
2. **For authenticated requests**, use `authApi()` which automatically includes the access token
3. **Token handling**: The auth system manages tokens automatically via cookies (`jwt_auth_credentials`)
4. **Error handling**: API errors are caught by interceptors and show toast notifications

### Adding New Features

When adding new feature modules:

1. Create feature folder in `src/app/main/`
2. Create an `*AppConfig.jsx` file with route configuration
3. Add config import to `src/app/configs/routesConfig.jsx`
4. Add API endpoints to `src/app/api/apiRoutes.js`
5. Create React Query hooks in `src/app/api/[feature]/`
6. Follow Material-UI theming and use Fuse components where applicable

### Working with Tables

The app uses `material-react-table` extensively:
- Reference existing table implementations in `*Table.jsx` files
- Common pattern: Located in `products/`, `orders/`, `markets/` folders
- Tables are typically named `[Feature]Table.jsx` (e.g., `CountriesTable.jsx`)

### Forms and Validation

- Use `react-hook-form` for all forms
- Form components typically named `[Feature]Form.jsx` or in `tabs/` folders
- Validation schemas using `zod` (v3.23.8)
- MUI TextField components integrated with react-hook-form

### Authentication & Authorization

- **Auth guards**: Routes specify `auth` array with required roles
- **Role checks**: User role stored in auth context (`user.role`)
- **Token refresh**: Handled automatically by auth provider
- **Logout**: Use `signOut()` from `JwtAuthContext` - clears cookies and reloads

### Location Data Hierarchy

The app manages a **geographical hierarchy**:
1. **Countries** (`/buzcountries`) - Top level, operational countries
2. **States** (`/buzstates`) - Belongs to country
3. **LGAs/Counties** (`/buz-lgas`) - Belongs to state
4. **Markets** (`/markets`) - Physical markets, belongs to LGA
5. **Shops** (`/shops`) - Vendor shops in markets

Always respect this hierarchy when creating/updating location-based entities.

### Key Business Concepts

- **Merchants/Vendors**: Shop owners with different types (resource-vendor, resource-partner, resource-company)
- **Markets**: Physical marketplaces where shops operate
- **Tradehubs**: Logistics/distribution centers
- **Shipping Tables**: Country-to-country shipping cost configurations
- **Orders**: Multi-stage order management (pack → ship → confirm arrival → deliver)
- **Estates**: Real estate property listings (separate from marketplace)
- **Hospitality**: Booking properties (hotels, lodging)

## Build & Deployment

### Production Build

The build command uses increased Node memory allocation:
```bash
NODE_OPTIONS=--max-old-space-size=4096 vite build
```

This is necessary due to the large dependency tree and bundle size.

### Build Output

- Output directory: `build/`
- Vite builds for modern browsers (see `browserslist` in package.json)

## Testing Considerations

- No test framework currently configured
- When adding tests, integrate with Vite's test utilities
- Consider Vitest for unit testing (Vite-native)

## Common Issues & Solutions

### HMR (Hot Module Reload)

The app has a custom HMR handler in `vite.config.mjs`:
- Changes to `src/app/configs/` trigger full reload (not HMR)
- This prevents config change issues requiring manual refresh

### Memory Issues During Build

If build fails with OOM errors:
- Increase `--max-old-space-size` value in build script
- Check for circular dependencies
- Review bundle analysis with `npm run analyze`

### Authentication Issues

If auth is failing:
1. Check cookie storage: `jwt_auth_credentials` should exist
2. Verify token expiry with browser dev tools
3. Check API base URL in `.env`
4. Review network tab for 401/403 responses

### Import Path Issues

If imports fail:
- Verify path aliases in both `jsconfig.json` and `vite.config.mjs` match
- Restart dev server after changing configs
- Use aliased paths (`@fuse/`, `app/store`) not relative paths for core modules

## Code Style Notes

- **No emojis** in code or commits unless specifically requested
- **ESLint**: Airbnb config with React rules
- **Prettier**: Configured for consistent formatting
- **File naming**: PascalCase for components (`.jsx`), camelCase for utilities (`.js`)
- **Import order**: External deps → Internal deps → Relative imports
