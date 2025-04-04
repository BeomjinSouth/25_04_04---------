document.addEventListener('DOMContentLoaded', function() {
    // 초기 문제: x - 3 = 3
    let equationBlocks = [
      { id: 1, text: 'x', side: 'left' },
      { id: 2, text: '-', side: 'left' },
      { id: 3, text: '3', side: 'left' },
      { id: 4, text: '=', side: 'middle' },
      { id: 5, text: '3', side: 'right' }
    ];
  
    let selectedOperation = null;   // 선택된 연산 종류 (multiplyDivide, moveTerm, addSubtract)
    let currentStep = 1;
    const maxStep = 3;
    let answerFound = false;          // 최종 정답 여부
  
    const equationContainer = document.getElementById('equation-container');
    const applyBtn = document.getElementById('apply-btn');
    const hintBtn = document.getElementById('hint-btn');
    const operationButtons = document.querySelectorAll('.operation-btn');
  
    // 단계 표시 업데이트 함수
    function updateStepsDisplay() {
      for (let i = 1; i <= maxStep; i++) {
        let stepElem = document.getElementById(`step${i}`);
        if (i === currentStep) {
          stepElem.classList.add('active');
        } else {
          stepElem.classList.remove('active');
        }
      }
    }
  
    // 블록 렌더링 함수 (더블클릭하여 직접 수정 가능)
    function renderBlocks() {
      equationContainer.innerHTML = '';
      equationBlocks.forEach(block => {
        let div = document.createElement('div');
        div.classList.add('block');
        div.textContent = block.text;
        div.setAttribute('data-id', block.id);
        // 더블클릭 시 contentEditable을 활성화하여 직접 텍스트 수정
        div.addEventListener('dblclick', function() {
          div.contentEditable = true;
          div.focus();
        });
        div.addEventListener('blur', function() {
          div.contentEditable = false;
          const id = div.getAttribute('data-id');
          let blockObj = equationBlocks.find(b => b.id == id);
          if (blockObj) {
            blockObj.text = div.textContent.trim();
          }
        });
        equationContainer.appendChild(div);
      });
    }
  
    renderBlocks();
    updateStepsDisplay();
  
    // 연산 버튼 클릭 이벤트: 선택된 연산 저장 및 강조 표시
    operationButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        operationButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedOperation = btn.getAttribute('data-op');
      });
    });
  
    // 적용 버튼 클릭 이벤트: 선택된 연산을 현재 단계에 한 번 적용
    applyBtn.addEventListener('click', function() {
      if (!selectedOperation) {
        alert("먼저 원하는 연산을 선택하세요.");
        return;
      }
      
      // 각 연산에 따라 해당 블록 수정 (한 단계에 한 번만)
      switch(selectedOperation) {
        case 'multiplyDivide':
          applyMultiplyDivide();
          break;
        case 'moveTerm':
          applyMoveTerm();
          break;
        case 'addSubtract':
          applyAddSubtract();
          break;
        default:
          alert("알 수 없는 연산입니다.");
      }
      // 연산 후 초기화
      selectedOperation = null;
      operationButtons.forEach(b => b.classList.remove('selected'));
      
      // 간단한 계산을 수행한 후, 다음 단계 처리
      processNextStep();
    });
  
    function applyMultiplyDivide() {
        const leftBlocks = equationBlocks.filter(b => b.side === 'left');
        const rightBlocks = equationBlocks.filter(b => b.side === 'right');
      
        // 양변 감싸기 (블록 구조는 단순 문자열 처리로 가정)
        equationBlocks = [
          { id: 100, text: '(', side: 'left' },
          ...leftBlocks,
          { id: 101, text: ')', side: 'left' },
          { id: 102, text: '=', side: 'middle' },
          { id: 103, text: '(', side: 'right' },
          ...rightBlocks,
          { id: 104, text: ')', side: 'right' },
        ];
        renderBlocks();
      }
      
  
    // 예시 함수: 이항하기 연산 적용 (팝업창으로 부호 변경 여부 확인)
    function applyMoveTerm() {
      // 예: 좌변에 있는 '3'을 우변으로 이동시키기 (부호 변경 여부 선택)
      let block = equationBlocks.find(b => b.side === 'left' && b.text === '3');
      if (block) {
        let confirmChange = confirm("부호를 바꾸시겠습니까?"); // 팝업창
        block.side = 'right';
        block.text = confirmChange ? '+3' : '3';
      } else {
        alert("이항할 블록을 찾지 못했습니다.");
      }
    }
  
    // 예시 함수: 더하기/빼기 연산 적용
    function applyAddSubtract() {
      // 예: 우변의 숫자 블록에 3을 더하는 연산
      let block = equationBlocks.find(b => b.side === 'right' && !isNaN(b.text.replace('+','')));
      if (block) {
        let currentVal = Number(block.text.replace('+','').replace('-',''));
        if (block.text.includes('+')) {
          block.text = '+' + String(currentVal + 3);
        } else if (block.text.includes('-')) {
          block.text = '-' + String(currentVal + 3);
        } else {
          block.text = String(currentVal + 3);
        }
      } else {
        alert("더하기/빼기 연산을 적용할 블록을 찾지 못했습니다.");
      }
    }
  
    // 단계 처리 함수: 연산 적용 후 간단 계산 후 다음 단계 진행
    function processNextStep() {
      // 여기서는 간단히 렌더링만 다시 수행합니다.
      renderBlocks();
      
      // 단계 증가 (최대 단계까지만)
      if (currentStep < maxStep) {
        currentStep++;
        updateStepsDisplay();
      } else {
        // 모든 단계 완료 시 최종 정답 확인
        checkFinalAnswer();
      }
    }
  
    // 최종 정답 확인 함수 (예시)
    function checkFinalAnswer() {
      // 예: 정답은 "x = +3 +3" (실제 문제에 맞게 수정 필요)
      let leftSide = equationBlocks.filter(b => b.side === 'left').map(b => b.text).join(' ');
      let rightSide = equationBlocks.filter(b => b.side === 'right').map(b => b.text).join(' ');
      if (leftSide === 'x' && rightSide === '+3 +3') {
        alert("정답입니다!");
        answerFound = true;
        hintBtn.textContent = '점검';
      } else {
        alert("아직 정답이 아닙니다. 계속 시도해보세요.");
      }
    }
  
    // 힌트(혹은 점검) 버튼 클릭 이벤트
    hintBtn.addEventListener('click', function() {
      if (answerFound) {
        alert("최종 답을 점검합니다.");
        // 추가 검증이나 피드백 기능 구현 가능
      } else {
        alert("힌트: 이항할 때는 좌변의 숫자를 우변으로 이동시키며 부호를 바꿔야 합니다.");
      }
    });
  });
  