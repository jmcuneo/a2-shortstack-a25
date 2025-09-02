Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js  
===

Due: Monday, September 8, 2025, by 11:59 PM.

This assignment aims to introduce you to creating a prototype two-tiered web application. 
Your application will include the use of HTML, CSS, JavaScript, and Node.js functionality, with active communication between the client and the server over the life of a user session.

Baseline Requirements
---

There is a large range of application areas and possibilities that meet these baseline requirements. 
Try to make your application do something useful! A todo list, storing / retrieving high scores for a very simple game... have a little fun with it.

Your application is required to implement the following functionalities (4 pts each, total 20 pts):

- a `Server` which not only serves files, but also maintains a tabular dataset with 3 or more fields related to your application
- a `Results` functionality which shows the entire dataset residing in the server's memory
- a `Form/Entry` functionality which allows a user to add or delete data items residing in the server's memory
- a `Server Logic` which, upon receiving new or modified "incoming" data, includes and uses a function that adds at least one additional derived field to this incoming data before integrating it with the existing dataset
- the `Derived field` for a new row of data must be computed based on fields already existing in the row. 
For example, a `todo` dataset with `task`, `priority`, and `creation_date` may generate a new field `deadline` by looking at `creation_date` and `priority`

Your application is required to demonstrate the use of the following concepts:

HTML (4 pts each, total 16 pts):
- One or more [HTML Forms](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms), with any combination of form tags appropriate for the user input portion of the application
- A results page displaying all data currently available on the server. You will most likely use a `<table>` tag for this, but `<ul>` or `<ol>` could also work and might be simpler to work with. Alternatively, you can create a single-page app (see Technical Acheivements) but this is not a requirement.
- All pages should [validate](https://validator.w3.org)
- If your app contains multiple pages, they should all be accessible from the homepage (index.html)

CSS (4 pts each, total 16 pts):
- CSS styling of the primary visual elements in the application
- Various CSS Selector functionality must be demonstrated:
    - Element selectors
    - ID selectors
    - Class selectors
- CSS positioning and styling of the primary visual elements in the application:
    - Use of either a CSS grid or flexbox for layout
    - Rules defining fonts for all text used; no default fonts! Be sure to use a web safe font or a font from a web service like [Google Fonts](http://fonts.google.com/)
- CSS defined in a maintainable, readable form, in external stylesheets 

JavaScript (4 pts):
- At minimum, a small amount of front-end JavaScript to get / fetch data from the server; a sample is provided in this repository.

Node.js (4 pts):
- An HTTP Server that delivers all necessary files and data for the application, and also creates the required `Derived Fields` in your data. 
A starting point is provided in this repository.

Deliverables
---

1. (5 pts) Fork the starting project code repo. The starter code in the repo may be used or discarded as needed.
2. (60 pts, detailed above) Implement your project with the above requirements.
3. Test your project to make sure that when someone goes to your main page, it displays correctly.
4. (5 pts) Deploy your project to Render (or your hosting service of choice), and fill in the appropriate fields in your package.json file.
5. (5 pts) Ensure that your project at least starts with the proper naming scheme `a2-FirstnameLastname` so we can find it.
6. (5 pts) Modify the README to the specifications below, and delete all of the instructions originally found in this README.
7. (5 pts) Create and submit a Pull Request to the original repo. Be sure to include your name in the pull request.

Acheivements
---

Below are suggested technical and design achievements. You can use these to help customize the assignment to your personal interests. These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README and why it was challenging. ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM. Remember, the highest grade you can get on any individual assignment is a 100%.

*Technical*
- (5 points) Create a single-page app that both provides a form for users to submit data and always shows the current state of the server-side data. To put it another way, when the user submits data, the server should respond sending back the updated data (including the derived field calculated on the server) and the client should then update its data display.

- (5 points) In addition to a form enabling adding and deleting data on the server, also add the ability to modify existing data.

*Design/UX*
- (5 points per person, with a max of 10 points) Test your user interface with other students in the class. Define a specific task for them to complete (ideally something short that takes <10 minutes), and then use the [think-aloud protocol](https://en.wikipedia.org/wiki/Think_aloud_protocol) to obtain feedback on your design (talk-aloud is also fine). Important considerations when designing your study:

1. Make sure you start the study by clearly stating the task that you expect your user to accomplish.
2. You shouldn't provide any verbal instructions on how to use your interface / accomplish the task you give them. Make sure that your interface is clear enough that users can figure it out without any instruction, or provide text instructions from within the interface itself. 
3. If users get stuck to the point where they give up, you can then provde instruction so that the study can continue, but make sure to discuss this in your README. You won't lose any points for this... all feedback is good feedback!

You'll need to use sometype of collaborative software that will enable you both to see the test subject's screen and listen to their voice as they describe their thoughts, or conduct the studies in person. After completing each study, briefly (one to two sentences for each question) address the following in your README:

1. Provide the last name of each student you conduct the evaluation with.
2. What problems did the user have with your design?
3. What comments did they make that surprised you?
4. What would you change about the interface based on their feedback?

*You do not need to actually make changes based on their feedback*. This acheivement is designed to help gain experience testing user interfaces. If you run two user studies, you should answer two sets of questions. 

FAQ
---
**Q: Can I use frameworks for this assignment?**

A: No. We'll discuss them later this term, but for right now, we want to see that you can implement these features yourself instead of outsourcing them to an existing framework or library.

**Q: After I delete some data server-side, the data persists on the client side until I refresh the page.**

A: Make sure the client-side copy of the data also reflects the deletion. The server-side and client-side copies of the data should remain in sync at all times.

**Q: Do I have to implement the specific achievements above?**

A: No. As discussed in the instructions, you are free to implement your own. If you're not sure if they'll qualify, check with the instructor.

**Q: If I do a single page for the technical achievement, will I still get credit for the last two criteria in the base requirements?**

Yes.


Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Gompei's Gear
This is a simple web application that I made that consists of two parts: a form that the user can submit on one page, and the ability to view/change orders on the other page. The pages as a whole made good use of css styling and the flex display method. To use the application simply fill out the form and click submit. If you want to see the other page simply click the orders link. On the order's page simply click the home link to get back to the home page. To update an entry simply click the update button on the right of the information you want to update, then click save to save the updated information, discard changes to discard any changes in the current window, or delete order to delete the order from the table.

## Technical Achievements
- **Tech Achievement 1**: 
  - I created a two-page app that provides a form for users to submit data and always shows the current state of the server-side data.
  - The first page contains the form and links to the second page. It sends data to the server whenever a form is submitted
  - The second page contains the table to display the data currently in the server. Whenever the page is loaded it gets the most up-to-date data and fills the table

- **Tech Achievement 2**:
  - I allowed for data to be created and deleted on the server 
  - The second page also contains buttons that are generated when the table generates that allow for the page to switch into the updating menu 
  - In this menu the user has the options to be able to update one entry at a time in the table; then they have the option to save te changes, discard them, or delete the entry as a whole 
  - Whenever changes are made to the data in the server on the display page (after the update menu), the page changes its current data to reflect the new data

### Design/Evaluation Achievements
- **Design Achievement 1**: 
   - Study Design:
    - I conducted a study on my UI in order to evaluate the practicality
    - I asked the user to complete 3 simple tasks: create an order, change the name listed on any order, and delete an order
    - I listed down feedback that the user gave me during, and after they completed the tasks
  
  - Study Participants:
    - I invited Tien Nguyen to participate
  
  - Study Results:
    - The users had the following issues with the interface:
      - They expected there to be an "update" button in the update menu
      - They though the buttons in the update menu should have more space between them and the text entries
      - They would prefer the buttons to be colored in the update menu
      
    - Some of the comments that I found surprising were:
      - I thought having a "save changes to order" button would server the same functionality
      
    - I think I can incorporate their feedback by doing:
      - I will increase the spacing between the text entries and the buttons in the update menu
      - Adding the requested colors to the buttons
    
    