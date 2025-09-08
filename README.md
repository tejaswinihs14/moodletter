# MoodLetter - Creative Newsletter Builder with Analytics

A React-based web application that allows users to create and send newsletters with mood-based styling and track recipient engagement through simulated analytics.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation & Running

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd moodletter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📋 Features

### Core Functionality

- **Mood-Based Newsletter Creation**: Choose from 8 different moods (Celebration, Professional, Creative, etc.) with auto-suggested colors and styling
- **Recipient Management**: Add, edit, and delete individual recipients and recipient groups
- **Newsletter Builder**: Create newsletters with subject, body content, and custom call-to-action buttons
- **Campaign Simulation**: "Send" newsletters by logging them to campaign history with unique tracking links
- **Analytics Dashboard**: Track email opens, clicks, and engagement metrics

### Analytics Features

- **Open Rate Tracking**: Automatically tracks when recipients view newsletters
- **Click-Through Rate**: Monitors CTA button interactions
- **Lead Generation**: Lists email addresses of engaged recipients
- **Visual Analytics**: Progress bars and charts for campaign performance

## 🏗️ Technical Architecture

### Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **Data Storage**: LocalStorage (simulated backend)
- **ID Generation**: UUID for unique identifiers

### Project Structure

```
src/
├── components/
│   ├── AnalyticsView.jsx      # Campaign analytics dashboard
│   ├── CampaignHistory.jsx    # List of sent campaigns
│   ├── Navbar.jsx            # Navigation component
│   ├── NewsletterBuilder.jsx # Newsletter creation form
│   └── RecipientManager.jsx  # Recipient and group management
├── pages/
│   ├── Analytics.jsx         # Analytics page wrapper
│   ├── Campaigns.jsx         # Campaigns page wrapper
│   ├── Home.jsx              # Landing page
│   └── RecipientView.jsx     # Newsletter view for recipients
├── utils/
│   ├── moods.js              # Mood definitions and styling
│   └── storage.js            # LocalStorage utilities
└── App.jsx                   # Main application component
```

## 🎨 Design Approach

### Mood-Based Styling System

- **8 Predefined Moods**: Each mood has associated colors, gradients, icons, and descriptions
- **Consistent Theming**: Colors, borders, and CTAs are automatically applied based on mood selection
- **Responsive Design**: Mobile-first approach with TailwindCSS

### Data Management

- **LocalStorage Simulation**: Mimics a backend database for campaigns, recipients, and groups
- **Real-time Updates**: Analytics update immediately when recipients interact with newsletters
- **Persistent State**: All data persists between browser sessions

### User Experience

- **Intuitive Navigation**: Clear navigation between different sections
- **Visual Feedback**: Success messages, loading states, and error handling
- **Accessibility**: Semantic HTML and keyboard navigation support

## 📊 How It Works

### Newsletter Creation Flow

1. Select a mood/theme for automatic styling
2. Choose recipient group or all recipients
3. Write newsletter content (subject, body, CTA)
4. Preview the newsletter with mood-based styling
5. "Send" to log campaign and generate tracking links

### Analytics Simulation

1. **Email Opens**: Automatically tracked when recipient views newsletter
2. **CTA Clicks**: Tracked when recipient clicks call-to-action button
3. **Real-time Updates**: Analytics dashboard updates immediately
4. **Lead Generation**: Email addresses of engaged recipients are listed

### Testing the Simulation

1. Create a newsletter and send it
2. Go to "Campaigns" → "Show Links" to get tracking URLs
3. Open tracking links to simulate recipient interactions
4. View analytics in real-time on the dashboard

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📁 Key Files

### Core Components

- **NewsletterBuilder.jsx**: Main newsletter creation interface with mood selection and preview
- **RecipientManager.jsx**: CRUD operations for recipients and groups
- **AnalyticsView.jsx**: Comprehensive analytics dashboard with charts and metrics
- **RecipientView.jsx**: Newsletter display for recipients with interaction tracking

### Utilities

- **moods.js**: Defines 8 moods with complete styling configurations
- **storage.js**: LocalStorage wrapper functions for data persistence

## 🎯 Project Highlights

### Creativity & Innovation

- **Mood-Based Design System**: Unique approach to newsletter styling
- **Simulated Email Analytics**: Complete email marketing simulation without backend
- **Interactive Preview**: Real-time newsletter preview with mood styling

### Technical Excellence

- **Clean Architecture**: Modular components with clear separation of concerns
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Performance Optimized**: Efficient state management and minimal re-renders

### User Experience

- **Intuitive Interface**: Easy-to-use design for non-technical users
- **Visual Feedback**: Clear success/error states and loading indicators
- **Comprehensive Analytics**: Detailed insights into campaign performance

## 🚀 Deployment

The application can be deployed to any static hosting service:

- **Vercel**: `npm run build` then deploy `dist` folder
- **Netlify**: Drag and drop `dist` folder or connect GitHub repository
- **GitHub Pages**: Use GitHub Actions to build and deploy

## 📝 Notes

- This is a **simulation** - no actual emails are sent
- All data is stored in browser's LocalStorage
- Perfect for demonstrating email marketing concepts and analytics
- Ready for production deployment with minimal configuration

---

**Built with ❤️ using React, Vite, and TailwindCSS**
