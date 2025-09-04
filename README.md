Shift Tracker
Its on Render here: https://a2-niajunod.onrender.com/

A two-tier web application that allows restaurant servers to log shifts, track hours and tips, and automatically calculate their average earnings per hour.

I built this app because of my summer restaurant experience. Our managers didn’t want to show us the shared Google Sheet where all tips were recorded, even though every server wanted to know the numbers. For example, during checkout, the system would only tell me the total tips I made that night, but by the time we received our checks, the numbers often looked inconsistent or confusing. It was frustrating not having visibility into my data.

This app is a personal solution to that problem — servers can enter their shift info themselves, see totals and averages immediately, and even edit mistakes without relying on managers or payroll.

Features

Add Shifts: Enter restaurant name, hours worked, and tips earned.

Automatic Calculation: Server logic computes a derived field $ / hour (tips ÷ hours).

Results Table: Displays all logged shifts in real-time, with calculated fields.

Edit/Delete: Update or remove entries to keep data clean.

Summary Stats: Totals and averages update dynamically whenever shifts are added, edited, or deleted.

In-Memory Storage: Data is stored in server memory (not persistent) to demonstrate the short-stack model.

Baseline Requirements
Server (Node.js)

Serves static files (index.html, style.css, script.js).

Maintains a dataset of shifts (with fields: restaurant, hours, tips, and derived $ / hour).

Provides API routes for adding, editing, deleting, and fetching shifts.

Results Functionality

A table displays the entire dataset on the client side, always kept in sync with the server.

Form/Entry Functionality

A user-friendly form allows servers to add new shifts (restaurant, hours, tips).

Each row can be edited or deleted directly from the table.

Server Logic + Derived Field

Each time a new shift is added, the server computes a derived field:

$ / hour = tips ÷ hours (rounded to two decimals).

This ensures consistency and accuracy no matter how the data is entered.

Technologies Used
HTML:

Input form for shifts (restaurant, hours, tips).

Table layout for results.

Semantic, validated markup.

CSS:

Custom stylesheet with a flexbox layout for responsiveness and alignment.

Also includes use of CSS Grid in the table area to demonstrate both layout approaches.

Defined fonts using a web-safe stack.

Applied element selectors, ID selectors, and class selectors.

Color scheme based on my design choices:

#E29EFA

#649EE0

#FFFFFF

#8F9EE1

#2D4A1B

JavaScript:

Fetch API calls to interact with the server.

Handles adding, editing, and deleting rows.

Dynamically updates totals and averages without page reloads.

Front-end script ensures the client view is always in sync with the server dataset.

Node.js:

HTTP server for static file serving.

API endpoints for shift data.

Derived fields computed server-side.

Technical Achievements

Single Page Application (+5 points): The app is a true single-page app: the form for submitting shifts and the results table are both on the same page. When data is submitted, the server responds with the updated dataset, and the client updates immediately.

Edit Functionality (+5 points): In addition to adding and deleting shifts, users can edit existing data (e.g., fixing hours worked or correcting a tip amount). The server recalculates $ / hour whenever a row is updated.

Both achievements are fully described here per the updated assignment requirements.

I will gain 5 points here in class, but I plan on giving this to Pridwin, as it will be useful for us there.

Design / UX Notes

I designed this specifically with a restaurant server’s workflow in mind:

The form is stacked top-to-bottom (not left-to-right) so it feels natural to fill out quickly after a shift.

The table clearly shows important stats at a glance: hours, tips, and average per hour.

Totals are displayed at the top for immediate feedback.

The color scheme is inspired by modern POS systems like Toast or Aloha, but softened with purples and blues to make it less stressful to use. But honestly, the Toast UI is kind of hard to see. I have used both Toast and Aloha, and Aloha is only blue, and Toast is basically only black, so they're hard to see sometimes.

I specifically tested the interface myself by logging several shifts and editing values. The system updates instantly, which is important for usability.

Deployment

The app is deployed to Render: https://a2-niajunod.onrender.com/

Repo name follows assignment convention: a2-NiaJunod

Data is stored in server memory only (not persistent).

Instructions

Clone the repo.

Run npm install.

Start the server with:

node server.js


Navigate to:

http://localhost:3000

Future Improvements

Persistent storage (e.g., SQLite or MongoDB) so shifts aren’t lost when the server restarts, but really, it is fine the way it is since most people only want to know the numbers then and there.

User accounts (different servers track their own shifts separately).

Export functionality (download CSV of logged shifts).

Improved mobile optimization for servers checking tips on their phones after they clock out.
