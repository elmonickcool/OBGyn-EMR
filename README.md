# 🏥 OB-GYNE Electronic Medical Record (EMR) System

## Overview

The **OB-GYNE Electronic Medical Record (EMR) System** is a web-based application designed to help obstetricians and gynecologists efficiently manage patient records, consultations, medical histories, and follow-up visits. The system replaces paper-based documentation with a secure digital platform, improving patient care, organization, and workflow.

This project was developed for **Doc Rikka Women's Medical & Ultrasound Clinic** and focuses on providing a centralized repository for patient medical information.

---

## Features

### 👩 Patient Management

* Register new patients
* Edit patient information
* Search patients
* View complete patient profile

### 🩺 Consultation Management

* Record consultation notes
* Diagnosis
* Treatment plan
* Prescriptions
* Vital signs
* Chief complaint
* History of present illness (HPI)
* Follow-up consultations

### 📋 Medical History

* Past medical conditions
* Previous surgeries
* Hospitalizations
* Allergies
* Current medications
* Immunization records

### 👨‍👩‍👧 Family History

* Diabetes
* Hypertension
* Cancer
* Heart disease
* Other hereditary illnesses

### 🚬 Social History

* Smoking status
* Alcohol consumption
* Drug use
* Occupation
* Lifestyle information

### 🌸 Gynecologic History

* Last Menstrual Period (LMP)
* Menstrual cycle
* Gravida
* Para
* Abortions
* Menopause status
* Contraceptive history
* Sexual history

### 🤰 Obstetric History

* Previous pregnancies
* Delivery history
* Pregnancy complications
* Pregnancy outcomes

### 🧾 Review of Systems

* General symptoms
* Cardiovascular
* Respiratory
* Gastrointestinal
* Neurologic
* Genitourinary
* Musculoskeletal
* Endocrine
* Skin
* Psychiatric

### 📈 Dashboard

* Total patients
* Recent consultations
* Follow-up schedule
* Quick statistics

### 🔒 Authentication

* Secure login
* User authorization
* Protected routes

---

# Technology Stack

## Frontend

* React.js
* Material UI (MUI)
* React Router
* Axios
* Day.js

## Backend

* Node.js
* Express.js

## Database

* MySQL

## Other Tools

* Git
* GitHub
* Visual Studio Code

---

# System Architecture

```
React Frontend
       │
       ▼
 REST API (Express.js)
       │
       ▼
     MySQL Database
```

---

# Database Modules

The system consists of the following major tables:

* Patients
* Consultations
* Medical History
* Allergies
* Surgeries
* Hospitalizations
* Family History
* Social History
* Gynecologic History
* Obstetric History
* Review of Systems
* Follow-up Consultations
* Users

---

# Installation

## Clone the repository

```bash
git clone https://github.com/yourusername/obgyne-emr.git
```

```bash
cd obgyne-emr
```

---

## Install Frontend

```bash
cd client
npm install
npm run dev
```

---

## Install Backend

```bash
cd server
npm install
npm run dev
```

---

## Configure Environment Variables

Create a `.env` file inside the server directory.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medical_records
DB_PORT=3306
PORT=5000
```

---

## Import Database

Import the provided SQL file into MySQL.

```
medical_records.sql
```

---

# Folder Structure

```
OB-GYNE-EMR
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── layouts
│   │   ├── services
│   │   └── theme
│   └── public
│
├── server
│   ├── routes
│   ├── controllers
│   ├── middleware
│   ├── config
│   ├── database
│   └── server.js
│
└── README.md
```

---

# Screenshots

You may include screenshots of the following pages:

* Login
* Dashboard
* Patient List
* Add Patient
* Patient Profile
* Consultation Form
* Medical History
* Gynecologic History
* Follow-up Consultation

---

# Future Improvements

* Laboratory request module
* Ultrasound records
* Electronic prescriptions
* Appointment scheduling
* SMS/Email reminders
* Inventory management
* Billing and payments
* Reports and analytics
* Multi-user roles (Doctor, Nurse, Receptionist)
* Audit logs
* Cloud backup
* PDF export
* Mobile-responsive interface

---

# Security Features

* Password hashing
* Authentication
* Authorization
* Input validation
* SQL injection prevention
* Cross-Origin Resource Sharing (CORS)
* Environment variables for sensitive configuration

---

# License

This project is intended for educational and clinical use. Please comply with local healthcare regulations and patient privacy laws before deploying it in a production environment.

---

# Author

**Elmo Nickol Laplap**

Bachelor of Science in Information Systems

Full-Stack Web Developer

GitHub: https://github.com/elmonickcool

Portfolio: https://elmonickol.vercel.app

---

# Acknowledgements

Special thanks to **Doc Rikka Women's Medical & Ultrasound Clinic** for providing the opportunity to develop this Electronic Medical Record System and for supporting the project's real-world clinical requirements.
