# HourTrack

> Your Work, Your Time, Your Earnings — Simplified

HourTrack is a cross-platform mobile app built with React Native and Expo that helps retail workers track their scheduled and actual hours, overtime, lost time, and expected earnings. It gives workers a transparent and accurate record they can use to verify their pay against what their employer captures at the end of each month.

---

## The Problem

Retail workers on weekly schedules often have no way to track their booked hours vs hours actually captured by management. Overtime gets booked verbally but is not always captured in the employer's system. Manual calculations are error-prone. Workers end up underpaid with no evidence to dispute it. Weekly schedules are received as photos and become hard to find later when verifying hours.

---

## The Solution

HourTrack lets workers:
- Save their weekly schedule images in one place
- Log their actual hours worked per shift including overtime and lost time
- See a real-time breakdown of expected earnings at the correct rate
- Compare scheduled hours against logged hours at the end of the month
- Generate a shareable report to dispute discrepancies with their employer

---

## Features

### Schedule Management
- Upload and save weekly schedule images received from the manager
- View saved schedule images organised by week
- Add manual shift entries alongside or in place of the image
- Edit and delete shift entries

### Hour Logging
- Log actual hours worked per shift
- Track overtime before and after a regular shift independently
- Flag shifts as Regular, Public Holiday, or Nightshift
- Log arrival time and lunch times to calculate lost time within a shift
- See a full shift earnings breakdown before saving

### Calculations
- Regular hours at the user's hourly rate
- Overtime at the user's set overtime multiplier
- Public holiday hours at the user's set holiday multiplier
- Nightshift: 1 hour overtime per shift + remaining hours at regular rate + 10% nightshift allowance
- Lost time calculated automatically from arrival and lunch times

### Summary and Reports
- Monthly and weekly summary views
- Scheduled hours vs logged hours with discrepancy highlight
- Full breakdown of regular, overtime, holiday, nightshift hours and earnings
- Generate a shareable report or invoice for the period

### User Settings
- Set hourly rate
- Set overtime rate multiplier
- Set contracted weekly hours
- Enable and set holiday pay rate
- Enable nightshift tracking

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile framework |
| Expo | Development platform and tooling |
| NativeWind | Tailwind CSS styling for React Native |
| Expo SQLite | Local on-device database |
| Expo Image Picker | Schedule image uploads from gallery |
| Zustand | Global state management |

---

## Architecture

### Database
HourTrack uses Expo SQLite for fully offline, on-device data storage. No account or internet connection is required. All data lives on the user's device.

**Tables:**
- `settings` — user's pay rates and configuration
- `weeks` — saved weekly schedules and images
- `scheduled_shifts` — manual shift entries per week
- `logged_shifts` — actual hours logged per shift
- `months` — pre-aggregated monthly summaries for fast loading

### State Management
Zustand is used for global state with three slices:
- `settingsSlice` — user settings synced with SQLite
- `shiftsSlice` — logged and scheduled shifts
- `summarySlice` — monthly summary data

### Component Structure
```
/src
  /components
    /shared        # Reusable components used across screens
    /home          # Home screen components
    /schedule      # Schedule screen components
    /logHours      # Log Hours screen components
    /summary       # Summary screen components
    /settings      # Settings screen components
  /screens         # Full screen components
  /store           # Zustand store slices
  /database        # SQLite initialisation and helper functions
  /utils           # Calculation helpers and utility functions
```

---

## Getting Started

### Prerequisites
- Node.js installed
- Expo CLI installed globally
- Expo Go app on your Android or iOS device for testing

### Installation

```bash
# Clone the repository
git clone https://github.com/Willie3011/hourtrack.git

# Navigate into the project directory
cd hourtrack

# Install dependencies
npm install

# Start the development server
npx expo start
```

Scan the QR code with Expo Go on your phone to run the app.

---

## Out of Scope for MVP

The following features are planned for future versions:

- Data export and backup functionality
- Currency selection — currently fixed to South African Rand (R)
- Customizable nightshift rules for different employer policies
- Multi-user support on a single device
- Push notifications for shift reminders
- Direct integration with employer payroll systems
- Deductions calculator

---


## License

This project is private and not licensed for public use or distribution.
