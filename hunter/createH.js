function setHunters(){

	//hunters.push(new Hunter(new THREE.Vector3(-70, 0, 70)));
	//hunters.push(new Hunter(new THREE.Vector3(50, 0, 50)));
	//6.1
	hunters.push(new Hunter(new THREE.Vector3(0, 0, -20)));
	hunterIcon = new THREE.Mesh( new THREE.SphereBufferGeometry(5, 32, 32) , new THREE.MeshLambertMaterial({color:'red'}) ) ;
	scene2.add(hunterIcon);
}

function createHunter(){

	for (var i = 0; i < 19 ; i++) {
		var row = [] ;
		for (var j = 0; j < 31 ; j++)
		  row.push(new THREE.Vector2(j * 0.0333, 1 - 0.05555 * i));
		hunterSpriteArray.push(row);
	}
	  
	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(-10, -12, 0),
		new THREE.Vector3(10, -12, 0),
		new THREE.Vector3(10, 12, 0),
		new THREE.Vector3(-10, 12, 0)
	);

	var face;
	geometry.faces.push( new THREE.Face3(0, 1, 2) );
	geometry.faces.push( new THREE.Face3(0, 2, 3));
		  
	geometry.faceVertexUvs[0][0] = [hunterSpriteArray[10][12].clone(), hunterSpriteArray[10][13].clone(), hunterSpriteArray[10][13].clone()] ;
	geometry.faceVertexUvs[0][1] = [hunterSpriteArray[9][12].clone(), hunterSpriteArray[9][13].clone(), hunterSpriteArray[9][12].clone()] ;

	  
	var hunterMesh = new THREE.Mesh(geometry ) ;
	
	// instantiate a loader	
	var loader = new THREE.TextureLoader();
	  loader.setCrossOrigin('');
		// load a resource
		loader.load(
			// resource URL		
		'https://i.imgur.com/gSp6yHN.png',
		// Function when resource is loaded
			function ( texture ) {
				// do something with the texture
				//texture.wrapS = THREE.RepeatWrapping;;
				hunterMesh.material = new THREE.MeshBasicMaterial( {
					map: texture,
					transparent: true,  // cutout texture: set transparent: true
					side: THREE.DoubleSide
				} );
			},
		// Function called when download progresses
		function ( xhr ) {
		  console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		// Function called when download errors
		function ( xhr ) {
		  console.log( 'An error happened' );
		}
	  );
    
	return hunterMesh ;
}

var Hunter = function(initPos){
  
	this.pos = new THREE.Vector3();
	if (initPos) this.pos.copy(initPos);
	this.vel = new THREE.Vector3( 1 , 0 , 0 );
	this.force = new THREE.Vector3();
	this.angle = 0;
	this.tmp = 0;
	this.maxSpeed = 10;
	this.maxForce = 10;
	this.mesh = createHunter();
	scene.add(this.mesh);
	this.mesh.position.set(this.pos.x , 8 , this.pos.z);
	this.target = new THREE.Vector3();
	this.find = false ; 
	this.sightN = 21 ; //5.7
	this.sightD = 150 ; // 5.7
	this.getStrength = false ;
	this.clock = new THREE.Clock() ;
	
	this.sprite = new SpriteText2D( "Hunter : Stand", {
		align: textAlign.center,
		font: '40px Consolas',
		fillStyle: '#ff0000',
		antialias: true
	}); 
	this.sprite.scale.set(0.2 , 0.2 , 0.2);
	this.mesh.add(this.sprite);
	this.sprite.position.y = 20;

	this.fsm = hunterFSM(this.mesh, this.sprite);
	
	//6.1
	this.computeForceP = function(dt){
				  
		this.vel = this.target.clone().sub(this.pos);
				
		for( var i = 0 ; i < obstacles.length ; i++ ){  // 碰撞偵測
			if( obstacles[i].pos.distanceTo(this.pos) <= Math.max(obstacles[i].boxX , obstacles[i].boxZ) + 10 ){
				this.vel = this.vel.clone().sub (collisionDetection( this.pos.x   , this.pos.z   , i  , 10 , this.vel.clone() )  );
			}
		}	
		
		// velocity clamping
		if (this.vel.length() > this.maxSpeed)
			this.vel.setLength(this.maxSpeed);
		
		this.pos.add(this.vel.clone().multiplyScalar(dt));
		this.pos.y = 0 ;
	  
		if (this.vel.length() > 0.001) {
			this.angle = Math.atan2(-this.vel.z, this.vel.x);
		}
		  
		this.mesh.position.set(this.pos.x , 9 , this.pos.z);
		
	}
	
	this.computeForceS = function(dt){
				
		this.force =  this.target.clone().sub(this.pos).setLength(this.maxSpeed).sub(this.vel); 
		
		// force clamping
		if (this.force.length() > this.maxForce)
			this.force.setLength(this.maxForce);
	  
		this.vel.add(this.force.clone().multiplyScalar(dt));
				
		for( var i = 0 ; i < obstacles.length ; i++ ){  // 碰撞偵測
			if( obstacles[i].pos.distanceTo(this.pos) <= Math.max(obstacles[i].boxX , obstacles[i].boxZ) + 10 )
				this.vel = this.vel.clone().sub (collisionDetection( this.pos.x   , this.pos.z   , i  , 10 , this.vel.clone() )  );
		}	
		
		// velocity clamping
		if (this.vel.length() > this.maxSpeed)
			this.vel.setLength(this.maxSpeed);
		
		this.pos.add(this.vel.clone().multiplyScalar(.05));
		this.pos.y = 0 ;
	  
		if (this.vel.length() > 0.001) {
			this.angle = Math.atan2(-this.vel.z, this.vel.x);
		}
		  
		this.mesh.position.set(this.pos.x , 7 , this.pos.z);
		
	}

	this.setRandomTarget = function(){
		// Math.random()*( max - min + 1 ) + min  =   Math.random() * ( 150 - (-150) + 1 ) + (-150)
 		var randomX = Math.random() * groundSize + 1  - groundSize/2;  
		var randomZ = Math.random() * groundSize + 1  - groundSize/2;
		this.target = new THREE.Vector3(randomX , 0 , randomZ);
	}
	
	this.spriteAnimation = function(  base ){
  
		var geometry = this.mesh.geometry;
		
		// 利用 玩家視線正前方 和 獵人前進方向（速度方向） 兩者之間的角度，來計算獵人應顯示的方位
		var playerDirection = new THREE.Vector3( 0 , 0 , -1).applyAxisAngle ( new THREE.Vector3(0 , 1 , 0 ), angle );
		var tmpAngle = playerDirection.clone().angleTo( new THREE.Vector3(this.vel.x, 0 , this.vel.z) ) ;
    
        // 計算兩向量的外積，來判斷獵人顯示方向朝左還是朝右
		var test = playerDirection.clone().cross( new THREE.Vector3(this.vel.x, 0 , this.vel.z)  ) ;

		// 獵人當前方向
		var currentDirection ;

		if(  tmpAngle >= Math.PI/8 &&  tmpAngle < Math.PI/8 * 3 && test.y < 0 ) 
			 currentDirection = 6 + base; // Back , Right
		else  if(  tmpAngle >= Math.PI/8 * 3 &&  tmpAngle <= Math.PI/8 * 5 && test.y < 0 ) 
			 currentDirection = 7 + base; // Right
		else  if(  tmpAngle >= Math.PI/8 * 5 &&  tmpAngle <= Math.PI/8 * 7  && test.y < 0 ) 
			 currentDirection = 8 + base; // Front , Right 
		else  if(  tmpAngle >= Math.PI/8 &&  tmpAngle < Math.PI/8 * 3 && test.y > 0 ) 
			 currentDirection = 4 + base;  // Back , Left
		else  if(  tmpAngle >= Math.PI/8 * 3 &&  tmpAngle <= Math.PI/8 * 5 && test.y > 0 ) 
			 currentDirection = 3 + base;  // Left
		else  if(  tmpAngle >= Math.PI/8 * 5 &&  tmpAngle <= Math.PI/8 * 7  && test.y > 0 ) 
			 currentDirection = 2 + base;  // Front , Left
		else if(  tmpAngle  >= Math.PI/2) 
			 currentDirection = 1 + base;  // Front  
		else 
			 currentDirection = 5 + base;  // Back
		   
		var st0 = hunterSpriteArray[ currentDirection ][ baseH].clone();
		var st1 = hunterSpriteArray[ currentDirection ][baseH + 1].clone();
		var st2 = hunterSpriteArray[ currentDirection - 1 ][baseH + 1].clone();
		var st3 = hunterSpriteArray[ currentDirection - 1 ][baseH].clone();   
	
		geometry.faceVertexUvs[0][0][0].copy(st0);
		geometry.faceVertexUvs[0][0][1].copy(st1);
		geometry.faceVertexUvs[0][0][2].copy(st2);

		geometry.faceVertexUvs[0][1][0].copy(st0);
		geometry.faceVertexUvs[0][1][1].copy(st2);
		geometry.faceVertexUvs[0][1][2].copy(st3);

		geometry.uvsNeedUpdate = true;

		baseH = (baseH + 1) % 30 ;
  
	}
	this.searchAnimation = function(sight){

		var geometry = this.mesh.geometry;
		// 利用 玩家視線正前方 和 獵人前方（速度方向） 兩者之間的角度，來計算獵人應顯示的方位
		var playerDirection = new THREE.Vector3( 0 , 0 , -1).applyAxisAngle ( new THREE.Vector3(0 , 1 , 0 ), angle );
		var tmpAngle = playerDirection.clone().angleTo( new THREE.Vector3(sight.x, 0 , sight.z) ) ;
    
        // 計算兩向量的外積，來判斷獵人顯示方向朝左還是朝右
		var test = playerDirection.clone().cross( new THREE.Vector3(sight.x, 0 , sight.z)  ) ;

		// 獵人當前方向
		var currentDirection ;
		
		if(  tmpAngle >= Math.PI/8 &&  tmpAngle < Math.PI/8 * 2 && test.y < 0 ) 
			 currentDirection = 10 ; // Back , Right
		else  if(  tmpAngle >= Math.PI/8 * 2 &&  tmpAngle < Math.PI/8 * 3 && test.y < 0 ) 
			 currentDirection = 11 ; // Right 
		else  if(  tmpAngle >= Math.PI/8 * 3 &&  tmpAngle < Math.PI/8 * 4 && test.y < 0 ) 
			 currentDirection = 12 ; // Right
		else  if(  tmpAngle >= Math.PI/8 * 4 &&  tmpAngle < Math.PI/8 * 5 && test.y < 0 ) 
			 currentDirection = 13 ; // Right 
		else  if(  tmpAngle >= Math.PI/8 * 5 &&  tmpAngle < Math.PI/8 * 6  && test.y < 0 ) 
			 currentDirection = 14 ; // Front , Right 
		else  if(  tmpAngle >= Math.PI/8 * 6 &&  tmpAngle < Math.PI/8 * 7  && test.y < 0 ) 
			 currentDirection = 15 ; // Right 	
		else  if(  tmpAngle >= Math.PI/8 &&  tmpAngle < Math.PI/8 * 2 && test.y > 0 ) 
			 currentDirection = 6 ;  // Back , Left
		else  if(  tmpAngle >= Math.PI/8 * 2 &&  tmpAngle < Math.PI/8 * 3 && test.y > 0 ) 
			 currentDirection = 5 ;  // Left
		else  if(  tmpAngle >= Math.PI/8 * 3 &&  tmpAngle < Math.PI/8 * 4 && test.y > 0 ) 
			 currentDirection = 4 ;  // Left
		else  if(  tmpAngle >= Math.PI/8 * 4 &&  tmpAngle < Math.PI/8 * 5 && test.y > 0 ) 
			 currentDirection = 3 ;  // Left
		else  if(  tmpAngle >= Math.PI/8 * 5 &&  tmpAngle < Math.PI/8 * 6  && test.y > 0 ) 
			 currentDirection = 2 ;  // Front , Left
		else  if(  tmpAngle >= Math.PI/8 * 6 &&  tmpAngle < Math.PI/8 * 7  && test.y > 0 ) 
			 currentDirection = 1 ;  // Left
		else if(  tmpAngle  >= Math.PI/2) 
			 currentDirection = 0 ;  // Front  
		else 
			 currentDirection = 8 ;  // Back
		 	 
		var st0 = hunterSpriteArray[ 9 ][ currentDirection ].clone();
		var st1 = hunterSpriteArray[ 9 ][ currentDirection + 1 ].clone();
		var st2 = hunterSpriteArray[ 8 ][ currentDirection + 1].clone();
		var st3 = hunterSpriteArray[ 8 ][ currentDirection ].clone();   
	
		
		geometry.faceVertexUvs[0][0][0].copy(st0);
		geometry.faceVertexUvs[0][0][1].copy(st1);
		geometry.faceVertexUvs[0][0][2].copy(st2);

		geometry.faceVertexUvs[0][1][0].copy(st0);
		geometry.faceVertexUvs[0][1][1].copy(st2);
		geometry.faceVertexUvs[0][1][2].copy(st3);

		geometry.uvsNeedUpdate = true;
		
	}

}