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
const taskDescription = document.getElementById("taskDescriptionInput");
const submitButton = document.getElementById("submitButton");

/***********************FUNCTIONS ***********************/

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
        section.addEventListener("dragover", (ev)=>{
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move";
            ev.currentTarget.classList.add("dragovered");
        });
        section.addEventListener("dragleave", (ev)=>{
            ev.preventDefault();
            ev.currentTarget.classList.remove("dragovered");
        });
        section.addEventListener("drop", (ev)=>{
            ev.preventDefault();
            const target = ev.currentTarget ;
            target.classList.remove("dragovered");
            const data = ev.dataTransfer.getData("text");
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

const editTask = (taskId) => {
    const formData = { 
        id : taskId,
        name : taskName.value,
        type : taskType.value,
        description : taskDescription.value
    };

    // Update the taskListCopy removing the previous version of task by using its index 
    for(let i = 0 ; i < storedTasksCopy.length ; i++){    
        let task = storedTasksCopy[i];
        if(parseInt(formData.id,10) === parseInt(task.id, 10)){ 
            // Remove the task from the array which is stored in the browser local storage
            storedTasksCopy.splice(i, 1);
        }
    }

    // Remove from the DOM tree the task before recreating it
    Util.removeElementFromDOM([document.getElementById("TaskNumber"+taskId)]);
    let newTask = new Task(formData);
    storedTasksCopy.push(newTask);
    Util.saveDataToDomStorage("taskList", storedTasksCopy, "local");

    // Display the recreated task into the web page in the relevant section
    for(let section of sections){
        if(section.dataset.type === newTask.type){
            const sectionTitle = document.querySelector("#"+ section.id +" > .section__title");
            Util.insertAfter(newTask.renderElement(),
            sectionTitle);
            location.assign(location.pathname);
        }
    }
    
    // Set the listeners onto the recreated task
    newTask.setDeletionButton(storedTasksCopy, updateStoredTasksCopy);
    newTask.setEditionButton(storedTasksCopy, updateStoredTasksCopy);
    prepareDragAndDrop();
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

    let newTask = new Task(formData);
        
    storedTasksCopy.push(newTask);
    Util.saveDataToDomStorage("taskList", storedTasksCopy, "local");

    // Display the new task into the web page in the relevant section
    for(let section of sections){
        if(section.dataset.type === newTask.type){
            const sectionTitle = document.querySelector("#"+ section.id +" > .section__title");
            Util.insertAfter(newTask.renderElement(),
            sectionTitle);
            location.assign(location.pathname+'#'+section.id);
        }
    }
    newTask.setDeletionButton(storedTasksCopy, updateStoredTasksCopy);
    newTask.setEditionButton(storedTasksCopy, updateStoredTasksCopy);
    prepareDragAndDrop();
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

/* Generate the task list from the DOM storage, put it into the DOM to display it on the page */
(()=>{
    for(let task of storedTasksCopy){
        for(let section of sections){
            if(section.dataset.type === task.type){
                const taskToShow = new Task(task);
                section.appendChild(taskToShow.renderElement()
                );
                taskToShow.setDeletionButton(storedTasksCopy, updateStoredTasksCopy);
                taskToShow.setEditionButton(storedTasksCopy, updateStoredTasksCopy);
            }
        }
    }
})();

updateStoredTasksCopy();
prepareDragAndDrop();
checkFormValidity();

/********** LISTENERS ********/

/* New task form listeners */   
taskName.addEventListener("input", checkFormValidity);
taskName.addEventListener("focus", checkFormValidity);
taskDescription.addEventListener("input", checkFormValidity);
taskDescription.addEventListener("focus", checkFormValidity);
taskType.addEventListener("focus", checkFormValidity);

taskForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(checkFormValidity()){
        if(taskForm.taskId.value === ""){
            recordTask();
        }
        else{
            editTask(parseInt(taskForm.taskId.value, 10));          
        }
    }

})