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

	// I will need geometry
	geometry = (function () {

		var geoArray = [],
		meshArray = [],
		geo,
		mesh,
		i = 0,

		pos = [

			[-3, 0, 0, 1.57, 0, 0, 1, 1, 3],
			[0, 3, -3, 0, 0.75, 0, 1, 1, 1],
			[3, 0, 0, 0, 0, 0, 1, 1, 3]

		];
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
			meshArray.push(mesh);

			scene.add(mesh);
			i++;
		}

	}
		()),

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
				//ax.radian2 += 0.01;
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

				camera.rotation.y = ax.radian1;
				camera.rotation.x = Math.PI * 2 - ax.radian2;

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

		CAM.step();
		CAM.update(camera);

	};

	start();

}
	());