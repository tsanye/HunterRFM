var hunterFSM = function (mesh, text){
  
  var timer;
  
  var fsm = StateMachine.create({

    events: [
		{ name: 'start',     from: 'none',      to: 'stand'  },
		{ name: 'found',     from: 'stand',     to: 'seek'   },
		{ name: 'found',     from: 'search',    to: 'seek'   },
		{ name: 'found',     from: 'patrol',    to: 'seek'   },
		{ name: 'proximity', from: 'stand',     to: 'search' },
		{ name: 'proximity', from: 'patrol',    to: 'search' },
		{ name: 'stood',     from: 'stand',     to: 'patrol' },
		{ name: 'patrolled', from: 'patrol',    to: 'stand'  },
		{ name: 'lost',      from: 'seek',      to: 'search' },
		{ name: 'nfound',    from: 'search',    to: 'stand'  },
		{ name: 'caught',    from: 'seek',      to: 'catch'  }
	],

    callbacks: {
		onbeforestart:      function(event, from, to) { },
		onstart:            function(event, from, to) { },

		onbeforefound:      function(event, from, to) { },
		onbeforeproximity:  function(event, from, to) { },
		onbeforestood:      function(event, from, to) { },
		onbeforepatrolled:  function(event, from, to) { },
		onbeforelost:       function(event, from, to) { },
		onbeforenfound:     function(event, from, to) { },
		onbeforecaught:     function(event, from, to) { },

		onfound:            function(event, from, to) { 
			//���u�����쪱�a(���State��Seek)
		},
		onproximity:        function(event, from, to) {
			//ť�O�d��Ĳ�쪱�a(���State��Search)
		},
		onstood:          function(event, from, to) {
			//�g�L�@�q�ɶ���(���)�A�}�l����(���State��Patrol)
		},
		onpatrolled:        function(event, from, to) {
			//���ޤ@�q�ɶ���(����)�A�^�쯸�ߪ��A(���State��Stand)
		},
		onlost:             function(event, from, to) {
			//�l�᪱�a(���State��Search)
		},
		onnfound:           function(event, from, to) {
			//�j�M�L��A�S�o�{���a(���State��Stand)
		},
		oncaught:          function(event, from, to) {
			//��쪱�a(���State��Catch)
		},

		onleavestand:       function(event, from, to) { },
		onleavesearch:      function(event, from, to) { },
		onleaveseek:        function(event, from, to) { },
		onleavepatrol:      function(event, from, to) { },

		onstand:            function(event, from, to) {
			var textarea = $('#messages').append("�y�H���b��a�𮧤�\n");
			textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
			
			//���w�I�]��C�t�^�[��
			//�C����ഫ��patrol���A
			text.text = "Hunter : Stand";
		
			clearTimeout(timer);

			timer = setTimeout (function() {
				fsm.stood();
			},2000);
		
			
		},
		onsearch:           function(event, from, to) {
		
			//��a����M�䪱�a
			text.text = "Hunter : Search";
		
			clearTimeout(timer);
			
			// music 0.5.7 ?
			alertSound.pause();
		},
		onseek:             function(event, from, to) {
			
			//�l�v���a
			text.text = "Hunter : Seek" ;
		
			clearTimeout(timer);
			
			// music 0.5.7 ?
			alertSound.play();
		},
		onpatrol:           function(event, from, to) {
			var textarea = $('#messages').append("�y�H�}�l����\n");
			textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
			
			//�H�������@��target���y�H������V�樫
			//�C����^��stand���A
			text.text = "Hunter : Patrol" ;
			
			clearTimeout(timer);
			timer = setTimeout (function() {
				fsm.patrolled();
			},8000);
		},
		oncatch:            function(event, from, to) { 
		
			//�C������
			text.text = "Hunter : Catch";
		
			clearTimeout(timer);
			
			// music 0.5.7 ?
			alertSound.pause();
			soundTrack.pause();
		}
    }
  });

  fsm.start();
  return fsm;
}
