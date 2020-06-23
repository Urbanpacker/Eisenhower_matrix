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

    renderElement(){
        let task = document.createElement("div");
        task.id = "TaskNumber" +this.id;
        task.dataset.id = this.id;
        task.dataset.type = this.type ;
        task.classList.add("section__singleTask");
        task.setAttribute("draggable", "true");

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
        deleteButton.setAttribute("href", "#");
        deleteButton.dataset.taskId = this.id;
        deleteButton.dataset.elemType = "deleteButton";
        deleteButton.id = "deleteTask"+this.id;
        deleteButton.appendChild(deleteButtonImg);
        this.deleteButton = deleteButton ;

        const editButton = document.createElement("a");
        const editButtonImg = document.createElement("img");
        editButtonImg.setAttribute("src", "./images/editButton.svg");
        editButtonImg.dataset.credits = "This image is published under the Creative Commons Public Domain 1.0, the original image can be found on the website Free SVG : https://freesvg.org/hb-pencil-vector-image . Many thanks to them." ;
        editButtonImg.setAttribute("alt", "Modifier cette tâche");
        editButton.setAttribute("href", "#");
        editButton.dataset.taskId = this.id;
        editButton.dataset.elemType = "editButton";
        editButton.id = "editTask"+this.id;
        editButton.appendChild(editButtonImg);
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
