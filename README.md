## Assignment 2: To-Do List (Conor McCoy)
A to-do list made using flex positioning in CSS. Can add and delete tasks, and a suggested deadline is created based on the priority of the task, which you can update. Add, view, & updates tasks all in one page with live updating.
https://a2-conormccoy.onrender.com/

## Technical Achievements
- **Single-Page App**: Using a combination of JavaScript and HTML, the tasks stored in the server are all displayed on the same page where you can add them. The list is updated whenever (1) a new task is added, or (2) a task is completed (deleted)
- **Priority Changing**: Users are able to change the priority of a task through a dropdown menu inside the display table. By clicking on a different priority than the current one, it will be updated in the table & server data. This was done by addling an update handler in my nodeJS server, similar to how delete is handled. It also needs to calculate a new suggested deadline, so the nodeJS server handles the logic for that as well. The dropdown itself is added in main.js.

### Design/Evaluation Achievements
- **Priority styling**: The urgent priority has its own unique styling. By changing the way priority is rendered in my main.js table I was able to make "Urgent" priorities be red & bolded, as defined in my CSS sheet. One challenge with this was that when Urgent was the current value for priority, the dropdown menu to update priority would display all options in red & bold font, so I added a new element+ID selector to make options inside the dropdown menu not have that styling.
- **Add Task button**: The "Add Task" button has its own styling through an ID selector in my CSS sheet. It has a default color & a hover color, to feel more reactive. Additionally, when hovered, your cursor will turn into a pointer.
- **Table styling**: To display the tasks stored in the server, I wanted to make a table & style it with CSS. Using the collapse tag, padding, and coloring, I made a table which looks nice & displays the tasks in the server.
- **Flex positioning**: In my CSS sheet, I define that body display as a flex container. This is so I could use alignments & justifications to position my page in a way which is more visually appealing.
