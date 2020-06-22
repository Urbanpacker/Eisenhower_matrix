class Util {

	static removeElementFromDOM(elements){
		for(let elem of elements){
			elem.remove();
		}
		return elements
	}

	static clone(obj){
	    if (null == obj || "object" != typeof obj) return obj;
	    let copy = obj.constructor();
	    for (let attr in obj) {
	        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	    }
	    return copy;
	}

	static insertBeforeElem(newElement, beforeElement){
	    let parent = beforeElement.parentNode;
	    parent.insertBefore(newElement, beforeElement)
	}

	static insertAfter(newElement, afterElement){
	    var parent = afterElement.parentNode;
	    if(parent.lastChild === afterElement){   
	    // If the last element is the one after which we want to insert it, then we use appendChild()
	        parent.appendChild(newElement);
	    } else {
	    // In the opposite case, we use insertBefore() onto the element following the afterElement  
	        parent.insertBefore(newElement, afterElement.nextSibling)
	    }
	}

	static lcFirst = (str) => {
	  if (str.length > 0) {
	    return str[0].toLowerCase() + str.substring(1);
	  } else {
	    return str;
	  }
	}

	static ucFirst(str){
	  if (str.length > 0) {
	    return str[0].toUpperCase() + str.substring(1);
	  } else {
	    return str;
	  }
	}

	static loadDataFromDomStorage(name, typeOfStorage){
	    var jsonData;
	    if(typeOfStorage === 'local'){
	        jsonData = window.localStorage.getItem(name);
	    } else {
	        jsonData = window.sessionStorage.getItem(name);
	    }     
	    return JSON.parse(jsonData);
	}

	static removeDataFromDomStorage(name, typeOfStorage){
	    if(typeOfStorage === 'local'){
	        window.localStorage.removeItem(name);
	    } else {
	        window.sessionStorage.removeItem(name);
	    }     
	}
	
	static saveDataToDomStorage(name, data, typeOfStorage){
	    var jsonData = JSON.stringify(data);
	    if(typeOfStorage === 'local'){
			window.localStorage.setItem(name, jsonData);
	    } else {
	        window.sessionStorage.setItem(name, jsonData);
	    }     
	}

}
