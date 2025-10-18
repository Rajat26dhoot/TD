````markdown
 React Native Internship App

A React Native mobile application built with Expo and Supabase, featuring authentication, posts, and todos with Row Level Security (RLS).

---

## 📸 Features

- ✅ Email/Password Authentication with Supabase  
- ✅ Email Verification Flow  
- ✅ Two Tabs: **Posts** and **To Do**  
- ✅ Infinite Scroll Pagination  
- ✅ CRUD Operations (Create, Read, Update, Delete)  
- ✅ Row Level Security (RLS)  
- ✅ Real-time Row Counts  
- ✅ Pull-to-Refresh Functionality  
- ✅ User-specific Data Filtering  

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)  
- npm or yarn  
- Expo CLI  
- Supabase account with configured project  

### Installation

1. **Create the project or clone repo:**
```bash
npx create-expo-app rn-internship-app
cd rn-internship-app
````

2. **Install dependencies:**

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context react-native-url-polyfill
npx expo install expo-constants
```

3. **Create `.env` file in root:**

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

4. **Update `app.json` (add extra config if needed):**

```json
{
  "expo": {
    "extra": {
      "EXPO_PUBLIC_SUPABASE_URL": "https://your-project.supabase.co",
      "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-anon-key-here"
    }
  }
}
```

---

## 🗄️ Supabase Setup

### Database Tables

**1. table_general (Posts)**

* `id` (uuid, primary key)
* `title` (text)
* `body` (text)
* `owner_id` (uuid, foreign key to auth.users)
* `created_at` (timestamp)

**2. table_rls (To Do)**

* `id` (uuid, primary key)
* `title` (text)
* `body` (text)
* `user_id` (uuid, foreign key to auth.users)
* `created_at` (timestamp)

### RLS Policies

**table_general:**

* All authenticated users can **read** all posts
* Users can only **create** posts with their own `owner_id`
* Users can only **update/delete** their own posts

**table_rls:**

* Users can only **read** their own todos
* Users can only **create** todos with their own `user_id`
* Users can only **update/delete** their own todos

> See [supabase.sql](#) for the complete SQL setup script.

---

## 🏃 Running the App

```bash
# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Scan QR code with Expo Go app on physical device
```

---

## 📂 Resources

* **Supabase SQL Script:** [Link to supabase.sql](YOUR_DRIVE_LINK_HERE)
* **Demo Video:** [Drive Link](https://drive.google.com/drive/folders/15Xx96HM4-Zw8oV2HRMPuOD1mwZZquNps)

---

## 💡 Notes

* Ensure **Row Level Security (RLS)** is enabled on Supabase tables.
* Environment variables are critical for Supabase connection—do not commit `.env`.

---

## 📬 Contact

* Built with ❤️ using **React Native**, **Expo**, and **Supabase**.
* For any issues or contributions, feel free to open a PR or issue in this repo.

```

---

If you want, I can also create a **more visually appealing version with badges, tech stack icons, and screenshots** that looks like a professional GitHub project page. This usually makes internships or portfolio projects stand out.  

Do you want me to do that next?
```
