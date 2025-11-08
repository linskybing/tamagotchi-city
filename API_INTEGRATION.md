# Backend API Integration - Tamagotchi City

## 🎉 Integration Completed

The frontend has been successfully integrated with the backend API hosted at:
**<https://back-end-tasw.onrender.com/docs>**

## ✅ What's Been Integrated

### 1. **API Configuration** (`src/lib/api.ts`)

- ✅ Updated `UserCreate` interface to match backend (uses `pet_name` instead of username/email/password)
- ✅ All API endpoints are properly typed with TypeScript interfaces
- ✅ API calls for all features:
  - User creation
  - Pet management (get, update)
  - Exercise logging
  - Daily quests (get, complete)
  - Daily check
  - Travel/Breakthrough system
  - Leaderboard

### 2. **Proxy Configuration** (`vite.config.ts`)

- ✅ Added proxy to `/api` endpoint for development
- ✅ Automatically rewrites `/api` to backend URL
- ✅ Handles CORS issues in development

### 3. **User Authentication Flow**

- ✅ Created Welcome page (`src/pages/Welcome.tsx`) for new user onboarding
- ✅ Protected routes that require userId
- ✅ Automatic redirect to `/welcome` if no user found
- ✅ userId stored in localStorage

### 4. **Main Pages Updated**

#### **Index.tsx (Home Page)**

- ✅ Uses real pet data from API
- ✅ Displays actual stats (strength, stamina, mood, level)
- ✅ Pet name editing integrated with backend
- ✅ Automatic daily check on app load
- ✅ Dynamic pet messages based on real stats

#### **Status.tsx (Status Page)**

- ✅ Shows current pet stats
- ✅ Displays daily quests with completion status
- ✅ Real-time stamina tracking
- ✅ Quest rewards display

#### **Exercise.tsx**

- ✅ Already integrated with `logExercise` API
- ✅ Updates pet stats after exercise
- ✅ Handles breakthrough notifications

#### **Travel.tsx**

- ✅ Already integrated with breakthrough system
- ✅ Fetches random attractions
- ✅ Completes breakthrough quests

## 🔧 How to Use

### Development Mode

```bash
# Start the dev server
npm run dev
# or
bun dev
```

The app will run on `http://localhost:8080` and automatically proxy API requests to the backend.

### First Time Setup

1. Open the app - you'll be redirected to `/welcome`
2. Enter your pet's name
3. Click "開始冒險" (Start Adventure)
4. Your user will be created and you'll be redirected to the home page

### API Flow

1. **User Creation**: `POST /users/` with `{ pet_name: "your pet name" }`
2. **Daily Check**: Automatically runs when app loads (checks if user exercised yesterday)
3. **Exercise Logging**: `POST /users/{user_id}/exercise` with exercise data
4. **Pet Updates**: `PATCH /users/{user_id}/pet` to update pet properties
5. **Quests**: `GET /users/{user_id}/quests` to get daily quests

## 📋 API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/users/` | POST | Create new user with pet |
| `/users/{user_id}` | GET | Get user info |
| `/users/{user_id}/pet` | GET | Get pet status |
| `/users/{user_id}/pet` | PATCH | Update pet attributes |
| `/users/{user_id}/exercise` | POST | Log exercise session |
| `/users/{user_id}/quests` | GET | Get daily quests |
| `/users/{user_id}/quests/{quest_id}/complete` | POST | Complete quest |
| `/users/{user_id}/daily-check` | POST | Perform daily check |
| `/users/{user_id}/travel/start` | POST | Start breakthrough quest |
| `/users/{user_id}/travel/breakthrough` | POST | Complete breakthrough |
| `/travel/attractions` | GET | Get all attractions |
| `/leaderboard/level` | GET | Get level leaderboard |

## 🎮 Features

### ✅ Fully Integrated

- User creation and authentication
- Pet stat tracking (strength, stamina, mood, level)
- Exercise logging with automatic stat updates
- Daily check system (penalties for not exercising)
- Daily quests system
- Breakthrough/Travel system for level-up gates
- Pet name editing
- Real-time pet stage evolution

### 📝 Notes

- **userId** is stored in localStorage for persistence
- **Daily Check** runs automatically when the app loads
- **Breakthrough** is required at levels 5, 10, 15, 20 to continue leveling
- **Exercise** costs stamina (1 point per 10 seconds) and grants strength (1 point per 10 seconds)
- **Stamina** resets daily (900 points max)

## 🚀 Production Build

```bash
npm run build
# or
bun run build
```

The production build will use the backend URL directly without proxy.

## 🐛 Troubleshooting

### API Not Connecting

- Check that the backend is running at <https://back-end-tasw.onrender.com>
- Check browser console for CORS errors
- Verify proxy configuration in `vite.config.ts`

### User Not Loading

- Clear localStorage and create a new user
- Check that userId is valid in localStorage

### Pet Stats Not Updating

- Make sure to call `refreshPet()` after any API action that modifies the pet
- Check network tab for failed API requests

## 📱 Testing the Integration

1. **Create User**: Go to `/welcome` and create a new user
2. **Check Home**: View pet stats on home page
3. **Exercise**: Go to `/exercise` and log an exercise session
4. **Check Stats**: Stats should update automatically after exercise
5. **View Status**: Check `/status` for daily quests
6. **Travel**: At level 5, 10, 15, or 20, complete breakthrough at `/travel`

## 🎨 Future Enhancements

The following features could be added by extending the backend:

- Exercise history endpoint to show past sessions
- Weekly statistics aggregation
- Social features (friends, comparison)
- Achievement system
- Push notifications for daily reminders

---

**Integration completed on**: November 8, 2025
**Backend API**: <https://back-end-tasw.onrender.com/docs>
**Frontend Framework**: React + TypeScript + Vite
