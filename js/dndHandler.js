class DndHandler {
    
    static setListeners(elemToDrags, destinations, callback){
        for(let elemToDrag of elemToDrags){
            DndHandler.applyDragEvents(elemToDrag);
        }
    
        for(let destination of destinations){
            DndHandler.applyDropEvents(destination, callback);
        }
    }

    static applyDragEvents(elemToDrag) {
        elemToDrag.setAttribute("draggable", "true");
        elemToDrag.addEventListener("dragstart", (e) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text", e.target.getAttribute("id"));
        });
    }
    
    static applyDropEvents(destination, callback) {
        destination.addEventListener("dragover", (e)=>{
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            e.currentTarget.classList.add("dragovered");
        });
        destination.addEventListener("dragleave", (e)=>{
            e.preventDefault();
            e.currentTarget.classList.remove("dragovered");
        });

        destination.addEventListener("drop", (e)=>{
            e.preventDefault();
            e.currentTarget.classList.remove("dragovered");
            let target = e.currentTarget ;
            let data = e.dataTransfer.getData("text");
            let draggedElement = document.getElementById(data) ;
            let clonedElement = draggedElement.parentNode.removeChild(draggedElement);
            let setclonedElement = target.appendChild(clonedElement);
            this.applyDragEvents(setclonedElement);
            callback(e.currentTarget, draggedElement);
        });
    }
}
