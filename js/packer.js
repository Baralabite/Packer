var cellDragging = false;
var startingPos = [];
var dragOrientation = "";
var dragCorner = "";
var draggedCell;
var createdChild;

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

function Cell(root, parent) {
    this.root = root;
    this.parent = parent;

    this.element = document.createElement("div");


    this.element.setAttribute("style", "position: absolute;");

    var color = "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")";
    this.element.style.backgroundColor = color;

    if(parent == null){
        this.element.style.width = this.root.offsetWidth.toString() + "px";
        this.element.style.height = this.root.offsetHeight.toString() + "px";
    } else {
        this.element.style.width = parent.element.offsetWidth.toString() + "px";
        this.element.style.height= parent.element.offsetHeight.toString() + "px";
    }


    this.root.appendChild(this.element);

    this.addPullTabs();
    this.addListeners();

    this.children = [];
}

Cell.prototype.addPullTabs = function(){
    this.pullTabNE = document.createElement("img");
    this.pullTabNE.src = "images/pull_tab_ne.png";
    this.pullTabNE.style.position = "absolute";
    this.pullTabNE.style.top = "0pt";
    this.pullTabNE.style.left = ((this.element.offsetLeft + this.element.offsetWidth) - 16) + "px";
    this.pullTabNE.height = "16";
    this.pullTabNE.width = "16";
    this.pullTabNE.style.cursor = "crosshair";
    this.pullTabNE.style.zIndex = "10";
    this.element.appendChild(this.pullTabNE);
    
    this.pullTabSW = document.createElement("img");
    this.pullTabSW.src = "images/pull_tab_sw.png";
    this.pullTabSW.style.position = "absolute";
    this.pullTabSW.style.left = "0pt";
    this.pullTabSW.style.top = ((this.element.offsetTop + this.element.offsetHeight) - 16)+"pt";
    this.pullTabSW.height = "16";
    this.pullTabSW.width = "16";
    this.pullTabSW.style.cursor = "crosshair";
    this.pullTabSW.style.zIndex = "10";
    this.element.appendChild(this.pullTabSW);
};

Cell.prototype.addListeners = function(){

    console.log("Adding listeners!");
    var scope = this;

    this.pullTabNE.onmousedown = function(e){
        e.preventDefault();
        cellDragging = true;
        startingPos = [e.pageX, e.pageY];
        dragCorner = "NE";
        draggedCell = scope;
    };

    this.pullTabSW.onmousedown = function(e){
        e.preventDefault();
        cellDragging = true;
        startingPos = [e.pageX, e.pageY];
        dragCorner = "SW";
        draggedCell = scope;
    };

    document.onmousemove = function(e){
        if(cellDragging){
            var distance = getDistance(startingPos, [e.pageX, e.pageY]);
            if(distance > 20 && dragOrientation == "") {
                var deltaX = Math.abs(startingPos[0] - e.pageX);
                var deltaY = Math.abs(startingPos[1] - e.pageY);

                if (deltaX > deltaY) {

                    dragOrientation = "horizontal";
                    if((startingPos[0] - e.pageX) > 0) {                    //Dragging cursor left
                        if(dragCorner == "NE"){                             //Dragged from NE
                            console.log("Create div left!");

                            console.log(draggedCell);
                            draggedCell.createChild();

                        } else if (dragCorner == "SW"){                     //Dragged from SW
                            console.log("Join div left!");
                        }
                    } else {                                                //Dragging cursor right
                        if(dragCorner == "NE"){                             //Dragged from NE
                            console.log("Join div right!");
                        } else if (dragCorner == "SW"){                     //Dragged from SW
                            console.log("Create div right!");
                        }
                    }

                } else {

                    dragOrientation = "vertical";
                    if ((e.pageY - startingPos[1]) > 0) {                   //Dragging cursor down
                        if(dragCorner == "NE") {                            //Dragged from NE
                            console.log("Create div down!");
                        } else if (dragCorner == "SW"){                     //Dragged from SW
                            console.log("Join div down!");
                        }
                    } else {                                                //Dragging cursor up
                        if(dragCorner == "NE") {                            //Dragged from NE
                            console.log("Join div up!");
                        } else if (dragCorner == "SW"){                     //Dragged from SW
                            console.log("Create div up!");
                        }
                    }
                }
            }
        }

        if(createdChild){
            if(dragOrientation == "horizontal"){

                //draggedCell.element.style.width = (e.pageX - parseInt(draggedCell.element.style.left).toString()) + "%";
                draggedCell.element.style.width = "50%";

                createdChild.element.style.width = "100px";
                createdChild.element.style.height = "100px";
                createdChild.element.style.backgroundColor = "#FFFF00";
                createdChild.element.style.top = "0px";
                createdChild.element.style.left = e.pageX.toString()+"px";
            }
        }
    };

    document.onmouseup = function(e){
        cellDragging = false;
        startingPos = [];
        dragOrientation = "";
        createdChild = null;
    };
};

Cell.prototype.createChild = function(){
    createdChild = new Cell(this.root, this);
    this.children.push(createdChild);
};




/*
    document.onmousemove = function(e){

        if(packerDragging) {
            var distance = getDistance(startingPos, [e.pageX, e.pageY]);

            if (distance > 30 && orientation == "") {
                var deltaX = Math.abs(startingPos[0] - e.pageX);
                var deltaY = Math.abs(startingPos[1] - e.pageY);

                if (deltaX > deltaY) {
                    orientation = "horizontal";
                } else {
                    orientation = "vertical";
                }

                newDiv = createChild(rootDiv);
            }

            if (newDiv) {
                var root = document.getElementById(rootDiv);

                var left = e.pageX+10;
                var top = 0;
                var height = root.offsetHeight;
                var width = root.offsetWidth-left-10;
                newDiv.setAttribute("style", "position: absolute; left: " + left + "px; top: " + top +"px; height: "+height+"px; width: "+width+"px; background-color: #FFFF00;");

                root.setAttribute("style", "top: 0px; left: 0px; height: 100%; width: "+(left)+"px");
                console.log(root);

            }
        }
    };

    document.onmouseup = function(e){
        packerDragging = false;
        orientation = "";
        newDiv = false;
    };

    document.getElementById(div).appendChild(elem);
    console.log(elem);
    return elem;
}

function createChild(div){
    if(orientation == "horizontal"){

        var div = document.createElement("div");
        div.style.backgroundColor = "#FF0000";//"rgb("+Math.random()+","+Math.random()+","+Math.random()+")";
        document.getElementById(rootDiv).appendChild(div);
        return div;

    } else if(orientation == "vertical"){

    }
}*/

function getDistance(pos1, pos2){
    return Math.sqrt(Math.pow((pos1[0]-pos2[0]), 2) + Math.pow((pos1[1]-pos2[1]), 2))
}