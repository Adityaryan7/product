# 🛍️ ShopHub - Professional E-Commerce Platform

A modern, fully-featured e-commerce website built with React, Redux Toolkit, and Material-UI.

## ✨ Features

### Core E-Commerce Features
- 🛒 **Shopping Cart** - Add/remove items, manage quantities
- ❤️ **Favorites/Wishlist** - Save products for later
- 🔍 **Product Search & Filtering** - Find products easily
- 📦 **Product Details** - Comprehensive product information
- 💳 **Multi-Step Checkout** - Professional payment flow
- 🔐 **Authentication** - Secure login and registration

### User Experience
- 🔔 **Smart Notifications** - Toast notifications for all actions
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Professional UI** - Material-UI components
- ⚡ **Fast Performance** - Optimized and cached
- 🔄 **Persistent State** - Saves cart and favorites locally

### Technical Highlights
- Redux Toolkit with Redux Persist
- Global Snackbar notification system
- API service layer for clean code
- Comprehensive error handling
- Mobile-first responsive design
- Material-UI theming
- Redux store with middleware

## 📋 Prerequisites

- Node.js >= 16
- npm or yarn
- Modern web browser

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### 3. Test Credentials
- **Username**: `mor_2314`
- **Password**: `83r5^_`

## 📚 Available Scripts

### Development
```bash
npm start              # Start development server
npm test              # Run test suite
npm run test:coverage # Generate coverage report
```

### Production
```bash
npm run build         # Create optimized production build
npm run deploy        # Deploy to Vercel (configured)
```

## 🎯 Project Structure

```
src/
├── components/           # React components
│   ├── cart.js
│   ├── checkout.js      # Multi-step checkout
│   ├── favorites.js
│   ├── login.js
│   ├── productCard.js
│   ├── productDetail.js
│   ├── productList.js
│   ├── register.js
│   └── forgotPassword.js
├── context/
│   └── SnackbarContext.js  # Global notifications
├── services/
│   └── api.js          # API service layer
├── reducers/           # Redux slices
│   ├── cartReducer.js
│   ├── favoritesReducer.js
│   ├── filtersReducer.js
│   └── productsReducer.js
├── store/
│   └── store.js        # Redux store config
├── App.js              # Main component
└── index.js            # Entry point
```

## 🔧 Technologies Used

- **Frontend**: React 18, React Router 6
- **State Management**: Redux Toolkit, Redux Persist
- **UI Framework**: Material-UI v7
- **API**: FakeStore API
- **Testing**: Jest, React Testing Library
- **Build**: React Scripts, Webpack
- **Styling**: Emotion, CSS-in-JS

## 🎨 Key Components

### SnackbarContext (NEW)
Global notification system for app-wide feedback
```javascript
import { useSnackbar } from "../context/SnackbarContext";

function MyComponent() {
  const { showSuccess, showError } = useSnackbar();
  
  const handleClick = () => {
    try {
      // Do something
      showSuccess("Action completed!");
    } catch (error) {
      showError("Action failed!");
    }
  };
}
```

### Checkout Component (NEW)
Professional multi-step checkout process
- Shipping information collection
- Payment details validation
- Order confirmation with tracking ID

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- **Mobile**: 320px - 599px
- **Tablet**: 600px - 959px
- **Desktop**: 960px+
- **Large**: 1280px+

## 🔐 Security Features

- Local storage with Redux Persist
- Token-based authentication
- Input validation on all forms
- Error boundary handling
- Secure payment information validation

## 📊 Performance Optimizations

- Code splitting with React Router
- Lazy loading components
- Memoization for expensive calculations
- Optimized re-renders
- Caching strategy with Redux Persist

## 🧪 Testing

### Run Tests
```bash
npm test                    # Interactive watch mode
npm run test:coverage       # Generate coverage report
npm run test:ci             # CI mode with coverage
```

### Coverage Reports
View detailed test coverage:
```bash
open coverage/lcov-report/index.html
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
npm install -g vercel
vercel
```

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy!

### GitHub Pages
```bash
npm install gh-pages
npm run build
npm run deploy
```

## 📖 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Detailed installation and configuration
- [Improvements](./IMPROVEMENTS.md) - Complete list of enhancements
- [FakeStore API](https://fakestoreapi.com) - API documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 Recent Improvements

✅ Added global snackbar notification system
✅ Created professional multi-step checkout
✅ Enhanced error handling across components
✅ Improved branding and SEO
✅ Added API service layer
✅ Extended theme configuration
✅ Better user feedback mechanisms
✅ Mobile optimization

## 🐛 Troubleshooting

### Port 3000 in use
```bash
PORT=3001 npm start
```

### Clear cache
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
npm run build -- --verbose
```

## 📄 License

This project is open source and available under the MIT License.

## 🙋 Support

For issues and questions:
1. Check existing issues on GitHub
2. Create a detailed bug report
3. Include error messages and screenshots

## 🎉 Future Enhancements

- [ ] Order history and tracking
- [ ] User profile management
- [ ] Real payment gateway integration
- [ ] Product recommendations
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Progressive Web App (PWA)

---

**Built with ❤️ using React and Redux**

Last Updated: February 17, 2026
Status: ✅ Production Ready

# product


# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
