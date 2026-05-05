class Task{
    constructor({id, text, done=false, createdAt = Date.now()} = {}){
        this.id = id ?? crypto.randomUUID();
        this.text = text;
        this.done = done;
        this.createdAt = createdAt;
    }

    toJSON(){
        return {
            id : this.id,
            text : this.text,
            done : this.done,
            createdAt : this.createdAt,
        };
    }

    static fromJSON(obj){
        return new Task(obj);
    }
}

class TaskList{
    constructor({userID, tasks=[]} = {}) {
        this.userID = userID;
        this.tasks = tasks.map(t => t instanceof Task ? t : Task.fromJSON(t));
    }

    add(text){
        const task = new Task({text});
        this.tasks.push(task);
        return task;
    }

    removeById(id){
        const idx = this.tasks.findIndex(t => t.id === id);
        if (idx !== -1) this.tasks.splice(idx, 1);
    }

    toggleDoneById(id){
        const task = this.findById(id);
        if (task) task.done = !task.done;
    }

    findById(id){
        return this.tasks.find(t => t.id === id);
    }

    toJSON(){
        return{
            userID: this.userID,
            savedAt : new Date().toISOString(),
            tasks : this.tasks
        };
    }

    static fromJSON(obj){
        return new TaskList(obj);
    }
}

const addTaskButton = document.getElementById('AddTaskButton');
const addTaskField = document.getElementById('AddTaskField');
const taskListEl = document.getElementById('TODOLST');

const saveListButton = document.getElementById("SaveListButton");

const FIXED_USER_ID = "1";
const FIXED_USERNAME = "JASON";

let taskList = new TaskList({userID : getUserID()});

function getUser(){
    return FIXED_USERNAME;
}

function getUserID(){
    return FIXED_USER_ID;
}

function getUTCDate(){
    return new Date().toISOString();
}

function renderTask(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    if (task.done) li.classList.add('done');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.classList.add('toggle-done');

    const text = document.createElement('span');
    text.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';                  // don't submit any enclosing form
    deleteBtn.textContent = 'Del';
    deleteBtn.classList.add('delete-task-btn'); // matches your delegated handler

    li.append(checkbox, text, deleteBtn);
    return li;
}

function render(){
    taskListEl.replaceChildren(...taskList.tasks.map(t => renderTask(t)));
}

async function update_list(){
    jsonString = taskList.toJSON();
    jsonString = JSON.stringify(jsonString);
    console.log(jsonString);
    const res = await fetch("http://localhost:3000/save", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: jsonString
    });
    console.log('saved', await res.json());
}

addTaskButton.addEventListener('click', function(event){
    event.preventDefault();
    const taskValue = addTaskField.value.trim();
    if (taskValue !== ''){
        let newTask = taskList.add(taskValue); // Task object
        render();
        update_list();
    }
    addTaskField.value = '';
});

taskListEl.addEventListener('click', (event) => {
    const li = event.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;

    if (event.target.closest('.delete-task-btn')){
        taskList.removeById(id);
        render();
        update_list();
    }
    else if (event.target.closest('.toggle-done')){
        taskList.toggleDoneById(id);
        li.classList.toggle('done');
        update_list();
    }
})

async function load_list(){
    const res = await fetch(`http://localhost:3000/load?userID=${getUserID()}`);
    const data = await res.json();
    taskList = TaskList.fromJSON({userID : getUserID(), tasks : data.tasks ?? []});
    render();
}

function renderGreeting(){
    const greetingText = document.getElementById('GreetingText');
    const greetingDate = document.getElementById('GreetingDate');
    if (greetingText) greetingText.textContent = `Hello ${getUser()}`;
    if (greetingDate) {
        greetingDate.textContent = new Date().toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }
}

renderGreeting();
load_list();

