class Task{
    constructor({id, text, done=false, createdAt = DataTransfer.now()} = {}){
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
        return newTask(obj);
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
const deleteTaskButton = document.getElementById('DeleteTaskButton');
const addTaskField = document.getElementById('AddTaskField');
const deleteTaskField = document.getElementById('DeleteTaskField');
const taskList = document.getElementById('TODOLST');

const saveListButton = document.getElementById("SaveListButton");

const FIXED_USER_ID = "1";
const FIXED_USERNAME = "JASON";

function getUser(){
    return FIXED_USERNAME;
}

function getUserID(){
    return FIXED_USER_ID;
}

function getUTCDate(){
    return new Date().toISOString();
}

async function update_list(){
    jsonString = serialize_list();
    const res = await fetch("http://localhost:3000/save", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: jsonString
    });
    console.log('saved', await res.json());
}

// convert to do list to JSON object 
function serialize_list(){
    tasks = [];

    for (const task of taskList.children){
        tasks.push(task.textContent)
    }
    json = {
        userID : getUserID(),
        savedAt : getUTCDate(),
        tasks : tasks,
    };
    const jsonString = JSON.stringify(json);
    return jsonString;
}

addTaskButton.addEventListener('click', function(event){
    event.preventDefault();
    const taskValue = addTaskField.value.trim();
    if (taskValue !== ''){
        const newTask = document.createElement('li');
        newTask.textContent = taskValue;
        taskList.appendChild(newTask);
        addTaskField.value = '';
    }
    update_list();
}); 

saveListButton.addEventListener('click', async function(event){
    event.preventDefault();
    update_list();
})

async function load_list(){
    const res = await fetch(`http://localhost:3000/load?userID=${getUserID()}`);
    const data = await res.json();
    for (const taskText of data.tasks ?? []){
        const li = document.createElement('li');
        li.textContent = taskText;
        taskList.append(li);
    }
}

load_list();

