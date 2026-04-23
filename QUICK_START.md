# TaxMate Quick Start Guide

Get TaxMate running in 5 minutes! 🚀

---

## ⚡ Quick Start (Development Mode)

### Step 1: Install Dependencies (2 minutes)

```bash
cd taxmate-backend

# Install backend dependencies
npm install

# Install frontend dependencies
npm --prefix frontend install
```

### Step 2: Configure Environment (1 minute)

Create `.env` file in `taxmate-backend/`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taxmate
JWT_SECRET=your_secret_key_change_in_production
CORS_ORIGINS=http://localhost:3000
```

**Using MongoDB Atlas?** Replace `MONGODB_URI` with:
```
mongodb+srv://username:password@cluster.mongodb.net/taxmate
```

### Step 3: Start Backend & Frontend (2 minutes)

**Terminal 1 - Backend:**
```bash
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

### Step 4: Access the App

Open browser to: **http://localhost:3000**

---

## 🎯 Key Features to Test

### 1. Tax Calculator
- Go to Calculator page
- Enter salary: `1000000`
- Enter HRA: `200000`
- Enter Section 80C: `150000`
- See real-time tax calculation and recommendations ✨

### 2. Client Management
- Click "Add New Client"
- Enter client details
- View client list
- Edit/delete clients

### 3. Reports
- Go to Reports section
- Generate PDF with CA branding
- Download report
- Share via WhatsApp

---

## 📦 Project Structure

```
taxmate-backend/
├── src/
│   ├── controllers/         # Business logic
│   │   ├── taxController.js        # Tax calculation engine
│   │   ├── clientController.js     # Client management
│   │   └── authController.js       # Authentication
│   ├── models/              # Database schemas
│   │   ├── taxCalculation.js
│   │   ├── client.js
│   │   └── user.js
│   ├── routes/              # API endpoints
│   │   ├── taxRoutes.js
│   │   ├── clientRoutes.js
│   │   └── authRoutes.js
│   ├── middleware/          # Auth, validation
│   ├── utils/               # Helpers
│   │   ├── pdfGenerator.js  # PDF creation
│   │   └── logger.js
│   ├── app.js               # Express app
│   └── server.js            # Server entry
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── TaxCalculator.jsx
│   │   │   ├── ClientDashboard.js
│   │   │   ├── Reports.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── styles/          # CSS files
│   │   ├── utils/           # API helper
│   │   └── App.js
│   └── package.json
└── package.json
```

---

## 🔑 Default Test Credentials

Create a test account:
1. Go to Register page
2. Create account with any email
3. Login to access features

---

## 🐛 Common Issues

### MongoDB won't connect?
```bash
# Check if MongoDB is running
# macOS
brew services list

# Start MongoDB
brew services start mongodb-community
```

### Port 3000 or 5000 already in use?
```bash
# Kill process on port
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies installation fails?
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

---

## 🚀 Next Steps

1. **Customize**: Edit colors in `TaxCalculator.css`
2. **Add features**: Create new components in `frontend/src/components/`
3. **Deploy**: Follow deployment guide in `TAXMATE_SETUP_GUIDE.md`
4. **Database**: Set up MongoDB Atlas for production

---

## 📚 API Endpoints

### Tax Calculation
- `POST /api/tax/calculate` - Calculate tax
- `GET /api/tax/history` - Get calculations (authenticated)
- `GET /api/tax/:id` - Get specific calculation
- `DELETE /api/tax/:id` - Delete calculation

### Client Management
- `POST /api/clients` - Create client
- `GET /api/clients` - List clients
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user (authenticated)

---

## 🎓 Developer Tips

### Real-time Calculations
Tax calculator debounces input and recalculates automatically every 500ms

### Tax Engine Features
- ✅ Old & New Regime comparison
- ✅ 4% Cess calculation
- ✅ Surcharge for high income
- ✅ Automatic regime recommendation
- ✅ Tax-saving suggestions

### PDF Generation
- ✅ Professional HTML-to-PDF conversion
- ✅ CA branding support
- ✅ Beautiful report layout
- ✅ Server-side generation (Puppeteer)

### Frontend Tech
- React 18 with Hooks
- Axios for API calls
- CSS3 with animations
- Mobile-responsive design

---

## 📞 Support

- **Issues**: Check `TAXMATE_SETUP_GUIDE.md` for troubleshooting
- **API Docs**: Visit `http://localhost:5000/api-docs` (Swagger)
- **Questions**: Review code comments for explanations

---

## 🎉 You're All Set!

Happy coding! 🚀 The app is production-ready with:
- ✅ Real tax calculations for FY 2024-25
- ✅ Professional PDF reports
- ✅ Client management dashboard
- ✅ Secure authentication
- ✅ Mobile-responsive UI
- ✅ Docker deployment ready

---

**Version**: 2.0.0  
**Last Updated**: April 2026
