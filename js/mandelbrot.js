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

	this.setup=function(){
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

	this.setup();
	
}