# Thalassic WebApp

A comprehensive maritime training and blog platform for Hari Om Thalassic, built with React and modern web technologies.

## Project Overview

This is a full-featured web application that serves as a maritime training platform with integrated blog functionality, user authentication, and administrative capabilities.

## Project Structure

```
├── public/                 # Static assets and HTML template
├── src/
│   ├── components/
│   │   ├── admin/         # Admin panel components (10 files)
│   │   ├── auth/          # Authentication system (11 files)
│   │   ├── blog/          # Blog functionality (1 file)
│   │   ├── common/        # Shared components (3 files)
│   │   ├── courses/       # Course management (5 files)
│   │   ├── pages/         # Main application pages (12 files)
│   │   └── ui/            # UI components (5 files)
│   ├── assets/            # Images, videos, and media files
│   │   ├── partners/      # Partner logos and images
│   │   ├── services/      # Service-related assets
│   │   ├── sideassets/    # Sidebar and UI assets
│   │   └── testomonials/  # Testimonial images
│   ├── styles/            # CSS stylesheets (5 files)
│   ├── App.js             # Main application component
│   ├── Routes.jsx         # Application routing configuration
│   └── index.js           # Application entry point
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Dependencies and scripts
```

## Features

### Core Functionality
- **Landing Page** - Modern, responsive homepage
- **Course Management** - Complete course catalog and enrollment system
- **Blog Platform** - Maritime insights and updates blog
- **User Authentication** - Signup, login, email/phone verification
- **User Dashboard** - Personal dashboard with profile management
- **Document Management** - Document upload and management
- **Education & Training** - Educational resources and training modules
- **Sea Service** - Maritime service tracking

### Administrative Features
- **Admin Dashboard** - Comprehensive admin panel
- **Documentation Management** - Admin documentation system
- **Flag State Administration** - Maritime flag state management
- **Analytics** - Platform analytics and reporting

### Technical Features
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern React Architecture** - React 18 with hooks and context
- **Routing** - React Router v6 for navigation
- **UI Components** - Radix UI components with Lucide React icons
- **Custom Styling** - Tailwind CSS with custom color variables

## Technology Stack

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.30.1
- **Styling**: Tailwind CSS with PostCSS
- **UI Components**: Radix UI Dialog, Lucide React Icons
- **Build Tool**: React Scripts 5.0.1
- **Fonts**: Josefin Sans, Inter

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd thalassic-webapp
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Application Routes

- `/` - Landing page
- `/courses` - Course catalog
- `/blog` - Blog platform
- `/get-started` - Getting started guide
- `/signup` - User registration
- `/login` - User authentication
- `/dashboard` - User dashboard
- `/profile` - User profile management
- `/document` - Document management
- `/education` - Educational resources
- `/training` - Training modules
- `/sea-service` - Sea service tracking
- `/admin/*` - Administrative panel

## Development

This project follows modern React development practices:

- **Component-based architecture** with reusable UI components
- **Context API** for state management (AuthProvider)
- **Custom CSS variables** for consistent theming
- **Responsive design** with mobile-first approach
- **Modular styling** with component-specific CSS files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for Hari Om Thalassic.
