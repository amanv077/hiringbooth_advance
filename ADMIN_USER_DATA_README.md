# Admin User Data Management

## Overview
The Admin User Data page is a comprehensive tool for administrators to view, filter, edit, and manage user information efficiently. This feature provides powerful data management capabilities with Excel export functionality.

## Features

### 🔍 **Advanced Search & Filtering**
- **Text Search**: Search by name, email, or bio content
- **Location Filter**: Filter users by geographic location
- **Education Filter**: Filter by educational background
- **Experience Filter**: Filter by years of experience or job titles
- **Skills Filter**: Find users with specific technical skills
- **Clear All**: Reset all filters with one click

### 👥 **User Management**
- **View All Users**: See all registered users (excludes employers and admins)
- **User Cards**: Clean, card-based layout showing key information at a glance
- **Verification Status**: Visual indicators for verified/unverified accounts
- **Application Count**: See how many jobs each user has applied to

### 🔧 **Detailed User Operations**
- **View Details**: Comprehensive user profile information
- **Edit User**: Modify user information and profile details
- **Delete User**: Remove users with confirmation dialog
- **Application History**: View all job applications with company details

### 📊 **Data Export**
- **Excel Export**: Download filtered user data as Excel spreadsheet
- **Comprehensive Data**: Includes all user profile information
- **Filtered Export**: Only exports users matching current filters
- **Formatted Output**: Professional Excel formatting with proper column widths

## Page Structure

### Navigation
- Access via Admin Dashboard → Quick Actions → "User Data"
- Direct URL: `/admin/user-data`

### Main Components
1. **Header Section**
   - Page title and user count
   - Export Excel button
   - Back to dashboard link

2. **Search & Filter Panel**
   - Multi-column search inputs
   - Expandable additional filters
   - Clear all filters button

3. **User Cards Grid**
   - Responsive card layout
   - Key user information display
   - Quick action buttons

4. **User Detail Modal**
   - Complete profile information
   - Edit mode with form validation
   - Application history
   - Delete functionality

## API Endpoints

### GET `/api/admin/user-data`
- Fetch all users with optional filtering
- Supports query parameters: `education`, `experience`, `location`, `skills`
- Returns user profiles and application counts

### GET `/api/admin/user-data/[id]`
- Fetch detailed information for a specific user
- Includes complete profile and application history

### PUT `/api/admin/user-data/[id]`
- Update user information
- Supports both basic user data and profile updates

### DELETE `/api/admin/user-data/[id]`
- Delete a user account
- Cascade deletes related profile and application data

### GET `/api/admin/user-data/export`
- Generate Excel export of user data
- Respects current filter parameters
- Returns downloadable Excel file

## Security Features

### Authentication & Authorization
- Requires admin authentication token
- Validates admin role for all operations
- Prevents unauthorized access to user data

### Data Protection
- Only allows operations on regular users (not employers/admins)
- Confirmation dialogs for destructive operations
- Secure data handling in all API endpoints

## User Interface Features

### Responsive Design
- Mobile-friendly layout
- Adaptive grid system
- Touch-friendly controls

### Interactive Elements
- Hover effects on cards
- Loading states for all operations
- Toast notifications for user feedback
- Modal dialogs for detailed operations

### Visual Indicators
- Verification status badges
- Skill tags with color coding
- Application count displays
- Registration date information

## Usage Examples

### Finding Users by Skills
1. Click "More Filters" to expand filter options
2. Enter skill keywords in the "Skills" field
3. Results update automatically
4. Export filtered results if needed

### Bulk User Management
1. Apply desired filters to narrow down users
2. Use "Export Excel" to download user list
3. Review data offline
4. Return to make individual user edits as needed

### User Profile Editing
1. Click "View Details" on any user card
2. Click "Edit" button in the modal
3. Modify any profile information
4. Click "Save Changes" to update

## Technical Implementation

### Frontend Technologies
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Lucide React for icons

### Backend Integration
- RESTful API design
- Prisma ORM for database operations
- JWT authentication
- Excel generation with xlsx library

### Performance Optimizations
- Efficient database queries with Prisma
- Client-side filtering for fast search
- Lazy loading of user details
- Optimized API response size

## Future Enhancements

### Planned Features
- Advanced analytics dashboard
- Bulk user operations
- User activity tracking
- Custom export templates
- Email communication tools

### Scalability Considerations
- Pagination for large user lists
- Database indexing optimization
- Caching strategies for frequent queries
- Background job processing for exports

## Troubleshooting

### Common Issues
1. **Export Not Working**: Ensure xlsx package is installed
2. **Slow Loading**: Check database indexes on user profiles
3. **Filter Not Applying**: Verify API endpoint responses
4. **Edit Failures**: Check user permissions and validation

### Support
For technical issues or feature requests, please contact the development team or create an issue in the project repository.
