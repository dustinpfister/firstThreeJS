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
		i = 0,

		pos = [

			[-3, 0, 0, 1.57, 0, 0, 1, 1, 3],
			[0, 3, -3, 0, 0.75, 0, 1, 1, 1],
			[3, 0, 0, 0, 0, 0, 1, 1, 3]

		],
		
		deltas = [
		
		    {rx: 0.1,rz:0.00125},
			{ry:0.1},
			{rx:0.025,ry:0.05,rz:0.0125}
		
		],
		
		
		DispObj = function(mesh, delta){
			
			this.mesh = mesh;
			
			this.delta = {
				
				rx:0, ry:0, rz:0
				
			};
			
			for(var prop in delta){
				
				this.delta[prop] = delta[prop];
				
			}
			
		};
		
		DispObj.prototype = {
			
			step : function(){
				
				
				this.mesh.rotation.x += this.delta.rx;
				this.mesh.rotation.y += this.delta.ry;
				this.mesh.rotation.z += this.delta.rz;
					
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
			objArray.push(new DispObj(mesh, deltas[i]));

			scene.add(mesh);
			i++;
		}
		
		return {
			
			obj : objArray,
			
			step : function(){
				
				var i=0, len = this.obj.length, obj;
				
				while(i < len){
					
					obj = this.obj[i];
					
					obj.step();
					
					i++;
				}
				
				
			}
			
			
		};

	}()),

	// camera update module
	CAM = (function () {

		var ax = {
			radian1 : 0,
			radian2 : 0
		},
		fp = {
			x : 0,
			y : 0,
			z : 0
		},
		distance = 5;

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
		CAM.step();
		CAM.update(camera);

	};

	start();

}
	());