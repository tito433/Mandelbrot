var Mouse=function(canvas){
	if (!(this instanceof Mouse)){
         return new Mouse(canvas);
     }
    if(undefined === canvas){
    	throw "Undefined canvas!!!! Nothing for mouse...";
    }


    this.bounds=canvas.getBoundingClientRect();
    this._isDown=false;
    this.prevCords={x:0,y:0};
    this._evt=[];


    this._onClickDown=function(e){
    	this._isDown=true;
    	this.prevCords=this._getMousePos(e);
    }
    this._onMove=function(e){
    	if(this._isDown && this._evt['drag']){
    		var cp=this._getMousePos(e);
    		var delta={x:this.prevCords.x-cp.x,y:this.prevCords.y-cp.y};
    		this.prevCords=cp;
    		this._callEvt("drag",delta);

    	}
    }
    this._onClickUp=function(e){
    	this._isDown=false;
    }
    this._onCancel=function(e){
    	this._isDown=false;
    }

    this._callEvt=function(key,e){
    	if(this._evt && this._evt[key]){
    		this._evt[key].forEach(function(elem,idx){
    			elem(e);
    		});
    	}
    }
    this.on=function(evtName,callBack){
    	if(this._evt.length>0){
    		if(this._evt[evtName]){
    			this._evt[evtName].push(callBack);
    			return true;
    		}
    	}
    	
    	this._evt[evtName]=[callBack];
    	return true;
    }
    this._getMousePos=function(evt) {
        return {
          x: evt.clientX - this.bounds.left,
          y: evt.clientY - this.bounds.top
        };
      }

    //click down
    canvas.addEventListener("mousedown", this._onClickDown.bind(this), false);
    canvas.addEventListener("touchstart", this._onClickDown.bind(this), false);
    //move
    canvas.addEventListener("mousemove", this._onMove.bind(this), false);
    canvas.addEventListener("touchmove", this._onMove.bind(this), false);
    //click up
    canvas.addEventListener("mouseup", this._onClickUp.bind(this), false);
    canvas.addEventListener("touchend", this._onClickUp.bind(this), false);
    canvas.addEventListener("touchcancel", this._onCancel.bind(this), false);
}

var Mandelbrot=function(canvas){
	if (!(this instanceof Mandelbrot)){
         return new Mandelbrot(canvas);
     }
    if(undefined === canvas){
    	throw "Undefined canvas!!!! Nothing to show...";
    }

	this.size = canvas.width;
	this.ctx= canvas.getContext('2d');;
	this.image =this.ctx.createImageData(this.size,this.size);
	/* If you write any private function like this:
			var draw=function(){}
		then it will have a global scope of window. i.e. this will reffer to window
	*/
	this.setup=function(){
		this.zoom=1;
		this.view=[-2,2,-2,2];
		this.draw();
	}

	this.draw=function(){

		for(var x=0;x<this.size;x++){
			for(var y=0;y<this.size;y++){

				var a=this.map(x,0,this.size,this.view[0],this.view[1]);
				var b=this.map(y,0,this.size,this.view[2],this.view[3]);
				var ca=a;
				var cb=b;
				var bright=255;

				while(bright>0){
					var aa=a*a-b*b,
						bb=2*a*b;
					a=aa+ca;
					b=bb+cb;

					if(Math.abs(a+b)>2) break;
					
					bright--;
				}

				var pix=(x+y*this.size) * 4;
				this.image.data[pix+0]=bright;
				this.image.data[pix+1]=bright;
				this.image.data[pix+2]=bright;
				this.image.data[pix+3]=255;
			}
		}
		this.ctx.putImageData(this.image, 0, 0);
	}
	this.map=function(x, a, b, c, d) {
	    return  (x-a)/(b-a) * (d-c) + c;
	}

	this.onDrag=function(delta){
		var px=(delta.x/this.size ) * (Math.abs(this.view[0])+Math.abs(this.view[1])),
			py=(delta.y/this.size ) * (Math.abs(this.view[2])+Math.abs(this.view[3]));
		
		this.view[0]+=px;
		this.view[1]+=px;
		this.view[2]+=py;
		this.view[3]+=py;
		this.draw();
	}

	this.mouse=new Mouse(canvas);

	this.setup();
	//set drag event.
	this.mouse.on('drag',this.onDrag.bind(this));
	
}