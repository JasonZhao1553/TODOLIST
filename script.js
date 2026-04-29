const addTaskButton = document.getElementById('AddTaskButton');
const deleteTaskButton = document.getElementById('DeleteTaskButton');
const addTaskField = document.getElementById('AddTaskField');
const deleteTaskField = document.getElementById('DeleteTaskField');
const taskList = document.getElementById('TODOLST');

addTaskButton.addEventListener('click', function(event){
    event.preventDefault();
    const taskValue = addTaskField.value.trim();

    if (taskValue !== ''){
        const newTask = document.createElement('li');
        newTask.textContent = taskValue;
        taskList.appendChild(newTask);
        addTaskField.value = '';
        console.log(taskValue);
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
