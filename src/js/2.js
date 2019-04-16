
        var timer = document.getElementById('timer');
        var content = document.getElementById('content');


        var raycaster;
        var mouse = new THREE.Vector2();



        var scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xf0f0f0 );



        // var SCREEN_WIDTH = 1200; // window.innerWidth;
        // var SCREEN_HEIGHT = 900; // window.innerHeight;
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;

        var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

        var camera = new THREE.PerspectiveCamera( 50, aspect, 0.1, 1000 );
        camera.position.set( -19, 25, 28 );
        camera.rotation.set( -0.78, -0.41, -0.38 );

        var controls = new THREE.OrbitControls( camera );
        controls.update();

        
        var cameraFloor1 = new THREE.PerspectiveCamera( 110, aspect, 0.1, 11 );
        cameraFloor1.position.set( 0, 9.9, 0 );
        cameraFloor1.rotation.x = -Math.PI / 2;
        scene.add(cameraFloor1);

        var cameraFloor2 = new THREE.PerspectiveCamera( 110, aspect, 0.1, 11 );
        cameraFloor2.position.set( 0, 19.9, 0 );
        cameraFloor2.rotation.x = -Math.PI / 2;
        scene.add(cameraFloor2);


        // cameras = new THREE.ArrayCamera( [cameraFloor1, cameraFloor2] );
        // camera.position.z = 3;




        scene.add( new THREE.AmbientLight( 0xf0f0f0 ) );
        // var light = new THREE.DirectionalLight();
        // light.position.set( 0.5, 0.5, 1 );
        // light.castShadow = true;
        // light.shadow.camera.zoom = 4; // tighter shadow map
        // scene.add( light );

        // var helper = new THREE.GridHelper( 30, 30 );
        // helper.material.opacity = 0.25;
        // helper.material.transparent = true;
        // scene.add( helper );




        // textures
        var map = new THREE.TextureLoader().load( 'assets/floor1.jpg' );
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        var material = new THREE.MeshPhongMaterial( { map: map, side: THREE.DoubleSide, transparent: true } );
        material.opacity = 0.6;
        floor1Mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 30, 16 ), material );
        floor1Mesh.position.set( -0.5, -0.1, -0.5 );
        floor1Mesh.rotation.x = Math.PI / 2;
        scene.add( floor1Mesh );
        
        // textures
        var map = new THREE.TextureLoader().load( 'assets/floor2.jpg' );
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        var material = new THREE.MeshPhongMaterial( { map: map, side: THREE.DoubleSide, transparent: true } );
        material.opacity = 0.6;
        floor2Mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 30, 16 ), material );
        floor2Mesh.position.set( -0.5, 10-0.1, -0.5 );
        floor2Mesh.rotation.x = Math.PI / 2;
        scene.add( floor2Mesh );



        const labelPoint = drawPoint(0);

        var labelDiv = document.createElement( 'div' );
        labelDiv.className = 'label';
        labelDiv.textContent = 'Person';
        labelDiv.style.marginTop = '-1em';

        var label = new THREE.CSS2DObject( labelDiv );
        labelPoint.add( label );
        scene.add(labelPoint)


        // renderer
        var labelRenderer = new THREE.CSS2DRenderer();
        labelRenderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = 0;
        document.body.appendChild( labelRenderer.domElement );

        var	renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( aspect );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        renderer.setClearColor(0x000000, 0);
        document.body.appendChild( renderer.domElement );

        renderer.autoClear = false;




        // var geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
        // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // var cube = new THREE.Mesh( geometry, material );
        // cube.position.set(10, 0, 0);
        // scene.add( cube );

        var params = {
            reset() {
                current = 0;
                this.timestamp = 40000;
            },
            timestamp: 40000,
            ratio: 24,
            auto: true
        };
        // GUI
        var gui = new dat.GUI();

        gui.add( params, 'reset' );
        gui.add( params, 'timestamp', 20000, 70000 ).step( 10 );
        gui.add( params, 'ratio', 1, 60 ).step( 1 );
        gui.add( params, 'auto' );
        gui.open();




        function onDocumentMouseMove( event ) {
            // event.preventDefault();

            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        }
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );






        createPointsPool();

        raycaster = new THREE.Raycaster();
        raycaster.params.Points.threshold = 0.1;




        var current = 0;

        var animate = function () {
            requestAnimationFrame( animate );

            raycaster.setFromCamera( mouse, camera );

            var intersections = raycaster.intersectObjects( pointsPool );
            intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;

            if (intersection !== null) {
                console.log(intersection);
                labelPoint.position.copy(intersection.point);
                labelDiv.textContent = 'ID: ' + intersection.object.userData.log.id;
            }


            let { timestamp, auto, ratio } = params;

            draw();

            timer.textContent = `
                ${Math.floor(timestamp/3600)}
                :
                ${Math.floor(timestamp%3600/60)}
                :
                ${timestamp%60}
            `;
            content.textContent = `
                当前总人数：${lastPointsNum}
                
            `

            if (auto) {
                params.timestamp += ratio;
            }


            renderer.clear();

            renderer.setViewport( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
            renderer.render( scene, camera );
            labelRenderer.render( scene, camera );

            // // renderer.setViewport( 0, 0, 400, 300 );
            // renderer.setViewport( 0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
            // renderer.render( scene, cameraFloor1 );

            // // renderer.setViewport( 400, 0, 400, 300 );
            // renderer.setViewport( SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
            // renderer.render( scene, cameraFloor2 );
        };

        animate();
