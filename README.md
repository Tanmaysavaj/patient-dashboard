# 🏥 Patient Registration Dashboard

Hey there! 👋 Welcome to the Patient Registration Dashboard. This project was built as part of the IT Summer Student Work Assignment. 

It’s a clean, modern, and fully functional full-stack web application designed to help staff easily manage patient records, track statuses, and view quick summary statistics.

---

## 🛠️ Tech Stack at a Glance

This project is split into two halves: a robust API and a beautiful, reactive frontend.

- **Frontend:** Angular 21 (using Standalone Components & Signals) + PrimeNG (Latest)
- **Backend:** Node.js 24 LTS + Express.js 
- **Language:** TypeScript 5.9 (Strict mode across the board!)
- **Database:** MongoDB via Mongoose

---

## 🚀 How to Get Started (Running from Scratch)

Getting this project up and running on your local machine is super easy. Just follow these steps!

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v24 LTS recommended)
- [Angular CLI](https://angular.dev/tools/cli) installed globally (`npm install -g @angular/cli`)

---

### Step 1: Fire up the Backend ⚙️

The backend serves all the data for our application. Let's get it running.

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install all the required dependencies:
   ```bash
   npm install
   ```
3. **Environment Variables:** You'll need to connect to the database. Create a file named `.env` right inside the `backend` folder and add this exact line to it:
   ```env
   MONGODB_URI=mongodb+srv://tanmaysavaj:<YOUR_PASSWORD>@patient-dashboard.204qvgz.mongodb.net/?appName=patient-dashboard
   ```
   *(Note: Remember to replace `<YOUR_PASSWORD>` with the actual database password. Make sure any special characters in your password are URL-encoded!)*

4. **Seed the Database:** Let's populate the database with some sample patients so you have data to look at!
   ```bash
   npm run seed
   ```

5. **Start the Server:**
   ```bash
   npm run dev
   ```
   You should see a message saying the server is running on port 3000 and MongoDB is connected!

---

### Step 2: Launch the Frontend 🎨

Now let's start the user interface so we can interact with our data. Open a **new** terminal window (leave the backend running!).

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
   *(Note: The frontend is configured to automatically proxy API requests to the backend on port 3000, so you don't have to worry about CORS issues!)*

---

### Step 3: Enjoy! 🎉

Open your favorite web browser and go to:
**👉 http://localhost:4200**

You can now:
- View the dashboard stats and interactive charts.
- Search and filter through the paginated patient table.
- Click **+ Add Patient** to try out the reactive form validations.
- Click the **Eye Icon** on any patient to view their details and update their status.

Enjoy exploring the code and the app! 🚀
