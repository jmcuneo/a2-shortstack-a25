Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js  
===

## To Do List
This project implements a two-tier web application using HTML, CSS, JavaScript, and Node.js. The app demonstrates a complete client–server interaction where the server maintains a dataset in memory, and the client can add, delete, and view data through a simple interface. The application uses CSS Flexbox for layout, external CSS stylesheets, and various selectors (element, ID, class). CSS includes hover effects, color scheme, Roboto font, and other sizing properties. All pages validate with the W3C validator.
- How to Use: Users can enter the name of a to do thing, select a creation date, and select a deadline date. Then when submitting, the fields will but sent to server and server will update (in real time) the table below the form with those fields and another dervied field(priority, more indepth calculation below). Each row in the table has its own delete and edit buttons that will either delete the row from the server or edit any entries (to do thing, creation date, or deadline date). When editing new save or cancel buttons will appear allowing to either save changes or cancel the edit.


## Features / Baseline Requirements (all completed ✅)(4 pts each, total 20 pts):
- **Server**: Serves static files and maintains a tabular dataset in memory with 3 fields (To Do Item, Creation Date, Deadline Date).
- **Results**: Client can view the full dataset stored on the server(All on one page).
- **Form/Entry**: Users can add new items or delete existing ones via HTML forms(There is a form to add new to do items. To edit or delete existing to do items, the form has a button on every row to allow that).
- **Server Logic**: When new data is received, the server computes and appends a derived field before storing it
- **Derived Field**: Priority calculated dynamically based on the creation date and deadline date (existing fields in each dataset row).
    - ***Overdue***: Deadline Date has already passed compared to creation date.
    - ***Urgent***: Deadline Date is same day as creation date.
    - ***High***: Deadline Date is 1-2 days away from creation date.
    - ***Medium***: Deadline Date is 3-5 days away from creation date.
    - ***Low***: Deadline Date is more than 6 days ways from creation date.
 
## HTML Requirements (all completed ✅)(4 pts each, total 16 pts):
- Implemented HTML Form for input.
- A results view displaying data in a <table> under the form.
- All HTML validates successfully (https://a2-shawnpatel.onrender.com/ works on https://validator.w3.org/).
- All pages(only have one page) accessible from the homepage (index.html).


## CSS Requirements (all completed ✅)(4 pts each, total 16 pts):
- Styled all primary visual elements.
- Demonstrated element selectors, ID selectors, and class selectors (used #(ID) and .(Class) and element selector(for p tag) throughout CSS).
- Used Flexbox for page layout and defined custom Google font (Roboto) for all text.
- Styles are maintained in external CSS files for readability and maintainability(main.css).


## JavaScript Requirements (all completed ✅)(4 pts):
- Front-end JavaScript included to fetch and display data from the server and DOM manipulation to update the dataset(table) display dynamically after adding, editing, or deleting items.

## Node.js Requirements (all completed ✅)(4 pts):
- Implemented a Node.js HTTP server to serve static files and manage dataset operations and the server computes the derived field(priority field) before storing new data entries.


## Technical Achievements (all completed ✅)(10 pts):
- **Single Page Application Implementation**: Instead of splitting the app into multiple pages, I designed it as a single-page application. The user interacts with a single HTML page that contains both the form for data entry and the results display table. When the form is submitted, the client sends a POST request to the Node.js server. The server updates its in-memory dataset (including the derived field), and then returns the updated dataset. The client uses JavaScript fetch and DOM manipulation to immediately update the results table without requiring a full page reload. This keeps the client and server in sync in real time.
- **Client-Server Sync with API**: I used the Fetch API with async/await to handle communication between the client and the server. For example, my loadTable() function sends a GET request to retrieve the current dataset and dynamically rebuilds the results table in the DOM. This ensures that the user always sees the latest state of the dataset stored on the server, even after adding, deleting, or modifying items.
- **Data Modification**: Beyond the baseline requirements of adding and deleting data, I also implemented the ability to modify existing rows. This is achieved with a PUT request to the server, which locates the item in memory, updates the requested fields, recomputes the derived field, and then sends back the updated dataset. This extends the baseline functionality and makes the application more practical and flexible.
- **Node.js Server Design**: The Node.js server is structured so that each operation (GET, POST, DELETE, PUT) has its own route and logic. File serving and dataset operations are kept cleanly separated, making the code easier to maintain and extend. Derived field computation is encapsulated in a helper function to keep logic consistent.


### Design/UX Achievements (all completed ✅)(5 pts * 2 people = 10 pts): 
- **User Study 1**
  - Student: Timothy Hutzley
  - Task: Add a new item using the form, then confirm that the new item appears in the results table correctly. Edit or delete any entires you would like.
  - Problems: The user stated that he did not face any problems while performing the task given.
  - Surprising Comments: The user said the real-time update of the table after submitting data was good and that the design of the page was very intuitive.
  - Planned Changes: No planned changes from this study.
 
- **User Study 2**
    - Student: Peter Czepiel
    - Task: Add a new item using the form, then confirm that the new item appears in the results table correctly. Edit or delete any entires you would like.
    - Problems: Render deployment loaded for a bit but the webpage appeared. There was no other problems while attempting to accomplish the task.
    - Surprising Comments: They said they really liked that the priority automatically changed when deadline was edited.
    - Planned Changes: Made the edit/delete buttons have brighter colors so not hard to miss.
 
## Miscellaneous Requirements (all completed ✅)(Total-25 pts):
- Forked the starting project code repo.(5 pts)
- Deployed my project to Render, and filled in the appropriate fields in your package.json file. https://a2-shawnpatel.onrender.com/ (5 pts)
- Project starts with the proper naming scheme a2-FirstnameLastname(a2-ShawnPatel) so you can find it. (5 pts)
- Modified the README to the specifications and deleted all of the original instructions. (5 pts)
- Created and submitted a Pull Request to the original repo and included my name in the pull request. (5 pts)

