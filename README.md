# WeSave 💰

A clean, mobile-friendly React + TailwindCSS web app for the Celo testnet that provides a decentralized savings platform where users can deposit, lock, and visualize savings goals as circular progress rings.

## ✨ Features

### Core Functionality
- **Wallet Integration**: Connect via Celo WalletConnect / Valora using Viem
- **Savings Goals**: Create and manage multiple savings goals with name, target amount, and duration
- **Visual Progress**: Circular progress rings showing completion percentage, amount saved, and time remaining
- **Secure Savings**: Lock funds until 100% completion or maturity date
- **Dashboard**: Overview of wallet balance, goals grid, and total savings
- **NFT Rewards**: Mint NFT badges as rewards for completing goals
- **Community Circles**: Optional group saving circles for collective goals

### User Experience
- **Light/Dark Mode**: Toggle between themes with smooth transitions
- **Confetti Animations**: Celebrate goal completions with animated confetti
- **Toast Notifications**: Real-time feedback for all transactions
- **Responsive Design**: Optimized for mobile and desktop
- **Smooth Animations**: Subtle transitions and hover effects

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + Vite
- **Styling**: TailwindCSS with custom design system
- **Blockchain**: Viem for Celo testnet integration
- **Routing**: React Router DOM
- **State Management**: React Context + Custom Hooks
- **Notifications**: React Hot Toast
- **Animations**: Canvas Confetti + CSS Transitions
- **Icons**: Lucide React

### Project Structure
```
src/
├── components/          # Reusable UI components
│   └── Layout.jsx      # Main app layout with navigation
├── contexts/           # React Context providers
│   ├── ThemeContext.jsx    # Theme management
│   └── WalletContext.jsx   # Wallet connection state
├── hooks/              # Custom React hooks
│   └── useContract.js      # Contract interaction hooks
├── pages/              # Page components
│   ├── LandingPage.jsx    # Landing page with CTA
│   ├── Dashboard.jsx      # Goals overview and stats
│   ├── GoalDetail.jsx     # Individual goal management
│   ├── Rewards.jsx        # NFT badges and achievements
│   ├── Profile.jsx       # User settings and stats
│   └── Community.jsx     # Savings circles
├── services/           # External service integrations
│   └── contractService.js # Smart contract interactions
├── App.jsx            # Main app component with routing
├── App.css            # Custom styles and animations
├── index.css          # TailwindCSS imports and base styles
└── main.jsx           # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or Celo-compatible wallet
- Celo testnet tokens (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wesave
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 🔗 Smart Contract Integration

The app integrates with Celo testnet smart contracts for:
- `createGoal()` - Create new savings goals
- `depositToGoal()` - Add funds to existing goals
- `withdrawFromGoal()` - Withdraw completed goal funds
- `fetchGoals()` - Retrieve user's goals
- `claimReward()` - Mint NFT rewards

### Contract Service
The `contractService.js` provides:
- Transaction handling with error management
- Gas estimation
- Data transformation utilities
- Validation helpers

## 🎨 Design System

### Color Palette
- **Primary**: Emerald gradients (#10b981 → #14b8a6)
- **Secondary**: Teal gradients (#14b8a6 → #0d9488)
- **Accent**: Neutral grays for text and backgrounds
- **Status Colors**: Green (success), Blue (info), Yellow (warning), Red (error)

### Typography
- **Primary Font**: Poppins (headings and UI)
- **Secondary Font**: Inter (body text)
- **Responsive Sizing**: Scales appropriately across devices

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, smooth transitions
- **Progress Rings**: Animated circular progress indicators
- **Modals**: Backdrop blur, smooth animations

## 📱 Pages Overview

### Landing Page
- Hero section with animated goal previews
- Feature highlights with icons
- Statistics showcase
- Call-to-action for wallet connection

### Dashboard
- Wallet balance and stats cards
- Goals grid with progress rings
- Search and filter functionality
- Quick action buttons

### Goal Detail
- Large animated progress ring
- Transaction history
- Deposit/withdraw functionality
- Milestone tracking

### Rewards
- NFT badge collection
- Achievement categories
- Share and download options
- Rarity indicators

### Profile
- User statistics and achievements
- Theme and notification preferences
- Account management
- Achievement progress

### Community
- Savings circles overview
- Join/create circle functionality
- Member management
- Progress tracking

## 🔧 Configuration

### Environment Variables
Create a `.env` file for configuration:
```env
VITE_CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
VITE_CONTRACT_ADDRESS=0x...
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

### TailwindCSS Configuration
Custom configuration in `tailwind.config.js`:
- Extended color palette
- Custom animations
- Dark mode support
- Responsive breakpoints

## 🧪 Testing

The app includes mock data for development and testing:
- Sample savings goals
- Mock transaction history
- Test user profiles
- Demo NFT rewards

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Celo Foundation for blockchain infrastructure
- Viem team for Ethereum library
- TailwindCSS for styling framework
- React team for the framework
- All open-source contributors

---

**Built with ❤️ for the Celo ecosystem**