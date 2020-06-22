const DndHandler = {
    
    dragged : null,
    
    setListeners(elemToDrags, destinations, callback){
        for(let elemToDrag of elemToDrags){
            this.applyDragEvents(elemToDrag);
        }
    
        for(let destination of destinations){
            this.applyDropEvents(destination, callback);
        }
    },

    applyDragEvents(elemToDrag) {
        elemToDrag.setAttribute("draggable", "true");
        elemToDrag.addEventListener("dragstart", (e) => {
            this.dragged = e.currentTarget ;
            e.dataTransfer.setData("text/plain", "");
        });
    },
    applyDropEvents(destination, callback) {
        destination.addEventListener("dragover", (e)=>{
            e.preventDefault();
            e.currentTarget.classList.add("dragovered");
        });
        destination.addEventListener("dragleave", (e)=>{
            e.preventDefault();
            e.currentTarget.classList.remove("dragovered");
        });

        destination.addEventListener("drop", (e)=>{
            e.currentTarget.classList.remove("dragovered");
            let target = e.currentTarget,
            draggedElement = this.dragged;
            let clonedElement = draggedElement.parentNode.removeChild(draggedElement);
            let setclonedElement = target.appendChild(clonedElement);
            this.applyDragEvents(setclonedElement);
            callback(e.currentTarget, this.dragged);
        });
    }
}
