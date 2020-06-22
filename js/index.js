"use strict";

import {Util} from "./utilities.js";
import {Task} from "./task.js";
import {DndHandler} from "./dndHandler.js";

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
const newTaskForm = document.getElementById("newTaskForm");
const taskName = document.getElementById("taskNameInput");
const taskType = document.getElementById("taskTypeInput");
const taskDescription = document.getElementById("taskDescriptionInput");
const submitButton = document.getElementById("submitButton");

/***********************FUNCTIONS ***********************/

const updateStoredTasksCopy = ()=> {

    // Set the updated array of tasks into the browser's local storage 
    Util.removeDataFromDomStorage("taskList", "local");
    if(storedTasksCopy.length > 0){
        Util.saveDataToDomStorage("taskList", storedTasksCopy, "local");
    }

};

/* Drag and drop */
const prepareDragAndDrop = async ()=>{
    let getDisplayedTasks = () => {return document.getElementsByClassName("section__singleTask")};
    const taskTodisplay = getDisplayedTasks() ;
    const displayedTasks = await taskTodisplay;
    const droppingCallback = (destination, draggedElem)=>{
        if(draggedElem.dataset.type != destination.dataset.type){
            for(let storedTask of storedTasksCopy){
                let storedTaskId  = storedTask.id.toString()
                if(storedTaskId === draggedElem.dataset.id){
                    storedTask.type = destination.dataset.type ;
                    updateStoredTasksCopy();
                }
            }
        }
    } ;
    DndHandler.setListeners(displayedTasks, sections, droppingCallback);
};

const recordTask = () => {
       // The id is created by incrementing the id number of the last item of the stored items array
       let id ;
       if(storedTasksCopy[storedTasksCopy.length-1]){
           id = storedTasksCopy[storedTasksCopy.length-1].id+1 ;
       } else {
           id = 1; 
       }
    
       const formData = { 
        id : id,
        name : taskName.value,
        type : taskType.value,
        description : taskDescription.value,
        isArchived : false,
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
    for(let i = 0, c = sections.length ; i < c ; i++){
       for(let j = 0, d = typeList.length ; j < d ; j++){
            if(i===j){
                typeList[j].style.backgroundColor = window.getComputedStyle(sections[i]).backgroundColor;
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
taskDescription.addEventListener("input", checkFormValidity);
newTaskForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(checkFormValidity()){
        recordTask();
    }

})