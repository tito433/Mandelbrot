var size = 600;//window.innerHeight || document.documentElement.clientHeight	|| document.body.clientHeight;
var ctx=false;
var canvasImage =false;
var pixels=[];

function setup(){
	var canvas = document.getElementById('canvas');
    canvas.width = canvas.height=size;
    ctx = canvas.getContext('2d');
    canvasImage = ctx.createImageData(size,size);
    pixels=canvasImage.data;
}

function draw(){

	for(var x=0;x<size;x++){
		for(var y=0;y<size;y++){

			var a=map(x,0,size,-2,2);
			var b=map(y,0,size,-2,2);
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

			var pix=(x+y*size) * 4;
			pixels[pix+0]=bright;
			pixels[pix+1]=bright;
			pixels[pix+2]=bright;
			pixels[pix+3]=255;
		}
	}
	ctx.putImageData(canvasImage, 0, 0);
}
function map(x, a, b, c, d) {
    return  (x-a)/(b-a) * (d-c) + c;
}

setup();
draw();