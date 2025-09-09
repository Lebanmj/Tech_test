# Teknorix Jobs Portal

A modern React.js application for displaying and managing job openings at Teknorix. This application provides a comprehensive job search experience with filtering, detailed job views, and social sharing capabilities.

## 🚀 Features

### Job Search & Filtering
- **Smart Search**: Real-time job search with 2-second debounce
- **Advanced Filters**: Filter by Department, Location, and Function
- **Visual Filter Tags**: See applied filters with easy removal options
- **Server-side Filtering**: All filters are processed server-side for optimal performance
- **Filter Persistence**: Filters are retained during navigation and page refresh

### Job Listings
- **Organized Display**: Jobs grouped by department for better organization
- **Responsive Design**: Mobile-friendly layout with Bootstrap integration
- **Dual Actions**: Apply and View buttons for each job listing
- **Social Sharing**: Share jobs on Facebook, LinkedIn, and Twitter

### Job Details
- **Comprehensive Information**: Detailed job descriptions and requirements
- **Related Jobs**: Shows other openings from the same department
- **Direct Application**: Apply button redirects to official application form
- **Social Integration**: Share job postings across social media platforms

## 🛠 Tech Stack

- **Frontend**: React.js 18 with Hooks
- **Build Tool**: Vite
- **Styling**: Bootstrap 5 + Custom CSS
- **Icons**: Font Awesome
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lebanmj/Tech_test.git
   cd teknorix-job-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the project**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```



## 🔌 API Integration

The application integrates with the Teknorix Jobsoid API:

- **Base URL**: `https://teknorix.jobsoid.com/api/v1`
- **Jobs List**: `GET /jobs` (with filtering support)
- **Job Details**: `GET /jobs/{id}`
- **Lookups**: `GET /departments`, `GET /locations`, `GET /functions`


## 🎨 UI/UX Features

### Search Experience
- Debounced search input (2-second delay)
- Visual search icon indicator
- Clear search functionality

### Filter System
- Multi-select dropdown filters
- Visual filter chips with remove buttons
- "Clear All" functionality
- Filter count indicators

### Job Cards
- Clean, modern design
- Department grouping with styled headers
- Location and job type badges
- Social sharing icons
- Responsive button layout

### Social Sharing
- **Facebook**: Direct job link sharing
- **LinkedIn**: Professional job posting sharing
- **Twitter**: Job title + link sharing
- All sharing opens in new tabs





### Application URLs
- **Job Applications**: `https://jobs.teknorix.com/apply/{jobId}`
- **Job Details**: `/jobs/{jobId}`

## 🧪 Testing

Run the development server and test the following features:

1. **Search Functionality**
   - Type in search box and verify 2-second delay
   - Test search results filtering

2. **Filter System**
   - Select multiple departments/locations/functions
   - Verify server-side filtering
   - Test filter removal and clear all

3. **Navigation**
   - Test job details navigation
   - Verify back navigation retains filters
   - Test page refresh filter persistence

4. **Social Sharing**
   - Test Facebook sharing
   - Test LinkedIn sharing
   - Test Twitter sharing

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-optimized layouts
- Touch-friendly buttons
- Responsive filter dropdowns
- Adaptive job card layouts

## 🚀 Performance Features

- **Debounced Search**: Reduces API calls during typing
- **Efficient Filtering**: Server-side processing
- **Optimized Rendering**: React hooks for state management
- **Fast Build**: Vite for lightning-fast development

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is developed as part of a technical assessment for Teknorix.



---

