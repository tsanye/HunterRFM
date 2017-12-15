function buildObstacles(){
	//6.1
	wall1 = buildWall( new THREE.Vector3( 50 , 10 , -45) , 0, 50 , 20 ,  10, "1" )  ;
	wall2 = buildWall( new THREE.Vector3( -140 , 10 , 30) ,  0 , 60 , 20 ,  10, "2" );
	wall3 = buildWall( new THREE.Vector3( 130 , 10 , 115) , 0 , 40 , 20 ,  10, "3" );
	wall4 = buildWall( new THREE.Vector3( 60 , 10 , 80 ) , Math.PI/4 , 70 , 20 ,  10, "4" );
	wall5 = buildWall( new THREE.Vector3( 0 , 10 , -130 ) , 0 , 150 , 20 ,  10, "5" );
	wall6 = buildWall( new THREE.Vector3( -80, 10 , -75 ) , Math.PI/2 , 100 , 20 ,  10, "6" );
	wall7 = buildWall( new THREE.Vector3( 80 , 10 , -65 ) , Math.PI/2 , 120 , 20 ,  10, "7" );
	wall8 = buildWall( new THREE.Vector3( -150 , 10 , 50 ) , Math.PI/2 , 60 , 20 ,  10, "8" );
	wall9 = buildWall( new THREE.Vector3( 120 , 10 , -200 ) , 0 , 150 , 20 ,  10, "9" );
	wall10 = buildWall( new THREE.Vector3( 180 , 10 , -180 ) , Math.PI/2 , 80 , 20 ,  10, "10" );
	wall11 = buildWall( new THREE.Vector3( -160 , 10 , -210 ) , Math.PI/3 , 80 , 20 ,  10, "11" );
	wall12 = buildWall( new THREE.Vector3( -220 , 10 , -180 ) , Math.PI/7 , 45 , 20 ,  10, "12" );
	
	box1 = buildBox( new THREE.Vector3(-90 , 7.5 , 120) , -Math.PI/3 , 15 , "1") ; 
	box2 = buildBox( new THREE.Vector3(-15 , 7.5 , 95) , -Math.PI/5 , 15 , "2") ; 
	box3 = buildBox( new THREE.Vector3(-15 , 7.5 , -110) , 0 , 15 , "3") ; 
	box4 = buildBox( new THREE.Vector3(-40 , 7.5 , -110) , 0 , 15 , "4") ; 
	box5 = buildBox( new THREE.Vector3(-65 , 7.5 , -110) , 0 , 15 , "5") ; 
	box6 = buildBox( new THREE.Vector3(140 , 7.5 , -70) , 0 , 15 , "6") ; 
	box7 = buildBox( new THREE.Vector3(140 , 7.5 , -50) , 0 , 15 , "7") ; 
	box8 = buildBox( new THREE.Vector3(140 , 7.5 , -30) , 0 , 15 , "8") ; 
	box9 = buildBox( new THREE.Vector3(140 , 7.5 , -10) , 0 , 15 , "9") ; 
	box10 = buildBox( new THREE.Vector3(140 , 7.5 , 10) , 0 , 15 , "10") ; 

}

function buildWall( initPos , angleW , boxX , boxY , boxZ, name ){
	
	var wall = new THREE.Object3D();
	
	var mesh = new THREE.Mesh(new THREE.BoxGeometry(boxX, boxY, boxZ), new THREE.MeshNormalMaterial()); 
	loadTexture( mesh , 'https://i.imgur.com/wJrFyNc.jpg') ;
	//mesh.rotation.y = angleW ; 
	wall.add(mesh) ;
	wall.rotation.y = angleW ; 
	wall.position.copy(initPos);
	scene.add(wall) ;
	
	var wallIcon = new THREE.Mesh(new THREE.BoxGeometry(boxX, boxY, boxZ), new THREE.MeshLambertMaterial({color:'cyan'})); 
	wallIcon.rotation.y = angleW ; 
	wallIcon.position.copy(initPos);
	scene2.add(wallIcon) ;
	
	wall.pos = initPos ;
	wall.position = initPos ;
	wall.boxX = boxX ;
	wall.boxZ = boxZ ;
	wall.name = "Wall" + name ;
	wall.angle = angleW ;
	
	wall.vectorN1 = new THREE.Vector3(0 , 0 , 1).applyAxisAngle( new THREE.Vector3(0,1,0) , angleW) ; 
	wall.vectorN2 = new THREE.Vector3(0 , 0 , -1).applyAxisAngle( new THREE.Vector3(0,1,0) , angleW) ; 
	wall.vectorN3 = new THREE.Vector3(1 , 0 , 0).applyAxisAngle( new THREE.Vector3(0,1,0) , angleW) ; 
	wall.vectorN4 = new THREE.Vector3(-1 , 0 , 0).applyAxisAngle( new THREE.Vector3(0,1,0) , angleW) ;
    // 以上四個向量為此障礙物中四個面的法線向量，當玩家撞到時會給予一力使其沿著牆壁的面前進
	
	return wall ;

}

function buildBox( initPos , angleW , boxX , name ){
	
	var box = new THREE.Object3D();
	
	var mesh = new THREE.Mesh(new THREE.BoxGeometry(boxX, boxX, boxX), new THREE.MeshNormalMaterial()); 
	loadTexture( mesh , 'https://i.imgur.com/d7qGdbQ.jpg') ;
	box.add(mesh) ;
	box.rotation.y = angleW ; 
	box.position.copy(initPos);
	scene.add(box) ;
	
	var boxIcon = new THREE.Mesh(new THREE.BoxGeometry(boxX, boxX, boxX), new THREE.MeshLambertMaterial({color:'cyan'})); 
	boxIcon.rotation.y = angleW ; 
	boxIcon.position.copy(initPos);
	scene2.add(boxIcon) ;
	
	box.pos = initPos ;
	box.position = initPos ;
	box.boxX = boxX ;
	box.boxZ = boxX ;
	box.name = "Box" + name ;
	box.angle = angleW ;
	
	box.vectorN1 = new THREE.Vector3(0 , 0 , 1).applyAxisAngle( new THREE.Vector3(0,1,0) , angleW) ; 
	box.vectorN2 = new THREE.Vector3(0 , 0 , -1).applyAxisAngle( new THREE.Vector3(0,1,0) , angleW) ; 
	box.vectorN3 = new THREE.Vector3(1 , 0 , 0).applyAxisAngle( new THREE.Vector3(0,1,0) , angleW) ; 
	box.vectorN4 = new THREE.Vector3(-1 , 0 , 0).applyAxisAngle( new THREE.Vector3(0,1,0) , angleW) ;
    // 以上四個向量為此障礙物中四個面的法線向量，當玩家撞到時會給予一力使其沿著牆壁的面前進
	
	return box ;

}