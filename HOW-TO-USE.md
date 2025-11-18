# How to Setup and Run the Store Rating System

## 🗄️ Database Setup

### Option 1: Using Neon.tech (Recommended)

1. Go to [Neon.tech](https://neon.tech/) and create a free account
2. Create a new project
3. Copy the PostgreSQL connection string

### Option 2: Using Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
   ```bash
   createdb store_rating_system
   ```

## 🔧 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database Connection
DATABASE_URL="your_postgresql_connection_string_here"

# JWT Secret
JWT_SECRET="your_super_secret_jwt_key_here"

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Step 4: Setup Prisma and Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with sample data
npx prisma db seed
```

### Step 5: Start the Backend Server

```bash
npm run dev
```

The backend server should now be running on `http://localhost:5000`

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **new terminal window**:

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 4: Start the Frontend Development Server

```bash
npm run dev
```

The frontend should now be running on `http://localhost:3000`

## 🎉 Access the Application

Open your browser and navigate to `http://localhost:3000`

### Default Credentials (if you ran the seed)

**Admin User:**

```
Email: admin@example.com
Password: password123
```

**Store Owner:**

```
Email: owner1@example.com
Password: password123
```

**Regular User:**

```
Email: user1@example.com
Password: password123
```

---

Happy coding! 🚀
