Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Mood Tracker
This is a simple web-based mood tracker that allows users to log their daily mood, energy level, and see a derived "status" based on their input. The app displays all entris in a table with a custom delete confirmation modal.

CSS & Layout:
- Uses a flexbox-centered container to position the content in the middle of the screen.
- A semi-transparent, blurred container overlays a full screen GIF background for visual aesthetics.

How to Use:
- Clone or download the repository.
- Install Node.js if not already installed.
- Navigate to the project folder in your terminal and run node server.js
- Open your browser and go to http://localhost:3000 (this is where it runs)!
- Fill out the form with today's date, mood, and energy level, then click "Add Mood".
- Your entries will appear in the table along with a derived status.
- Use the "Delete" button to remove any entry; a confirmation modal will appear before deletion.

## Technical Achievements
- **Tech Achievement 1**: Built a Node.js application with a simple HTTP server and in-memory data storage.
- **Tech Achievement 2**: Implemented routes for GET, POST, and DELETE operations to manage mood entries.
- **Tech Achievement 3**: Added derived fields score and status on the server to provide automatic interpretations of user data.
- **Tech Achievement 4**: Created a dynamic table in the frontend using JavaScript to display all entries with live updates.
- **Tech Achievement 5**: Implemented a custom delete confirmation modal to prevent accidental entry deletions.
- **Tech Achievement 6**: Used a backdrop-filter for a blurred, semi-transparent container.

### Design/Evaluation Achievements
- **Design Achievement 1**: Designed a visually appealing inferface with a full-screen animated background and a clear, readable form.
- **Design Achievement 2**: Ensured the UI is responsive for various screen sizes.
- **Design Achievement 3**: Added user feedback mechanisms such as the confirmation modal for deletions, table update after form submission.
- **Design Achievement 4**: Tested derived field logic to accurately categorize moods and energy into meaningful statuses.
- **Design Achievement 5**: Prioritized usability by including input validation for mood and energy fields.
