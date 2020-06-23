import {Util} from "./utilities.js";

class Task{
    constructor({id, name, type, description}){
        this.setId(id);
        this.setName(name);
        this.setType(type);
        this.setDescription(description);
        this.deleteButton = null;
        this.editButton = null;
    }
    
    setId(id){
        this.id = id ;
    }

    setName(name){
        this.name = name ;
    }
    
    setType(type){
        this.type = type ;
    }

    setDescription(description){
        this.description = description ;
    }

    setDeletionButton(storedTasksCopy, deletionCallback){
        this.deleteButton.addEventListener("click", (e)=> {
            e.preventDefault();
            let currentTarget = e.currentTarget ;
            // Update the taskListCopy removing the current task by using its index 
            for(let i = 0 ; i < storedTasksCopy.length ; i++){    
                let task = storedTasksCopy[i];
                if(parseInt(currentTarget.dataset.taskId, 10) === task.id){ 
                    // Remove the task from the array which is stored in the browser local storage
                    storedTasksCopy.splice(i, 1);
                }
            }
            // Remove from the DOM tree the task which corresponds to the deletion button that has been clicked
            Util.removeElementFromDOM([document.getElementById("TaskNumber"+currentTarget.dataset.taskId)]);
            deletionCallback();
        });
    }

    setEditionButton(storedTasksCopy, editionCallback){
        const taskForm = document.getElementById("taskForm");
        this.editButton.addEventListener("click", (e)=> {
            e.preventDefault();
            let currentTarget = e.currentTarget ;   
            for(let i = 0 ; i < storedTasksCopy.length ; i++){    
                let task = storedTasksCopy[i];
                if(parseInt(currentTarget.dataset.taskId,10) === task.id){ 
                    taskForm.taskId.value = task.id ;
                    taskForm.taskNameInput.value = task.name;
                    taskForm.taskDescriptionInput.value = task.description;
                    taskForm.taskTypeInput.value = task.type;
                    }
            }
            taskForm.submitButton.textContent = "Modifier la tâche";
            
            var cancelEditionPresent = document.getElementById("cancelEdition") ? true : false ; 
            let cancelEdition ;
            
            if(!cancelEditionPresent){
                cancelEdition = document.createElement("button");
                cancelEdition.id = "cancelEdition";
                cancelEdition.textContent = "Annuler la modification";        
                cancelEdition.classList.add("formButtons__button", "formButtons__button--cancel");
                Util.insertAfter(cancelEdition, taskForm.submitButton);
                
                cancelEdition.addEventListener("click", (e)=> {
                    e.preventDefault();
                    taskForm.taskId.value = "" ;
                    taskForm.taskNameInput.value = "";
                    taskForm.taskDescriptionInput.value = "";
                    taskForm.submitButton.textContent = "Créer la tâche";
                    cancelEdition.remove();
                });
            }
            editionCallback();
        });
    }

    renderElement(){
        let task = document.createElement("div");
        task.id = "TaskNumber" +this.id;
        task.dataset.id = this.id;
        task.dataset.type = this.type ;
        task.classList.add("section__singleTask");

        const nameElement = document.createElement("p");
        nameElement.appendChild(document.createTextNode(this.name));
        nameElement.classList.add("section__singleTask__taskName");

        const description = document.createElement("p");
        description.appendChild(document.createTextNode(this.description));
        description.classList.add("section__singleTask__description")

        const deleteButton = document.createElement("a");
        const deleteButtonImg = document.createElement("img");
        deleteButtonImg.setAttribute("src", "./images/deleteButton.svg");
        deleteButtonImg.dataset.credits = "This image is published under the Creative Commons Public Domain 1.0, the original image can be found on the website Free SVG : https://freesvg.org/red-cross-not-ok-vector-icon . Many thanks to them." ;
        deleteButtonImg.setAttribute("alt", "Supprimer cette tâche");
        deleteButton.appendChild(deleteButtonImg);
        deleteButton.setAttribute("href", "#");
        deleteButton.dataset.taskId = this.id;
        this.deleteButton = deleteButton ;

        const editButton = document.createElement("a");
        const editButtonImg = document.createElement("img");
        editButtonImg.setAttribute("src", "./images/editButton.svg");
        editButtonImg.dataset.credits = "This image is published under the Creative Commons Public Domain 1.0, the original image can be found on the website Free SVG : https://freesvg.org/hb-pencil-vector-image . Many thanks to them." ;
        editButtonImg.setAttribute("alt", "Modifier cette tâche");
        editButton.appendChild(editButtonImg);
        editButton.setAttribute("href", "#");
        editButton.dataset.taskId = this.id;
        this.editButton = editButton ;

        const buttons = document.createElement("div");
        buttons.classList.add("section__singleTask__buttons");

        buttons.appendChild(editButton);
        buttons.appendChild(deleteButton);

        task.appendChild(nameElement);
        task.appendChild(description);
        task.appendChild(buttons);

        
        return task ;
    }

}

export {Task} ;