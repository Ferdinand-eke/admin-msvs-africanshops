# Admin Profile Settings Module

## Overview

The Admin Profile Settings module provides a comprehensive interface for admin users to manage their profile information and referral links. This module ensures proper access control and maintains data integrity through HR-controlled updates for critical information.

## Features

### 1. Profile Management
- **View Profile Information**: Display admin's complete profile including:
  - Personal details (name, email, phone, employee ID)
  - Department and designation information
  - Leadership status indicators
  - Social media handles

- **Editable Fields**: Admin can self-update:
  - Facebook profile URL
  - Twitter/X handle
  - LinkedIn profile URL
  - Instagram handle
  - WhatsApp contact number

- **Protected Fields** (Require HR Approval):
  - Full name
  - Email address
  - Phone number
  - Employee ID
  - Department assignment
  - Designation assignment

### 2. Referral Link Management
- **Two Platform Support**:
  - Merchant platform referral links
  - User platform referral links

- **Features**:
  - Generate unique referral links for both platforms
  - Copy-to-clipboard functionality
  - Referral statistics tracking:
    - Total referrals
    - Merchant referrals
    - User referrals
    - Active users from referrals
  - Regenerate links when needed

## File Structure

```
manage-admin-settings/
├── AdminProfileSettingsAppConfig.jsx    # Route configuration
├── AdminProfileSettingsApp.jsx          # Main app container
├── components/
│   └── AdminProfileSettingsHeader.jsx   # Navigation header with tabs
├── tabs/
│   ├── ProfileView.jsx                  # Profile viewing and editing
│   └── ReferralLinks.jsx                # Referral link management
├── hooks/
│   ├── useAdminProfile.js               # Profile data hooks
│   └── useReferralLinks.js              # Referral link hooks
└── README.md                            # This file
```

## Routes

The module is accessible at:
- Base path: `/admin-settings`
- Profile tab: `/admin-settings/profile`
- Referral links tab: `/admin-settings/referral-links`

## API Endpoints

The module uses the following API endpoints (defined in `src/app/api/apiRoutes.js`):

### Profile Management
- `GET /authadmin/profile` - Fetch admin profile data
- `PUT /authadmin/profile/social-media` - Update social media handles

### Referral Links
- `GET /authadmin/referral-links` - Fetch referral links and statistics
- `POST /authadmin/referral-links/generate` - Generate new referral links

## Data Flow

### Profile Update Flow
1. Admin edits social media fields in ProfileView component
2. Form validation occurs via react-hook-form
3. On submit, useUpdateAdminSocialMedia hook calls API
4. Success: Profile data is invalidated and refetched
5. User receives success notification via toast

### Referral Link Generation Flow
1. Admin clicks "Generate Referral Links" button
2. useGenerateReferralLinks hook calls API
3. API generates unique links for both platforms
4. Success: Referral data is invalidated and refetched
5. Links appear with copy buttons and statistics

## Authentication & Authorization

- **Auth Guard**: Routes require `['admin']` authentication
- **Token-based**: Uses JWT authentication via `authApi()`
- **Session Management**: Integrates with existing JWT auth system

## UI/UX Features

### Design Elements
- Material-UI v5 components throughout
- Framer Motion animations for smooth transitions
- Responsive design (mobile and desktop)
- Professional color scheme with proper contrast
- Fuse React admin template integration

### User Interactions
- Tab-based navigation between sections
- Inline editing with edit/save/cancel workflow
- One-click copy-to-clipboard for referral links
- Visual feedback for copied items
- Loading states during API calls
- Error handling with user-friendly messages

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## Component Details

### ProfileView Component
**Purpose**: Display and edit admin profile information

**Key Features**:
- Avatar display with first letter of name
- Read-only personal information section with HR approval notice
- Editable social media section with inline editing
- Form validation and error handling
- Optimistic UI updates

**State Management**:
- React Hook Form for form state
- React Query for server state
- Local state for edit mode

### ReferralLinks Component
**Purpose**: Manage referral links for merchant and user platforms

**Key Features**:
- Statistics dashboard showing referral metrics
- Separate cards for merchant and user platform links
- Copy-to-clipboard functionality with visual feedback
- Generate/Regenerate links capability
- Empty state with call-to-action

**State Management**:
- React Query for server state
- Local state for copy feedback

## Integration with Existing System

### Follows Project Patterns
- Uses centralized API management (`apiRoutes.js`)
- Implements React Query for data fetching
- Follows Fuse React template structure
- Uses Material-UI theming
- Implements path aliases (`@fuse/*`, `app/*`)

### Compatible with
- Existing authentication system (JwtAuthProvider)
- Current routing configuration
- Toast notification system (react-toastify)
- Form validation approach (react-hook-form)

## Testing the Module

### Manual Testing Checklist

1. **Navigation**
   - [ ] Can access `/admin-settings` route
   - [ ] Tab navigation works between Profile and Referral Links
   - [ ] Browser back/forward buttons work correctly

2. **Profile Section**
   - [ ] Profile data loads correctly
   - [ ] Can enter edit mode for social media
   - [ ] Can save changes successfully
   - [ ] Can cancel editing without saving
   - [ ] Loading states appear during API calls
   - [ ] Error messages display on failure

3. **Referral Links Section**
   - [ ] Can generate initial referral links
   - [ ] Statistics display correctly
   - [ ] Copy buttons work for both links
   - [ ] Visual feedback shows after copying
   - [ ] Can regenerate links
   - [ ] Empty state displays when no links exist

4. **Responsive Design**
   - [ ] Layout works on mobile devices
   - [ ] Layout works on tablets
   - [ ] Layout works on desktop screens

5. **Error Handling**
   - [ ] Network errors show appropriate messages
   - [ ] API errors are handled gracefully
   - [ ] Form validation errors display correctly

## Production Readiness

### Security Considerations
- All API calls use authenticated `authApi()` instance
- JWT tokens managed securely via cookies
- Role-based access control enforced
- No sensitive data in client-side logs

### Performance Optimizations
- React Query caching reduces API calls
- Lazy loading of route components
- Optimistic UI updates for better UX
- Debounced form submissions

### Best Practices Implemented
- TypeScript-ready (can be migrated)
- Clean component separation
- Reusable hooks pattern
- Proper error boundaries
- Accessible markup
- SEO-friendly structure

## Future Enhancements

Potential improvements for future iterations:
1. Profile picture upload functionality
2. Additional social media platforms
3. Referral analytics dashboard
4. Email notification for successful referrals
5. QR code generation for referral links
6. Referral leaderboard
7. Activity history/audit log
8. Two-factor authentication settings
9. Privacy settings management
10. Notification preferences

## Support

For issues or questions regarding this module:
1. Check the CLAUDE.md file in the project root
2. Review the API documentation
3. Contact the development team

## Version History

- **v1.0.0** (2025-11-08): Initial implementation
  - Profile viewing and editing
  - Social media management
  - Referral link generation
  - Statistics tracking
