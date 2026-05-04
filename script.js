const addTaskButton = document.getElementById('AddTaskButton');
const deleteTaskButton = document.getElementById('DeleteTaskButton');
const addTaskField = document.getElementById('AddTaskField');
const deleteTaskField = document.getElementById('DeleteTaskField');
const taskList = document.getElementById('TODOLST');

const saveListButton = document.getElementById("SaveListButton");

function getUserId(){
    return "Jason";
}

// convert to do list to JSON object 
function serialize_list(){
    tasks = [];

    for (const task of taskList.children){
        tasks.push(task.textContent)
    }
    json = {
        tasks : tasks,
        user : getUserId()
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
}); 

deleteTaskButton.addEventListener('click', function(event){
    event.preventDefault();
    const taskValue = deleteTaskField.value.trim();
    const tasks = taskList.querySelectorAll('li');
    tasks.forEach(function(task){
        if (task.textContent == taskValue){
            task.remove();
        }
    });
    deleteTaskField.value = '';
})

saveListButton.addEventListener('click', async function(event){
    event.preventDefault();
    jsonString = serialize_list();
    const res = await fetch("http://localhost:3000/save", {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: jsonString
    });
    console.log('saved', await res.json());
})
