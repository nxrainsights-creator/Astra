# NXRA Portal - Astra

A comprehensive management system for Client/CRM, R&D, and Marketing modules built with React and Firebase.

## 🚀 Features

### 👥 Client & CRM Module
- Complete CRUD operations for client management
- Store client details: Name, Email, Company, Phone, Project, Status
- Search and filter clients across all fields
- Integration ready for Finance system (invoice generation)
- Professional dashboard with status tracking

### 🔬 R&D Tracker Module
- Weekly progress update submission form
- File uploads (images, PDFs, documents) to Firebase Storage
- Timeline view of all updates
- Progress tracking with visual indicators
- Team member attribution

### 📱 Social Media & Marketing Module
- **Campaign Tracker**: Manage marketing campaigns with status tracking
- **Festival Calendar**: Pre-loaded events and festivals from Firebase
- **Performance Dashboard**: Analytics and metrics visualization
- Campaign status management (Planning, Active, Paused, Completed)
- Multi-platform support (Facebook, Instagram, Twitter, LinkedIn, Google Ads)

## 🛠️ Tech Stack

- **Frontend**: React 19 with Vite
- **Backend**: Firebase (Firestore, Storage, Analytics)
- **Routing**: React Router v7
- **Styling**: Custom CSS with responsive design

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/nxrainsights-creator/Astra.git
cd Astra
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 🔥 Firebase Configuration

The project is already configured with Firebase credentials from `info.txt`:
- Project ID: nxra-portal
- Firebase Hosting: nxra-portal
- All Firebase services (Firestore, Storage, Analytics) are initialized

## 📁 Project Structure

```
Astra/
├── src/
│   ├── components/
│   │   ├── ClientCRM/
│   │   │   ├── ClientCRM.jsx
│   │   │   └── ClientCRM.css
│   │   ├── RnDTracker/
│   │   │   ├── RnDTracker.jsx
│   │   │   └── RnDTracker.css
│   │   └── Marketing/
│   │       ├── Marketing.jsx
│   │       └── Marketing.css
│   ├── firebase/
│   │   ├── config.js
│   │   ├── services.js
│   │   └── storage.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🎯 Usage

### Client & CRM
1. Navigate to "Client & CRM" from the sidebar
2. Click "+ Add New Client" to create a client record
3. Use the search bar to filter clients
4. Edit or delete clients using action buttons
5. Generate invoices (integrated with Finance system)

### R&D Tracker
1. Navigate to "R&D Tracker" from the sidebar
2. Click "+ Add Weekly Update" to submit progress
3. Fill in the form with title, description, and progress percentage
4. Upload supporting files (images, PDFs, documents)
5. View all updates in timeline format

### Marketing
1. Navigate to "Marketing" from the sidebar
2. **Campaign Tracker**: Create and manage marketing campaigns
3. **Festival Calendar**: View and add festivals for marketing planning
4. **Performance Report**: View analytics and campaign metrics

## 📊 Firebase Collections

### Firestore Collections:
- `clients` - Client and CRM data
- `rnd_updates` - Research & Development updates
- `campaigns` - Marketing campaigns
- `festival_calendar` - Festival events

### Storage Structure:
- `rnd_updates/` - R&D files and attachments

## 🚀 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to Firebase Hosting.

## 📝 Development Notes

**Lead Developer**: Sanjai

**Modules Responsibility**:
- Client & CRM: Complete CRUD with Finance integration
- R&D Tracker: Weekly updates with file management
- Marketing: Campaign tracking, festival calendar, and performance reporting

## 🔐 Security Notes

- Firebase credentials are included for the NXRA Portal project
- Ensure proper Firebase security rules are set up in production
- Implement authentication before deploying to production

## 📄 License

ISC

## 👨‍💻 Author

Sanjai - Lead for Client, R&D, and Marketing Modules

---

Built with ❤️ using React and Firebase
