# SmartPhone Frontend Project

A comprehensive e-commerce platform for smartphone sales with multi-role user management, built with React and Flutter.

## 🚀 Features

### 📱 Multi-Platform Support
- **Web Application**: React-based frontend with modern UI/UX
- **Mobile Application**: Flutter-based cross-platform mobile app
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

### 👥 Multi-Role User System
- **Super Admin**: Complete system management and analytics
- **Admin**: Order management and user oversight
- **Regular Users**: Shopping, ordering, and profile management

### 🛒 E-commerce Features
- **Product Catalog**: Browse and search smartphones
- **Shopping Cart**: Add/remove items and manage quantities
- **Order Management**: Place orders, track status, and view history
- **Payment Integration**: Secure payment processing
- **User Profiles**: Manage personal information and preferences

### 🔐 Authentication & Security
- **Google OAuth**: Social login integration
- **OTP Verification**: Two-factor authentication
- **Role-based Access Control**: Secure route protection
- **Session Management**: Secure user sessions

### 📊 Admin Dashboard
- **Analytics**: Sales reports and user statistics
- **Order Management**: Process and track all orders
- **User Management**: Manage user accounts and permissions
- **Inventory Control**: Monitor product availability

## 🛠️ Technology Stack

### Frontend (Web)
- **React 18**: Modern UI framework
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Context API**: State management

### Mobile App
- **Flutter**: Cross-platform mobile development
- **Dart**: Programming language
- **Material Design**: UI components

### Development Tools
- **PostCSS**: CSS processing
- **ESLint**: Code linting
- **Git**: Version control

## 📁 Project Structure

```
xaliye-phones-frontend-full-ready/
├── src/
│   ├── admin/           # Admin role components and pages
│   ├── super/           # Super admin components and pages
│   ├── user/            # User role components and pages
│   ├── components/      # Shared components
│   ├── pages/           # Main application pages
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Layout components
│   ├── routes/          # Routing configuration
│   └── utils/           # Utility functions
├── xaliye_application/  # Flutter mobile app
│   ├── lib/
│   │   ├── admin/       # Admin mobile features
│   │   ├── super/       # Super admin mobile features
│   │   ├── users/       # User mobile features
│   │   ├── pages/       # Mobile app pages
│   │   ├── services/    # API services
│   │   ├── models/      # Data models
│   │   └── widgets/     # Reusable widgets
│   ├── android/         # Android-specific files
│   ├── ios/             # iOS-specific files
│   └── web/             # Web platform files
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Flutter SDK (for mobile development)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdinasir-Osman/SmartPhone_fronend.git
   cd SmartPhone_fronend
   ```

2. **Install web dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **For mobile development**
   ```bash
   cd xaliye_application
   flutter pub get
   flutter run
   ```

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=your_api_endpoint
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Flutter Configuration
Update `xaliye_application/pubspec.yaml` with your dependencies and configurations.

## 👥 User Roles & Permissions

### Super Admin
- Full system access
- User management
- Analytics and reports
- System configuration

### Admin
- Order processing
- User oversight
- Inventory management
- Sales reports

### Regular User
- Browse products
- Place orders
- Manage profile
- View order history

## 🛒 Shopping Features

- **Product Browsing**: Search and filter smartphones
- **Detailed Product Pages**: Specifications, images, and reviews
- **Shopping Cart**: Add items and manage quantities
- **Checkout Process**: Secure payment and order confirmation
- **Order Tracking**: Real-time order status updates

## 📊 Admin Features

- **Dashboard Analytics**: Sales metrics and user statistics
- **Order Management**: Process and update order status
- **User Management**: View and manage user accounts
- **Inventory Control**: Monitor product stock levels
- **Reports Generation**: Export data and generate reports

## 🔐 Security Features

- **Authentication**: Secure login with OAuth support
- **Authorization**: Role-based access control
- **Data Protection**: Secure data transmission
- **Session Management**: Automatic session handling

## 🌐 API Integration

The application integrates with backend APIs for:
- User authentication and management
- Product catalog and inventory
- Order processing and tracking
- Payment processing
- Analytics and reporting

## 📱 Mobile App Features

- **Cross-platform**: Works on iOS and Android
- **Offline Support**: Basic functionality without internet
- **Push Notifications**: Order updates and promotions
- **Native Performance**: Optimized for mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abdinasir Osman**
- GitHub: [@Abdinasir-Osman](https://github.com/Abdinasir-Osman)

## 🙏 Acknowledgments

- React team for the amazing framework
- Flutter team for cross-platform development
- Tailwind CSS for the utility-first approach
- All contributors and supporters

## 📞 Support

For support, email support@smartphone-app.com or create an issue in this repository.

---

**SmartPhone Frontend** - Your complete e-commerce solution for smartphone sales! 📱✨
