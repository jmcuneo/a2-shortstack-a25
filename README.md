## Assignment 2 - Alex Li
## Deployed at: https://a2-alexli.onrender.com/

## Description
This project is a task manager, in which a user can set a task description, Priority of the task (High, Medium, Low), and set a creation date(Defaulted to the day of access). The project also satisfies all baseline and technical achievments. The CSS positioning techniques I used are seperations into divs, elements, and classes. Within each of these, we have individual styling and placement using border radiuses, border placements, and padding. To run this project, access it through this link: https://a2-alexli.onrender.com/. If you want to run locally, do 'git clone https://github.com/alexli888/a2-AlexLi', install node, run 'npm run dev' Or 'node server.js'

## For Baseline Requirements: 
I have a Server that maintains a tabular dataset with 3 or more fields related to the application. I alos have a results functionality which shows the entire dataset residing in the server's memory; accessed through 'View All Tasks' in the header. In the home page, I have a Form/Entry functionality which allows a user to add or delete data items residing in the server's memory. The server, too, upon receiving new or modified "incoming" data, includes and uses a derived function that calculates a 'due date' time, based on the priority of the task specified. 

## Technical Achievements

- **Single-page app with live updates:**  
  I implemented a single-page application using HTML, CSS, and JavaScript. The main page (`index.html`) contains a form for adding new tasks and a section that always displays the most recent tasks. When a user submits the form, the client sends the data to the server using `fetch` (POST to `/api/tasks`). The server calculates the derived `deadline` field based on the task's priority and creation date, then returns the new task. The client then reloads the task list by fetching all tasks from the server (`GET /api/tasks`) and updates the display without requiring a page reload. This ensures the UI always reflects the current server-side data.

- **Add, delete, and modify tasks:**  
  The app allows users to add new tasks via the form, and delete tasks using a "Delete" button next to each task (handled by sending a DELETE request to `/api/tasks/:id`).  
  To enable modification of existing tasks, I added an "Edit" button for each task in the UI. When clicked, this would populate the form with the task's current data, allow the user to make changes, and then send a PUT or PATCH request to the server to update the task. The server would update the task in its in-memory dataset and recalculate the derived `deadline` if necessary. After the update, the client fetches the updated task list and refreshes the display, keeping the UI in sync with the server.

### UX Achievements. (Ask 2 people)
- (5 points per person, with a max of 10 points) 

Study Design: I conducted a study on 2 subjects regarding my user interface in order to evaluate the practicality of the website design. 
I asked the subject to conduct this task: 
- Make a new task with a random priority
- navigate to all the tasks
- delete the new task
- navigate to home

Results::::::::::

Person 1:
Last Name: Li
Problems with design: 
- The 'fillers' in recent tasks is confusing and unnecessary
- The content doesnt seem centered

Comments that suprised me: 
- A comment that suprised me is that the filler tasks is confusing. I thought it was useful to show what it'll look like to a user. 

What will I change: 
- In consideration of the think-aloud process, I changed the code to remove the filler tasks. I found this suggestion useful after some consideration, and hope it can appeal to more users now.

////////////////////////////////////////////

Person 2: Lin
Problems with design:
- The site seems a little unprofessional

Comments that suprised me: 
- The biggest takeaway of the site not looking too professional was suprising to me, as I put a great deal of effort into researching css borders and radiuses, positioning of the classes, etc. This is a big takeaway that web dev takes lots of time and effort, and that this is not good enough for say a final project. 

What I considering to change based on feedback: 
- I will consider, if time prevails, to update the design to have better UX for the heading and the classes. I will try more interviews, like this, to iterativly adjust the design to the appeal of a wider audience.

