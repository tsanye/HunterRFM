function move(){

	keyboard.update();
  
  
	for( var i  = 0 ; i < balls.length ; i++ ){
		
		if( scene.getObjectByName( "Ball" + (i + 1 ) ) !== undefined && balls[i].position.distanceTo(pos) <= 10 ) {
			scene.remove( balls[i] ) ;
			stamina = 100 ;
			ruby.material.color  = new THREE.Color("rgb(255, 255, 0)");
			getStrength = true ;
			var textarea = $('#messages').append("��o�F�j�O�Y�A5���L����O�B�t���ܧ֡I\n");
			textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
			
			var timer = setTimeout (function() {
				ruby.material.color = new THREE.Color("rgb(255, 255, 255)");
				getStrength = false ;
			},5000);
		}
		
	}
	
    if( stamina <= 0 )  rest = true ; // ��O�C��0���ܱo�𮧤@�U
  
    if( stamina <= 40)
		ruby.material.opacity = 0.4 ; 
    else
		ruby.material.opacity = stamina / 100  ;
  
    if( stamina <= 30)
		$("#playerPhoto").attr("src","https://i.imgur.com/TCsC9xE.png");
    else
		$("#playerPhoto").attr("src","https://i.imgur.com/KnWf7hN.png");
		
		
	if( rest){
		stop  = true ; 
		if ( stamina <= 30)  stamina += 0.2 ;   // �𮧮ɭԥ����n��_��@�w�ȡ]30�^�~���~����
		else  rest = false ; 
	}
	else {
		
		if (keyboard.pressed("up") ) { // �e�i�� �����O
			stop  = false ; 
			if( stamina > 0 && !getStrength ) stamina -= 0.2 ; 
		}
		else{ // �S���e�i�ݦb��a�A�H�ɶ���_��O
			if( stamina < 100 ) stamina += 0.1 ;
			stop  = true ; 
		}
		
		if (keyboard.pressed("right")) { // ���k��
			direction = -Math.PI/16;
			angle -= 0.05 ;   //5.7
		}
		else if (keyboard.pressed("left")) { // ������
			direction = Math.PI/16;
			angle += 0.05 ;  //5.7
		}
		else 
			direction = 0; 
	}	
	
	pow = getStrength ? 400 : 200 ;
	  
	if (stop) {
		vel = new THREE.Vector3(0, 0, 0);
		force = new THREE.Vector3(0, 0, 0);
	} else {
		force = new THREE.Vector3(0 , 0 , -1 ).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle + direction ).multiplyScalar(pow);
		spriteCounter++ ;
		if( spriteCounter % 6 === 0 ) spriteAnimate();
	}
		
	var dt = clockA.getDelta(); // delta-time
	  
	 
	// resistance force 
	force.add(vel.clone().multiplyScalar(-2));
	// vel = vel + force/mass * dt
	vel.add(force.clone().multiplyScalar(dt / mass));  
	// pos = pos + vel * dt
	  
	//6.1
	for( var i = 0 ; i < obstacles.length ; i++ ){  // �I������
		if( obstacles[i].pos.distanceTo(pos) <= Math.max(obstacles[i].boxX , obstacles[i].boxZ) + 10 ){
			vel = vel.clone().sub (collisionDetection( pos.x  , pos.z  , i  , 6 , vel )  );
			//console.log( i + 1 );
			//collisionDetection( pos.x  , pos.z  , i  , 5 , vel );
		}
	}
	  
	  
	pos.add(vel.clone().multiplyScalar(dt));

	if (vel.length() > 0.001) {
		angle = Math.atan2(-vel.x, -vel.z);
	}
	
	// copy to cylinder
	player.position.copy(pos);
	player.rotation.y = angle;
	playerIcon.rotation.y = angle;
	playerIcon.position.copy(pos);
}

function spriteAnimate() {


  var geometry = ruby.geometry;

  var st0 = stArray[4][ baseS].clone();
  var st1 = stArray[4][baseS + 1].clone();
  var st2 = stArray[3][baseS + 1].clone();
  var st3 = stArray[3][baseS ].clone();

  geometry.faceVertexUvs[0][0][0].copy(st0);
  geometry.faceVertexUvs[0][0][1].copy(st1);
  geometry.faceVertexUvs[0][0][2].copy(st2);
  
  geometry.faceVertexUvs[0][1][0].copy(st0);
  geometry.faceVertexUvs[0][1][1].copy(st2);
  geometry.faceVertexUvs[0][1][2].copy(st3);
  
  geometry.uvsNeedUpdate = true;
  
  baseS = (baseS + 1) % 4 ;
 
}