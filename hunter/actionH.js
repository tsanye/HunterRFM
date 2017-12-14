var lost = false;
var alert = false;

var hunterAction = function (){

	for ( var i = 0; i < hunters.length; i++){
		
		if( hunters[i].fsm.current == "stand" ){
			
			HCount = 0 ;
			baseH = 0 ;
			hunters[i].maxSpeed = 10 ;
			hunters[i].maxForce = 10 ;

			var geometry = hunters[i].mesh.geometry;
			// 5.7
			// �Q�� ���a���u���e�� �M �y�H�e��]�t�פ�V�^ ��̤��������סA�ӭp���y�H����ܪ����
			var playerDirection = new THREE.Vector3( 0 , 0 , 1).applyAxisAngle ( new THREE.Vector3(0 , 1 , 0 ), angle );
			var tmpAngle = playerDirection.clone().angleTo( new THREE.Vector3(hunters[i].vel.x, 0 , hunters[i].vel.z) ) ;
			
			// �p���V�q���~�n�A�ӧP�_�y�H��ܤ�V�¥��٬O�¥k	
			var test = playerDirection.clone().cross( new THREE.Vector3(hunters[i].vel.x, 0 , hunters[i].vel.z)  ) ;
			
			var currentX , currentY ;
			
			if(  tmpAngle >= Math.PI/8 &&  tmpAngle < Math.PI/8 * 3 && test.y < 0 ) {
				currentX = 2 ; // Front , Left
			} 
			else  if(  tmpAngle >= Math.PI/8 * 3 &&  tmpAngle <= Math.PI/8 * 5 && test.y < 0 ){
				currentX = 4 ; // Left
			}
			else  if(  tmpAngle >= Math.PI/8 * 5 &&  tmpAngle <= Math.PI/8 * 7  && test.y < 0 ){
				currentX =  6 ; // Back , Left
			}
			else  if(  tmpAngle >= Math.PI/8 &&  tmpAngle < Math.PI/8 * 3 && test.y > 0 ){ 
				currentX = 14  ; // Front , Right
			}
			else  if(  tmpAngle >= Math.PI/8 * 3 &&  tmpAngle <= Math.PI/8 * 5 && test.y > 0 ){ 
				currentX = 12 ;  // Right 
			}
			else  if(  tmpAngle >= Math.PI/8 * 5 &&  tmpAngle <= Math.PI/8 * 7  && test.y > 0 ){ 
				currentX =  10 ;  // Back , Right
			}//6.1
			else if(  tmpAngle  <= Math.PI/8){ 
				currentX =  0 ; // Front
			}
			else{ 
				currentX = 8 ;  // Back
			}
			   
			var st0 = hunterSpriteArray[ 10 ][  currentX].clone();
			var st1 = hunterSpriteArray[ 10 ][ currentX + 1].clone();
			var st2 = hunterSpriteArray[ 9 ][currentX + 1].clone();
			var st3 = hunterSpriteArray[ 9 ][ currentX ].clone();     
			
			geometry.faceVertexUvs[0][0][0].copy(st0);
			geometry.faceVertexUvs[0][0][1].copy(st1);
			geometry.faceVertexUvs[0][0][2].copy(st2);

			geometry.faceVertexUvs[0][1][0].copy(st0);
			geometry.faceVertexUvs[0][1][1].copy(st2);
			geometry.faceVertexUvs[0][1][2].copy(st3);

			geometry.uvsNeedUpdate = true;
			
			hunters[i].target = new THREE.Vector3( 0, 0, 0 );
			
			hunters[i].clock = new THREE.Clock();
			//hunters[i].force = new THREE.Vector3();
			hunters[i].vel  = hunters[i].vel.normalize();

			var sight = new THREE.Vector3(1, 0 , 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), hunters[i].angle ).normalize();		
			
			// Math.random()*( max - min + 1 ) + min  =   Math.random() * ( 108 - 0 + 1 ) +  0
			var randomRadian = Math.random() * 109 ; 
			var leftsight = new THREE.Vector3( 1, 0 , 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), hunters[i].angle + randomRadian / 100  ).normalize();		
			
			var randomRadian = Math.random() * 109 ; 
			var rightsight = new THREE.Vector3( 1, 0 , 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), hunters[i].angle - randomRadian / 100 ).normalize();		
			
			var raycasterA = new THREE.Raycaster( hunters[i].pos , sight , 0 , 200 );
			var intersectsA = raycasterA.intersectObjects(obj , true);
			
			var raycasterB = new THREE.Raycaster( hunters[i].pos , leftsight  , 0 , 80 );
			var intersectsB = raycasterB.intersectObjects(obj , true);
			
			var raycasterC = new THREE.Raycaster( hunters[i].pos , rightsight  , 0 , 80 );
			var intersectsC = raycasterC.intersectObjects(obj , true);
			
			
			if( intersectsA.length !== 0  || intersectsB.length !== 0 || intersectsC.length !== 0 ){
				if( intersectsA.length !== 0 && intersectsA[0].object.name === "Player" ){
					hunters[i].find = true ; 
				}
				else if( intersectsB.length !== 0 && intersectsB[0].object.name === "Player" ){
					hunters[i].find = true ; 
				}
				else if( intersectsC.length !== 0 && intersectsC[0].object.name === "Player" ){
					hunters[i].find = true ; 
				}
				else 
					hunters[i].find = false ; 
				
			}
			
			if( hunters[i].find ){
				
				hunters[i].fsm.found();
				var textarea = $('#messages').append("�y�H�o�{�F���a " + username +" �I\n");
				textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
				hunters[i].target = player.position.clone();
				
			}
			
			if(  player.position.clone().distanceTo(hunters[i].pos) <= 30 && stop == false ){
				hunters[i].fsm.proximity();
				var textarea = $('#messages').append("�y�Hť��F�@���n��...\n");
				textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
			}
			
		} 
		else if( hunters[i].fsm.current == "search" ){
			
			HCount = 0 ;
		//	hunters[i].force = new THREE.Vector3();
		    hunters[i].vel  = hunters[i].vel.normalize();
			hunters[i].angle += 0.01 ;
			hunters[i].tmp += 0.01 ; 
			hunters[i].maxSpeed = 10 ;
			hunters[i].maxForce = 10 ;
			
			if( hunters[i].tmp >= Math.PI * 2 ){  	
				hunters[i].tmp = 0;
				hunters[i].fsm.nfound();
				var textarea = $('#messages').append("�y�H�S���j���쪱�a\n");
				textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
			}
			
			
			var sight = new THREE.Vector3(1, 0 , 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), hunters[i].angle ).normalize();		
			
			// Math.random()*( max - min + 1 ) + min  =   Math.random() * ( 108 - 0 + 1 ) +  0
			var randomRadian = Math.random() * 109 ; 
			var leftsight = new THREE.Vector3( 1, 0 , 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), hunters[i].angle + randomRadian / 100  ).normalize();		
			
			var randomRadian = Math.random() * 109 ; 
			var rightsight = new THREE.Vector3( 1, 0 , 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), hunters[i].angle - randomRadian / 100 ).normalize();		
			
			var raycasterA = new THREE.Raycaster( hunters[i].pos , sight , 0 , 200 );
			var intersectsA = raycasterA.intersectObjects(obj , true);
			
			var raycasterB = new THREE.Raycaster( hunters[i].pos , leftsight  , 0 , 80 );
			var intersectsB = raycasterB.intersectObjects(obj , true);
			
			var raycasterC = new THREE.Raycaster( hunters[i].pos , rightsight  , 0 , 80 );
			var intersectsC = raycasterC.intersectObjects(obj , true);
			
			SCount++ ;
  			if( SCount % 2 === 0 )  hunters[i].searchAnimation(sight.clone() );
			
			
			if( intersectsA.length !== 0  || intersectsB.length !== 0 || intersectsC.length !== 0 ){
				if( intersectsA.length !== 0 && intersectsA[0].object.name === "Player" ){
					hunters[i].find = true ; 
				}
				else if( intersectsB.length !== 0 && intersectsB[0].object.name === "Player" ){
					hunters[i].find = true ; 
				}
				else if( intersectsC.length !== 0 && intersectsC[0].object.name === "Player" ){
					hunters[i].find = true ; 
				}
				else
					hunters[i].find = false ; 
			}
			
			if( hunters[i].find){
				
				hunters[i].tmp = 0;
				hunters[i].target = player.position.clone();
				hunters[i].fsm.found();
				var textarea = $('#messages').append("�y�H�b�j�����o�{�F���a " + username +" �I\n");
				textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
				hunters[i].target = player.position.clone();
				
			}
			
		} 
		else if( hunters[i].fsm.current == "seek" ){
			
			var timer;
			
			HCount++ ;
			//6.1
  			if( HCount % 2 === 0 )  hunters[i].spriteAnimation( 10 );
			hunters[i].maxSpeed = 30 ;
			hunters[i].maxForce = 30 ;

			
			var sight = new THREE.Vector3(1, 0 , 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), hunters[i].angle ).normalize();		
			var raycasterA = new THREE.Raycaster( hunters[i].pos , sight , 0 , hunters[i].sightD );
			var intersectsA = raycasterA.intersectObjects(obj , true);
			if( intersectsA.length !== 0 && intersectsA[0].object.name === "Player" ){
					hunters[i].find = true ; 
			}
			else{ // �j�M�������O�_���ؼЪ��X�{
				hunters[i].find = false ; 
				for( var count = 1 , tmp = 62 ; count < hunters[i].sightN ; count++ ){
					tmp -= 124/hunters[i].sightN ; 
					var angleA = tmp * Math.PI / 180 ;
					var sight = new THREE.Vector3( 1, 0 , 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), hunters[i].angle + angleA  ).normalize();		
					var raycasterA = new THREE.Raycaster( hunters[i].pos , sight , 0 , hunters[i].sightD ) ;
					var intersects = raycasterA.intersectObjects(obj , true);
					
					if( intersects.length !== 0   &&  intersects[0].object.name === "Player"  ){
						hunters[i].find = true ;
						break;
					}
				} 
			}
			//6.1		
			hunters[i].computeForceS( hunters[i].clock.getDelta() ) ;
			
			if(lost == true){
			
				alert = false;
				lost = false;
				hunters[i].fsm.lost();
				hunters[i].find = false ;
			}
			else if (hunters[i].pos.distanceTo(player.position) <= 10 ) {
			
				hunters[i].fsm.caught(); 
			}
			else if( hunters[i].find ) {
			
				hunters[i].target = player.position.clone();
				console.log("I see Player First");
			}
			else if (alert == false){
			
				alert = true;
				timer = setTimeout (function() {
					lost = true;
				},5000);
			}
		} 
		else if( hunters[i].fsm.current == "patrol" ){
			
			HCount++ ;
  			//6.1
			if( HCount % 1.5 === 0 )  hunters[i].spriteAnimation( 0 );
			hunters[i].maxSpeed = 10 ;
			hunters[i].maxForce = 10 ;
				
			if ( hunters[i].target.length() == 0 || hunters[i].pos.distanceTo(hunters[i].target) <= 5 )
				hunters[i].setRandomTarget();                         // �|�B�ó}�� �Y�O�w��F�ؼ��I�A�H���]�m�ؼ�
			
			
			for( var count  = 0 ; count < balls.length ; count++ ){
		
				if( scene.getObjectByName( "Ball" + (count + 1 ) ) !== undefined && balls[count].position.distanceTo(hunters[i].pos) <= 10 ) {
					scene.remove( balls[count] ) ;
					hunters[i].sightN = 40 ;
					hunters[i].sightD = 300 ; 
					hunters[i].getStrength = true ;
					var textarea = $('#messages').append("�y�H��o�F�j�O�Y�A15���i�����ܰ��I\n");
					textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
					
					var timer = setTimeout (function() {
						hunters[i].sightN = 21 ; 
						hunters[i].sightD = 150 ; 
						hunters[i].getStrength = false ;
					},15000);
				}
		
			}	
			
			hunters[i].find = false ; 
			//5.7
			// �T�w�¥��e���
			var sight = new THREE.Vector3(1, 0 , 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), hunters[i].angle ).normalize();		
			var raycasterA = new THREE.Raycaster( hunters[i].pos , sight , 0 , hunters[i].sightD );
			var intersectsA = raycasterA.intersectObjects(obj , true);
			if( intersectsA.length !== 0 && intersectsA[0].object.name === "Player" ){
					hunters[i].find = true ; 
			}
			else{ // �j�M�������O�_���ؼЪ��X�{
				hunters[i].find = false ; 
				for( var count = 1 , tmp = 62 ; count < hunters[i].sightN ; count++ ){
					tmp -= 124/hunters[i].sightN ; 
					var angleA = tmp * Math.PI / 180 ;
					var sight = new THREE.Vector3( 1, 0 , 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), hunters[i].angle + angleA  ).normalize();		
					var raycasterA = new THREE.Raycaster( hunters[i].pos , sight , 0 , hunters[i].sightD ) ;
					var intersects = raycasterA.intersectObjects(obj , true);
					
					if( intersects.length !== 0   &&  intersects[0].object.name === "Player"  ){
							hunters[i].find = true ;
							break ;  
					}		

				} 
			}
	
			if( hunters[i].find){
					hunters[i].fsm.found();
					var textarea = $('#messages').append("�y�H�b���ޤ��o�{�F���a " + username +" �I \n");
					textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
					hunters[i].target = player.position.clone();
					
				}
			else if ( player.position.clone().distanceTo(hunters[i].pos) <= 30 && stop == false ){
					hunters[i].fsm.proximity();
					var textarea = $('#messages').append("�y�Hť��F�@���n��...\n");
					textarea.scrollTop(textarea[0].scrollHeight - textarea.height());		
			}
			//6.1
			hunters[i].computeForceP( hunters[i].clock.getDelta() );
		} 
		else if( hunters[i].fsm.current == "catch" ){	
		
			hunters[i].force = new THREE.Vector3();
			hunters[i].vel = new THREE.Vector3();
			hunters[i].find = false ;
			catched = true;
			start = false;
			
		}
		hunterIcon.position.copy(hunters[i].pos);
		hunters[i].mesh.lookAt(camera.position) ;
	}
	
}