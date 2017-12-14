function collisionDetection( positionX , positionZ,   index ,     radius  ,  velocity	) { // �������a���y�H�O�_���I���ê��
						 //   ����Ҧb��mX,Z      ��ê�����s��    ����b�|   ����t��
  var Rad2 = radius * radius; // ����b�|������
  var Check_Intersect = false;   // �T�{�ާ@�������a�O�_���M�����ê����Ĳ��
  
  var centerX = obstacles[index].pos.x; // ��ê�������ߦ�mX
  var centerZ = obstacles[index].pos.z; // ��ê�������ߦ�mZ
  var boxAngle = obstacles[index].angle; // ��ê�����઺����
  var boxX = obstacles[index].boxX + 0.5; // ��ê��������
  var boxZ = obstacles[index].boxZ + 0.5; // ��ê�����e��
  
  var C = new THREE.Vector3( positionX ,0 , positionZ);  
  var R = new THREE.Vector3( centerX ,0 , centerZ); //���F��K�p�⪱�a�줤���I���Z���A������̤��������׮t y�Τ@��0
  
  var Cx = ( C.clone().sub(R) ).dot( new THREE.Vector3(1,0,0).applyAxisAngle( new THREE.Vector3(0,1,0) , boxAngle).normalize()  );
  
  var Cz = ( C.clone().sub(R) ).dot( new THREE.Vector3(0,0,1).applyAxisAngle( new THREE.Vector3(0,1,0) , boxAngle).normalize()  );
  
  //console.log(new THREE.Vector3(Cx, 0 , Cz));
  
  // �H�U�ΨӰ������a�b��ê�����۹��m�A�Y�O�IĲ�쪺��  Check_Intersect�|�ରTrue �õ����e�i��������@�O�q
   
  /* Translate coordinates, placing C at the origin. */
  var maxX = boxX / 2 - Cx;   
  var maxZ = boxZ / 2  - Cz;
  var minX = -( boxX / 2 ) - Cx;
  var minZ = -( boxZ / 2 ) - Cz; 

	if (maxX < 0){ /* R to left of circle center */
    
		if (maxZ < 0) {/* R in lower left corner */
			console.log("in lower left");
			Check_Intersect = ((maxX * maxX + maxZ * maxZ) < Rad2);	
			if( Check_Intersect && velocity.clone().dot(obstacles[index].vectorN1) <= 0 )
				return velocity.clone().projectOnVector(obstacles[index].vectorN1);
		}
		else if (minZ > 0) {/* R in upper left corner */
			console.log("in upper left");
			Check_Intersect = ((maxX * maxX + minZ * minZ) < Rad2);	
			if( Check_Intersect && velocity.clone().dot(obstacles[index].vectorN2) <= 0 )
				return velocity.clone().projectOnVector(obstacles[index].vectorN2);
		}
		else{ /* R due West of circle */
			console.log("middle");
			Check_Intersect = (Math.abs(maxX) < radius);
			if( Check_Intersect && velocity.clone().dot(obstacles[index].vectorN3) <= 0 )
				return velocity.clone().projectOnVector(obstacles[index].vectorN3);
		}
		
	}
	else if (minX > 0) { /* R to right of circle center */
    
		if (maxZ < 0){ /* R in lower right corner */
			Check_Intersect = ((minX * minX + maxZ * maxZ) < Rad2);	
			if( Check_Intersect && velocity.clone().dot(obstacles[index].vectorN1) <= 0 )
				return velocity.clone().projectOnVector(obstacles[index].vectorN1);
		}
		else if (minZ > 0){ /* R in upper right corner */
			Check_Intersect = ((minX * minX + minZ * minZ) < Rad2);
			if( Check_Intersect && velocity.clone().dot(obstacles[index].vectorN2) <= 0 )
				return velocity.clone().projectOnVector(obstacles[index].vectorN2);
		}
		else{ /* R due East of circle */
			Check_Intersect = (minX < radius);	
			if( Check_Intersect && velocity.clone().dot(obstacles[index].vectorN4) <= 0 )
				return velocity.clone().projectOnVector(obstacles[index].vectorN4);
		}
	}
	else{ /* R on circle vertical centerline */
    
		if (maxZ < 0){ /* R due South of circle */
			Check_Intersect = (Math.abs(maxZ) < radius);	
			if( Check_Intersect && velocity.clone().dot(obstacles[index].vectorN1) < 0 ) 
				return velocity.clone().projectOnVector(obstacles[index].vectorN1);
			else if ( Check_Intersect && velocity.clone().dot(obstacles[index].vectorN1) == 0 ) {
				return velocity.clone().projectOnVector(obstacles[index].vectorN3);
			}	
		}
		else if (minZ > 0){ /* R due North of circle */
			Check_Intersect = (minZ < radius);	
			if( Check_Intersect && velocity.clone().dot(obstacles[index].vectorN2) < 0 )
				return velocity.clone().projectOnVector(obstacles[index].vectorN2);
			else if ( Check_Intersect && velocity.clone().dot(obstacles[index].vectorN2) == 0 ) 
				return velocity.clone().projectOnVector(obstacles[index].vectorN3);
		}
		else /* R contains circle centerpoint */
			Check_Intersect = true;
	} 

	return new THREE.Vector3(0,0,0);
	  
		
}