(function () {

    var config = {
		
		width: 640,
		height: 480
		
	},

	// I need a three.js scene
	scene = new THREE.Scene(),

	// I need a three.js camera
	//camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 100),
	camera = new THREE.PerspectiveCamera(100, config.width / config.height, 0.1, 100),

	// I will need a three.js renderer
	renderer = new THREE.WebGLRenderer(),

	// I will need three.js Materials
	Face = new THREE.MeshBasicMaterial({

			color : '#00af00'

	}),

	Wire = new THREE.LineBasicMaterial({

			color : '#ffffff'

	}),

	// I will need three.js geometry, and Mesh
	Mesh = (function () {

		var geoArray = [],
		objArray = [],
		geo,
		mesh,
		
		frame = 0,
		maxFrame= 200,
		up = true,
		
		i = 0,

		pos = [

			[0, 0, 0, 1.57, 0, 0, 5, 1, 1],
			[0, 0, 0, 1.57, 0, 0, 7, 1, 1]

		],
		
		dConfig = [
		
		    {cx:-8,cy:-3,rMove:0.5,l:2.5},
			{cx:0,cy:0,rMove:1.5, cPointFrom:0,l:3.5},
			{}
		
		],
		
		
		DispObj = function(mesh, config){
			
			this.mesh = mesh;
			
			console.log(this.mesh);
			
			this.config = {
				
				rx:0, ry:0, rz:0,cPointFrom:-1
				
			};
			
			for(var prop in config){
				
				this.config[prop] = config[prop];
				
			}
			
		};
		
		DispObj.prototype = {
			
			setByFrame : function(frame, maxFrame){
				
				var per = frame / maxFrame, obj;
				
				
				if(this.config.cPointFrom > -1){
					
					obj = objArray[this.config.cPointFrom];
					
					//this.config.cx = Math.cos(obj.config.rMove * per) * 5 + obj.config.cx;
					//this.config.cy = Math.sin(obj.config.rMove * per) * 5 + obj.config.cy;
					
					this.config.cx = Math.cos(obj.config.rMove * per) * (obj.config.l*2) + obj.config.cx;
					this.config.cy = Math.sin(obj.config.rMove * per) * (obj.config.l*2) + obj.config.cy;
					
				}
				
				this.mesh.rotation.y = this.config.rMove * per;
				this.mesh.position.x = Math.cos(this.config.rMove * per) * this.config.l + this.config.cx;
				this.mesh.position.y = Math.sin(this.config.rMove * per) * this.config.l + this.config.cy;
				
				
			},
			
			step : function(){
				
				
				this.mesh.rotation.x += this.config.rx;
				this.mesh.rotation.y += this.config.ry;
				this.mesh.rotation.z += this.config.rz;
					
				if(this.mesh.rotation.x >= Math.PI*2){this.mesh.rotation.x -= Math.PI*2;}
				if(this.mesh.rotation.y >= Math.PI*2){this.mesh.rotation.y -= Math.PI*2;}
				if(this.mesh.rotation.z >= Math.PI*2){this.mesh.rotation.z -= Math.PI*2;}
					
				
			}
			
		}
		
		
		while (i < pos.length) {

			geo = new THREE.BoxGeometry(pos[i][6], pos[i][7], pos[i][8]);

			mesh = new THREE.Object3D();
			mesh.add(new THREE.Mesh(geo, Face));
			mesh.add(new THREE.Line(geo, Wire));

			mesh.position.x = pos[i][0];
			mesh.position.y = pos[i][1];
			mesh.position.z = pos[i][2];
			mesh.rotation.x = pos[i][3];
			mesh.rotation.y = pos[i][4];
			mesh.rotation.z = pos[i][5];

			geoArray.push(geo);
			objArray.push(new DispObj(mesh, dConfig[i]));

			scene.add(mesh);
			i++;
		}
		
		return {
			
			obj : objArray,
			
			step : function(){
				
				
				
				var i=0, len = this.obj.length, obj;
				
				
				if(up){frame++;}else{frame--;}
				if(frame === maxFrame || frame === 0){
					
					up = !up;
					
				}
				
				while(i < len){
					
					obj = this.obj[i];
					
					//obj.step();
					obj.setByFrame(frame, maxFrame);
					
					i++;
				}
				
				
			}
			
			
		};

	}()),

	// camera update module
	CAM = (function () {

		var ax = {
			radian1 : -1.57/2,
			radian2 : 0
		},
		fp = {
			x : 0,
			y : 0,
			z : 0
		},
		distance = 10;

		return {

			step : function () {

				ax.radian1 += 0.01;
				ax.radian2 += 0.01;
				if (ax.radian1 >= Math.PI * 2) {
					ax.radian1 -= Math.PI * 2;
				}
				if (ax.radian2 >= Math.PI * 2) {
					ax.radian2 -= Math.PI * 2;
				}

			},

			update : function (camera) {

				camera.position.x = Math.sin(ax.radian1) * distance + fp.x;
				camera.position.y = Math.sin(ax.radian2) * distance + fp.y;
				camera.position.z = Math.cos(ax.radian1) * distance + fp.z;

                // camera.lookAt can be used to set orientation
				camera.lookAt(new THREE.Vector3(fp.x,fp.y,fp.z));
				
				
				distance = Math.abs(ax.radian1 - Math.PI) / Math.PI * 10 + 5

			}
		}

	}()),

	// app start function
	start = function () {

		CAM.update(camera);

		renderer.setSize(config.width, config.height);

		document.body.appendChild(renderer.domElement);

		
		
		loop();
	},

	// main app loop
	loop = function () {

		requestAnimationFrame(loop);
		renderer.render(scene, camera);

		// step Mesh
		Mesh.step();
		
		// step cam
		//CAM.step();
		//CAM.update(camera);

	};

	start();

}
	());