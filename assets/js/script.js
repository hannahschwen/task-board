/*
Left to do:
- Write delete function
- Write handle drop function
- Make lanes droppable
- Make date input fancy with jQuery ui

PSEUDO CODE:

After the page loads:
  - task cards should render sorted according to status
If a user adds a task:
  - a unique id is generated for the task
  - the task is assigned a to-do status
  - the task is saved to local storage
  - the task is added to the to-do lane
If a user drags the task:
  - the position should update to append or snap in line with the parent lane
  If the task is dropped in the progress lane
    - the status should be updated to in-progress
    - the new status should be updated in local storage
  IF the task is dropped in the done lane
    - the status should be updated to done
    - any bg-warning text-white border border-white classes should be removed
    - the new status should be updated to done
If a user clicks the delete button
  - the associated task of that id should be deleted from local storage
  - the task card element should also be deleted

*/


// This is an example task list so I could test the renderTaskList function.
// const taskList = [{title : 'To do', description: 'test description', date: 'Test date', status: 'todo', taskId: 1,}, {title : 'In progress', description: 'test description', date: 'Test date', status: 'in-progress', taskId: 2,}, {title : 'Done', description: 'test description', date: 'Test date', status: 'done', taskId: 3,},]



// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const body = $('body');

// Todo: create a function to generate a unique task id
function generateTaskId() {
  nextId = $.now();
  localStorage.setItem('nextId', nextId);
}
// the id of the card should be the same value as the taskId in storage, so I can find the card id to get the storage with same taskId to delete.
// Todo: create a function to create a task card
function createTaskCard(task) {
  if (task.status == "done") {
    $('#done-cards').append(`
      <div class = "task-card card m-4 mt-2">
        <h5 class="card-header">${task.title}</h5>
        <div class="card-body">
          <p class="card-text">${task.description}</p>
          <p class="card-text">${task.date}</p>
          <button class="btn btn-danger delete" id=${task.taskId}>Delete</button>
        </div>
      </div>
    `);
  } else if (task.status == "in-progress") {
    $('#in-progress-cards').append(`
    <div class = "task-card card m-4 mt-2">
      <h5 class="card-header">${task.title}</h5>
      <div class="card-body">
        <p class="card-text">${task.description}</p>
        <p class="card-text">${task.date}</p>
        <button class="btn btn-danger delete" id=${task.taskId}>Delete</button>
      </div>
    </div>
  `);
  } else {
    $('#todo-cards').append(`
    <div class = "task-card card m-4 mt-2">
      <h5 class="card-header">${task.title}</h5>
      <div class="card-body">
        <p class="card-text">${task.description}</p>
        <p class="card-text">${task.date}</p>
        <button class="btn btn-danger delete" id=${task.taskId}>Delete</button>
      </div>
    </div>
  `);
  }

  generateTaskId();

  $('.task-card').draggable({
    revert: "invalid",
    zIndex: 100,
  })
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  taskList.forEach(task => {
    createTaskCard(task);
  });

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
  // this function should use form data to make a new task, add it to the taskList, and maybe also create a card for it?

  const taskTitleInput = $('#task-title');
  const taskDescriptionInput = $('#task-description');
  const taskDateInput = $('#task-date');

  let task = {
    title : taskTitleInput.val(),
    description : taskDescriptionInput.val(),
    date : taskDateInput.val(),
    status : 'todo',
    taskId : nextId,
  }

  taskList.push(task);
  localStorage.setItem('tasks', JSON.stringify(taskList));

  console.log(taskList);

  createTaskCard(task);
}

// Todo: create a function to handle deleting a task
// How I'm thinking this might work... I know I can delete the element from the page by getting the button's parents with class .taskCard. I also need to get task from array with taskID matching the id of the card. Actually, moving that id off the card and on to the button instead should save a step.
//So maybe... get id of button and make it a variable... get task from array with taskId == variable... delete that task from the array... update the array in storage... then delete the taskCard element.

function handleDeleteTask(event){
  //gets the id of the button (which matches its coordinating task's taskId)
  let taskId = $(this).attr('id');
  console.log(taskId);
  //finds the task in the array with matching taskId by it's index
  let toDelete = taskList.findIndex(task => task.taskId == taskId);
  //deletes the task from the tasklist
  taskList.splice(toDelete, 1);
  console.log(taskList);
  //saves the updated list back in storage
  localStorage.setItem('tasks', JSON.stringify(taskList));
  //removes the grandparent .task-card of the delete button
  const btnClicked = $(event.target);
  btnClicked.parents('.task-card').remove();
}

// Todo: create a function to handle dropping a task into a new status lane
// when something is dropped, it's status attribute should update, if dropped in done, it's extra background/text color classes and such should be removed... Wait I have to have it saved in local, so I'll have to get the task with matching Id as a variable, change its status property, and save it back into storage... It's in an array, so I'll probably have to reset the whole array with that object updated
// maybe when I drop it has to update the array, clear all the cards, and re render them? Then it'd be sorted... seems too messy to be right
// so maybe... if get task of matching id... if dropped on #to-do-cards, change status property to todo, on #in-progress-cards change to in-progress, on #done change status to done AND remove extra classes from the element... update the task in the array... update the array in local storage
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  renderTaskList();

  const submitTask = $('#submit-task');
  submitTask.on('click', function(event) {
    event.preventDefault();
    handleAddTask();
  });

  body.on('click', '.delete', handleDeleteTask);

});
