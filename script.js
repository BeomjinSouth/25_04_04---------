document.addEventListener('DOMContentLoaded', function() {
    // 예제 문제: x - 3 = 3
    let equationBlocks = [
      { id: 1, text: 'x', side: 'left' },
      { id: 2, text: '-', side: 'left' },
      { id: 3, text: '3', side: 'left' },
      { id: 4, text: '=', side: 'middle' },
      { id: 5, text: '3', side: 'right' }
    ];
  
    const equationContainer = document.getElementById('equation-container');
  
    // 블록을 화면에 렌더링하는 함수
    function renderBlocks() {
        equationContainer.innerHTML = '';
        equationBlocks.forEach(block => {
          let div = document.createElement('div');
          div.classList.add('block');
          div.textContent = block.text;
          div.setAttribute('data-id', block.id);
          div.draggable = true;
          div.addEventListener('dragstart', dragStart);
      
          // 블록 더블클릭 시 직접 수정할 수 있도록 함
          div.addEventListener('dblclick', function() {
            div.contentEditable = true;
            div.focus();
          });
          // 수정 완료(포커스 잃을 때)하면 contentEditable 비활성화 및 내부 데이터 업데이트
          div.addEventListener('blur', function() {
            div.contentEditable = false;
            // 변경된 텍스트를 equationBlocks 배열에 반영
            const id = div.getAttribute('data-id');
            const blockObj = equationBlocks.find(b => b.id == id);
            if (blockObj) {
              blockObj.text = div.textContent.trim();
            }
          });
          
          equationContainer.appendChild(div);
        });
      }

      
    // 드래그 시작 이벤트 핸들러
    function dragStart(e) {
      e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'));
    }
  
    // 드래그 앤 드롭 이벤트 처리 (간단 예시)
    equationContainer.addEventListener('dragover', function(e) {
      e.preventDefault();
    });
  
    equationContainer.addEventListener('drop', function(e) {
      e.preventDefault();
      const blockId = e.dataTransfer.getData('text/plain');
      let block = equationBlocks.find(b => b.id == blockId);
      if(block && block.side === 'left') {
        block.side = 'right';
        if(block.text === '3') {
          block.text = '+3';
        }
      }
      renderBlocks();
    });
  
    renderBlocks();
  
    // 변환 적용 버튼 처리
    document.getElementById('apply-transformation').addEventListener('click', function() {
      const inputValue = document.getElementById('transformation-input').value;
      equationBlocks.forEach(block => {
        if(block.side === 'right' && block.text.indexOf('+') === -1) {
          let parts = inputValue.split('→');
          if(parts.length === 2) {
            block.text = parts[1].trim();
          }
        }
      });
      renderBlocks();
    });
  
    // 점검 버튼 처리
    document.getElementById('check-btn').addEventListener('click', function() {
      let isCorrect = validateEquation();
      if(!isCorrect) {
        document.querySelectorAll('.block').forEach(blockElement => {
          blockElement.classList.add('invalid');
        });
        alert('잘못된 변환이 있습니다. 점검 메시지를 확인하세요.');
      } else {
        alert('정답입니다!');
      }
    });
  
    // 간단한 검증 함수
    function validateEquation() {
      let leftSide = equationBlocks.filter(b => b.side === 'left').map(b => b.text).join(' ');
      let rightSide = equationBlocks.filter(b => b.side === 'right').map(b => b.text).join(' ');
      if(leftSide === 'x' && rightSide === '+3 +3') {
        return true;
      }
      return false;
    }
  });
  