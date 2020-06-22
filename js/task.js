class Task{
    constructor({id, name, type, description}){
        this.setId(id);
        this.setName(name);
        this.setType(type);
        this.setDescription(description);
        this.deleteButton = null;
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
            // Update the taskListCopy removing the current task
            for(let task of storedTasksCopy){            
                if(currentTarget.dataset.taskId.toString() === task.id.toString()){ 
                    for(let i = 0 ; i < storedTasksCopy.length ; i++){
                        // Remove the task from the array which is stored in the browser local storage
                        if(storedTasksCopy[i].id == task.id){
                        storedTasksCopy.splice(i, 1);
                        }
                    }
                }
            }
            // Remove from the DOM tree the task which corresponds to the deletion button that has been clicked
            Util.removeElementFromDOM([currentTarget.parentNode]);
            deletionCallback(currentTarget);
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
        deleteButtonImg.setAttribute("src", "./images/deleteButton.png");
        deleteButtonImg.dataset.credits = "This image is published under the Creative Commons Public Domain 1.0, the original image can be found on the website Free SVG : https://freesvg.org/img/TzeenieWheenie_red_green_OK_not_OK_Icons_1.png . Many thanks to them." ;
        deleteButtonImg.setAttribute("alt", "Supprimer cette tâche");
        deleteButton.appendChild(deleteButtonImg);
        deleteButton.setAttribute("href", "#");
        deleteButton.classList.add("section__singleTask__deleteButton");
        deleteButton.dataset.taskId = this.id;
        this.deleteButton = deleteButton ;

        task.appendChild(nameElement);
        task.appendChild(description);
        task.appendChild(deleteButton);
        
        return task ;
    }

}
