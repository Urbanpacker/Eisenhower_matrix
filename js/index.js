"use strict";

import {Util} from "./utilities.js";
import {Task} from "./task.js";

/*********************DATA *************************/

/**** Task list sections ****/
const important_urgent = document.getElementById("important_urgent_section");
const non_important_urgent = document.getElementById("non_important_urgent_section");
const important_non_urgent = document.getElementById("important_non_urgent_section");
const non_important_non_urgent = document.getElementById("non_important_non_urgent_section");
const sections = [important_urgent, non_important_urgent, important_non_urgent, non_important_non_urgent];

/**** Stored tasks list ****/

const storedTasksCopy = Util.loadDataFromDomStorage("taskList", "local") || [];

/*** Form fields ****/
const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskNameInput");
const taskType = document.getElementById("taskTypeInput");
const taskId = document.getElementById("taskId");
const taskDescription = document.getElementById("taskDescriptionInput");
const submitButton = document.getElementById("submitButton");

/***********************FUNCTIONS ***********************/

const resetForm = () =>{
    taskId.value = "" ;
    taskName.value = "" ;
    taskType.value = "important_urgent";
    taskDescription.value = "";
    taskForm.submitButton.textContent = "Créer la tâche";
    let cancelEdition = document.getElementById("cancelEdition");
    if(cancelEdition !== null){
        cancelEdition.remove();
    }
    
}

const setTaskButtons = (button) =>{
    const taskButtons = document.querySelectorAll("#"+button.id + " [data-elem-type]");
    for(let taskButton of taskButtons){
        taskButton.addEventListener("click", (e)=> {
            e.preventDefault();
            
            let targetedTaskId = e.currentTarget.dataset.taskId;
            
            // If the deleteButton has been clicked
            if(e.currentTarget.dataset.elemType==="deleteButton"){
                // Update the taskListCopy removing the current task by using its index 
                for(let i = 0 ; i < storedTasksCopy.length ; i++){    
                    let task = storedTasksCopy[i];
                    if(parseInt(targetedTaskId, 10) === task.id){ 
                        // Remove the task from the array which is stored in the browser local storage
                        storedTasksCopy.splice(i, 1);
                    }
                }
                // Remove from the DOM tree the task which corresponds to the deletion button that has been clicked
                Util.removeElementFromDOM([document.getElementById("TaskNumber"+targetedTaskId)]);                
            }
            // If the editButton has been clicked
            else if(e.currentTarget.dataset.elemType === "editButton"){
                let currentTarget = e.currentTarget ;   
                for(let i = 0 ; i < storedTasksCopy.length ; i++){    
                    let task = storedTasksCopy[i];
                    if(parseInt(currentTarget.dataset.taskId,10) === task.id){ 
                        taskForm.taskId.value = task.id ;
                        taskForm.taskNameInput.value = task.name;
                        taskForm.taskDescriptionInput.value = task.description;
                        taskForm.taskTypeInput.value = task.type;
                        taskForm.taskNameInput.focus();
                    }
                }
                taskForm.submitButton.textContent = "Modifier la tâche";
                
                let cancelEdition = document.getElementById("cancelEdition");
                if(cancelEdition === null){
                    cancelEdition = document.createElement("button");
                    cancelEdition.id = "cancelEdition";
                    cancelEdition.textContent = "Annuler la modification";        
                    cancelEdition.classList.add("formButtons__button", "formButtons__button--cancel");
                    Util.insertAfter(cancelEdition, taskForm.submitButton);
                    cancelEdition.addEventListener("click", (event)=> {
                        event.preventDefault();
                        resetForm();
                    });
                }
            }
            updateStoredTasksCopy();
        });
    }
    prepareDragAndDrop();
} ;


/* Take the task list from an array then put it into the DOM */
const displayTasks = (taskList) => {
    // Display the new task into the web page in the relevant section
    for(let task of taskList){
        for(let section of sections){
            if(section.dataset.type === task.type){
                let taskToShow = task ;
                if(!(taskToShow instanceof Task)){
                    taskToShow = new Task(task);
                }
                const HTMLTaskElement = taskToShow.renderElement() ;
                section.appendChild(HTMLTaskElement);
                setTaskButtons(HTMLTaskElement);
            }
        }
    }
}

const updateStoredTasksCopy = ()=>  {  
    // Set the updated array of tasks into the browser's local storage 
    Util.removeDataFromDomStorage("taskList", "local");
    if(storedTasksCopy.length > 0){
        Util.saveDataToDomStorage("taskList", storedTasksCopy, "local");
    }
};

/* Drag and drop */
const prepareDragAndDrop = async ()=>{
   for(let section of sections){
        section.addEventListener("dragstart", (e) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text", e.target.getAttribute("id"));
        });
        section.addEventListener("dragover", (e)=>{
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            e.currentTarget.classList.add("dragovered");
        });
        section.addEventListener("dragleave", (e)=>{
            e.preventDefault();
            e.currentTarget.classList.remove("dragovered");
        });
        section.addEventListener("drop", (e)=>{
            e.preventDefault();
            const target = e.currentTarget ;
            target.classList.remove("dragovered");
            const data = e.dataTransfer.getData("text");
            const draggedElement = document.getElementById(data) ;
            const clonedElement = draggedElement.parentNode.removeChild(draggedElement);
            target.appendChild(clonedElement);    
            if(draggedElement.dataset.type != target.dataset.type){
                for(let storedTask of storedTasksCopy){
                    let storedTaskId = storedTask.id.toString() ;
                    if(storedTaskId === draggedElement.dataset.id){
                        storedTask.type = target.dataset.type ;
                        updateStoredTasksCopy();
                    }
                }
            }
        });
    }
}

const editTask = () => {
    const formData = { 
        id : parseInt(taskId.value, 10),
        name : taskName.value,
        type : taskType.value,
        description : taskDescription.value
    };

    resetForm();

    // Update the taskListCopy removing the previous version of task by using its index 
    for(let i = 0 ; i < storedTasksCopy.length ; i++){    
        let task = storedTasksCopy[i];
        if(parseInt(formData.id,10) === parseInt(task.id, 10)){ 
            // Remove the task from the array which is stored in the browser local storage
            storedTasksCopy.splice(i, 1);
        }
    }

    // Remove from the DOM tree the task before recreating it
    Util.removeElementFromDOM([document.getElementById("TaskNumber"+formData.id)]);
    let newTask = new Task(formData);
    storedTasksCopy.push(newTask);
    Util.saveDataToDomStorage("taskList", storedTasksCopy, "local");

    // Display the modified task into the web page in the relevant section
    displayTasks([newTask]);
}


const recordTask = () => {
    // The id is created by incrementing the id number of the last item of the stored items array
    let id ;

    if(storedTasksCopy.length>0){
        id = parseInt(storedTasksCopy[storedTasksCopy.length-1].id)+1 ;
    } else {
        id = 1; 
    }

    const formData = { 
        id : id,
        name : taskName.value,
        type : taskType.value,
        description : taskDescription.value
    };

    resetForm();

    let newTask = new Task(formData);
    storedTasksCopy.push(newTask);
    Util.saveDataToDomStorage("taskList", storedTasksCopy, "local");

    // Display the new task into the web page in the relevant section
    displayTasks([newTask]);
}

const checkFormValidity = () => {
    let isValid = false ;
    const requiredFields = document.querySelectorAll("form [required]");
    submitButton.removeAttribute("disabled");
    submitButton.classList.remove("disabled");
    
    let emptyRequiredField = 0;
    for(let field of requiredFields){
        if(!field.value.trim()){
            emptyRequiredField++;
        }
    }
    
    isValid = emptyRequiredField === 0 ? true : false ; 
    if(!isValid){
        submitButton.setAttribute("disabled", true);
        submitButton.classList.add("disabled");
    }
    return isValid;
}


/******* MAIN CODE and IIFE *******/

/* Set the background color to the type options in the form with the relevant section colors */
(()=>{
    const typeList = document.querySelectorAll("#taskTypeInput option");
    for(let section of sections){
       for(let typeOption of typeList){
            if(section.id === typeOption.value+"_section"){
                typeOption.style.backgroundColor = window.getComputedStyle(section).backgroundColor;
            }   
        }
    } 
})();

displayTasks(storedTasksCopy);
updateStoredTasksCopy();
prepareDragAndDrop();
checkFormValidity();

/********** LISTENERS ********/

/* New task form listeners */

const formFields = [taskName, taskDescription];

for(let formField of formFields){
    formField.addEventListener("input", checkFormValidity);
    formField.addEventListener("focus", checkFormValidity);
}

taskForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(checkFormValidity()){
        if(taskId.value === ""){
            recordTask();
        }
        else{
            editTask();          
        }
    }

})