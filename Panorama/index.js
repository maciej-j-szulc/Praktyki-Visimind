var camera, scene, renderer;

			var isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 0, onMouseDownLon = 0,
			lat = 0, onMouseDownLat = 0,
			phi = 0, theta = 0;

			init();
			animate();

			function init() {

				var container, mesh;
				
				container = document.getElementById( 'container' );

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
				camera.target = new THREE.Vector3( 0, 0, 0 );

				scene = new THREE.Scene();

				var geometry = new THREE.SphereGeometry( 500, 60, 40 );
				geometry.scale(  -1, 1, 1 );

				var material = new THREE.MeshBasicMaterial( {
					map: new THREE.TextureLoader().load( 'img360.jpg' )
				} );

				mesh = new THREE.Mesh( geometry, material );

				scene.add( mesh );

				const sphereGeometry = new THREE.SphereGeometry( 0.5, 32, 16 );
				const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
				const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
				sphere.position.set(-9,0,5);
				sphere.addEventListener('click',function(){
					window.open("https://oceana.org/", "_blank")
				});
				scene.add( sphere );



				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				//klik myszki
				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				//najechanie myszką
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				//puszczenie klawisza myszki
				document.addEventListener( 'mouseup', onDocumentMouseUp, false );
				//scrollowanie
				document.addEventListener( 'wheel', onDocumentMouseWheel, false );


				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseDown( event ) {

				event.preventDefault();

				isUserInteracting = true;

				onPointerDownPointerX = event.clientX;
				onPointerDownPointerY = event.clientY;

				onPointerDownLon = lon;
				onPointerDownLat = lat;

			}

			function onDocumentMouseMove( event ) {

				if ( isUserInteracting === true ) {

					lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
					lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

				}

			}

			function onDocumentMouseUp( event ) {

				isUserInteracting = false;

			}

			//zmienia field of view przy scrollowaniu 
			function onDocumentMouseWheel( event ) {

				camera.fov += event.deltaY * 0.05;
				camera.updateProjectionMatrix();

			}

			function animate() {

				requestAnimationFrame( animate );
				update();

			}

			function update() {
				//obrót kamery w prawo jeśli użytkownik nic nie robi
				if ( isUserInteracting === false ) {

					lon += 0.1;

				}

				lat = Math.max( - 85, Math.min( 85, lat ) );
				phi = THREE.Math.degToRad( 90 - lat );
				theta = THREE.Math.degToRad( lon );

				camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
				camera.target.y = 500 * Math.cos( phi );
				camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

				camera.lookAt( camera.target );

				/*
				// distortion
				camera.position.copy( camera.target ).negate();
				*/

				renderer.render( scene, camera );

			}

