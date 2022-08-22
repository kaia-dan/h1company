window.addEventListener('load',()=>{

  const section=document.querySelectorAll('section')
  const body=document.querySelector('body,html')
  const mainMenu=document.querySelectorAll('#mainmenu_list>li')
  const mainMenuBg=document.querySelector('#menuselected_bg')

  let contentsHeight;
  let currentIndex=0;
  let sectionLength=section.length
  let isWheel=false;

  const portfolioList=document.querySelector('#portfolio_list')
  let portfolioWidth=portfolioList.children[0].offsetWidth
  let portfolioLength=portfolioList.children.length
  let portfolioIndex=0; // 포트폴리오 리스트 순번.

  init();
  initEvent();

  function init(){
    // 모든 섹션 높이 조정
    gsap.set(section,{height:window.innerHeight})
    contentsHeight=section[0].offsetHeight
    gsap.set(portfolioList,{width:portfolioWidth*portfolioLength})
    scrollEffect(0)
    homeEffect();
    portfolioEffect();
    processEffect();
    awardEffect()
  }
  function initEvent(){
    // 메뉴 클릭 이벤트 실행
    for(const item of mainMenu){
      item.addEventListener('click', menuClick)
    }
    // 스크롤이벤트 실행
    window.addEventListener('mousewheel', windowScroll)
    // 포트폴리오 이벤트 실행
  }

  // 영역을 이동시켜 주는 함수
  function menuClick(){ // 메뉴 클릭했을 때 이동
    currentIndex=getIndex(this)
    scrollEffect(currentIndex)
  }
  function getIndex(num){ // 메뉴 클릭했을 때 해당 메뉴 순번 구하기
    let index=0;
    let checkMenu=num;
    while((checkMenu=checkMenu.previousElementSibling)!=null){
      index++;
    }
    return index
  }
  function windowScroll(e){ // 스크롤 했을때 이동
    if(e.wheelDelta<=-120 && isWheel==false && currentIndex<sectionLength-1 && currentIndex!=3 || // 전체 스크롤다운 조건
       e.wheelDelta<=-120 && isWheel==false && currentIndex==3 && portfolioIndex==portfolioLength-1){ // 포트폴리오 끝났을 때 스크롤다운 조건
      isWheel=true;
      currentIndex++;
      scrollEffect(currentIndex)
    }else if(e.wheelDelta>-120 && isWheel==false && currentIndex>0 && currentIndex!=3 || // 전체 스크롤업 조건
      e.wheelDelta>-120 && isWheel==false && currentIndex==3 && portfolioIndex==0){ // 포트폴리오 스크롤 안했을 때 스크롤업 조건
      isWheel=true;
      currentIndex--;
      scrollEffect(currentIndex)
    }
  }
  function scrollEffect(index){ // 스크롤 함수
    gsap.to(body,{scrollTop:contentsHeight*index, duration:0.8, onComplete:()=>{
      isWheel=false;
      scorllActive(currentIndex) // 각 영역에 함수 실행
    }})
    gsap.to(mainMenuBg,{top:97.5*index, duration:1})
  }
   // 스크롤에 맞춘 각 영역의 함수
  function scorllActive(index){
    switch(index){
      case 1:
        aboutEffect()
        break;
      case 2:
        servicesEffect()
        break;
      case 6:
        clientEffect()
        break;
    }
  }


  //비주얼효과
  function homeEffect(){
    const visualImg=document.querySelectorAll('#mainvisual_img_list>div>img')
    const mainText=document.querySelectorAll('.maintext')

    // 메인텍스트 효과
    let i=0;
    let mainTextLength=mainText.length
    let timer=setInterval(mainTextEffect,200)
    function mainTextEffect(){
      gsap.to(mainText[i],{top:0,opacity:1, duration:0.5})
      i++
      if(i>=mainTextLength){
        clearInterval(timer)
        gsap.to(document.querySelector('#greeting_01'),{width:80, delay:0.5, duration:0.4, ease:'steps(30)'})
        gsap.to(document.querySelector('#greeting_02'),{width:230, delay:2, duration:0.8, ease:'steps(30)'})
      }
    }
    // 마우스효과 실행
    section[0].addEventListener('mousemove', mouseEffect)
    function mouseEffect(e){
      let mousePosition=e.clientX;
      let currentRotate=-5+mousePosition*1/192
      gsap.to(visualImg,{transform:'rotateY('+currentRotate+'deg)', duration:1})
    }
  }

  // 포트폴리오효과
  function portfolioEffect(){
    const portfolioLi=document.querySelectorAll('.portfolio_box>li')
    let selectedLi;
    // 포트폴리오 스크롤
    window.addEventListener('mousewheel', portfolioWheel)
    function portfolioWheel(e){
      if(e.wheelDelta<=-120 && isWheel==false && currentIndex==3 && portfolioIndex!=portfolioLength-1){
        isWheel=true;
        portfolioIndex++;
        gsap.to(portfolioList,{left:-portfolioWidth*portfolioIndex, duration:1, onComplete:()=>{
          isWheel=false;
        }})
      }else if(e.wheelDelta>-120 && isWheel==false && currentIndex==3 && portfolioIndex!=0){
        isWheel=true;
        portfolioIndex--;
        gsap.to(portfolioList,{left:-portfolioWidth*portfolioIndex, duration:1, onComplete:()=>{
          isWheel=false;
        }})
      }
    }
    // 포트폴리오 플립
    for(const item of portfolioLi){
      item.addEventListener('mouseenter', portfolioFlip)
    }
    portfolioList.addEventListener('mouseleave', ()=>{selectedLi.classList.remove('selected')})
    function portfolioFlip(){
      if(selectedLi!=null){
        selectedLi.classList.remove('selected')
      }
      selectedLi=this;
      selectedLi.classList.add('selected')
    }
  }
  // 프로세스 슬라이드 효과
  function processEffect(){
    const processList=document.querySelector('#process_list')
    const processLi=document.querySelectorAll('#process_list>li')

    const nextBtn=document.querySelector('#next_btn')
    const prevBtn=document.querySelector('#prev_btn')

    let liIndex=0;
    let selectedLi=processLi[liIndex];
    let processLiLength=processLi.length
    let isSliding=false;

    gsap.set(processList,{height:630*processLiLength})
    nextBtn.addEventListener('click', slideNext)
    prevBtn.addEventListener('click', slidePrev)

    function slideNext(){
      if(isSliding==false){
        isSliding=true;
        selectedLi.classList.remove('selected')
        liIndex++;
        if(liIndex>=processLiLength-1){ // 다음 슬라이드가 없을 때 다음 버튼 없애기
          gsap.set(nextBtn,{display:'none'})
        }else{ // 이전 슬라이드가 있을 때 이전 버튼 보이기
          gsap.set(prevBtn,{display:'block'})
        }
        gsap.to(processList,{top:-630*liIndex, duration:0.5, delay:0.5, onComplete:()=>{
          selectedLi=processLi[liIndex]
          selectedLi.classList.add('selected')
          isSliding=false;
        }})
      }
    }
    function slidePrev(){
      if(isSliding==false){
        isSliding=true;
        selectedLi.classList.remove('selected')
        liIndex--;
        if(liIndex<=0){ // 이전 슬라이드가 없을 때 이전 버튼 없애기
          gsap.set(prevBtn,{display:'none'})
        }else{ // 다음 슬라이드가 있을 때 다음 버튼 보이기
          gsap.set(nextBtn,{display:'block'})
        }
        gsap.to(processList,{top:-630*liIndex, duration:0.5, delay:0.5, onComplete:()=>{
          selectedLi=processLi[liIndex]
          selectedLi.classList.add('selected')
          isSliding=false;
        }})
      }
    }
  }

 
  // About 탭 컨텐츠 나타나는효과
  function aboutEffect(){
    const aboutLeft=document.querySelector('#about_left')
    const aboutRight=document.querySelector('#about_right')

    gsap.to(aboutLeft,{left:395, opacity:1, delay:0.3, duration:1.5, ease:'back'})
    gsap.to(aboutRight,{right:215, opacity:1, delay:0.3, duration:1.5, ease:'back'})
  }
  // Services 탭 컨텐츠 나타나는 효과
  function servicesEffect(){
    const servicesLi=document.querySelectorAll('#services_list>li')

    let si=0;
    let timer=setInterval(servicesLiUp, 350)

    function servicesLiUp(){
      gsap.to(servicesLi[si],{top:80, opacity:1, duration:0.6, ease:'back'})
      si++
      if(si>=servicesLi.length){
        clearInterval(timer)
      }
    }
  }


  // Awards 탭 효과
  function awardEffect(){
    // 어워드 클래스 ('대상', 속도, '방향(left 또는 right)')
    let award1=new AwardSlide('#award_list1', 1, 'left')
    let award2=new AwardSlide('#award_list2', 1.5, 'right')
    let award3=new AwardSlide('#award_list3', 2, 'left')

    // 툴팁
    const awardContentsLi=document.querySelectorAll('.award_contents>li')

    for(const item of awardContentsLi){
      item.addEventListener('mouseenter', showToolTip)
      item.addEventListener('mousemove', moveToolTip)
      item.addEventListener('mouseleave', hideToolTip)
    }

    function showToolTip(e){
      gsap.set(this.children[0],{display:'block', left:e.clientX+20, top:e.clientY-40})
    }
    function moveToolTip(e){
      gsap.set(this.children[0],{left:e.clientX+20, top:e.clientY-40})
    }
    function hideToolTip(){
      gsap.set(this.children[0],{display:'none'})
    }
  }

  // Client 탭 숫자 더하기 효과
  function clientEffect(){
    let maxNum=[140,55,130,27] // 각 요소의 최대 숫자 (Project, Counsel, Client, Award)
    if(document.querySelector('#project_num').innerHTML!=maxNum[0]){
      let project=new ClientPlus('#project_num', maxNum[0], 2000)
      let counsel=new ClientPlus('#counsel_num', maxNum[1], 2000)
      let client=new ClientPlus('#client_num', maxNum[2], 2000)
      let award=new ClientPlus('#award_num', maxNum[3], 2000)
    }

  }


})

class ClientPlus{

  constructor(selectPlus, maxNum, time){ // 요쇼, 최대숫자, 카운트 실행시간
    this.clientNum=document.querySelector(selectPlus)

    this.maxNum=maxNum

    this.time=time

    let countTime=time/maxNum
    
    this.timer=setInterval(()=>{this.clientPlus()}, countTime)
    
  }
  clientPlus(){
    this.clientNum.innerHTML++;
    if(this.clientNum.innerHTML>=this.maxNum){
      clearInterval(this.timer)
    }
  }
}

class AwardSlide{ // 어워드 클래스
    
  constructor(selectAward, speed, direction){ // 대상, 속도, 방향
    this.awardList=document.querySelector(selectAward)
    this.speed=speed
    if(direction=='left'){
      this.direction=1
    }else if(direction=='right'){
      this.direction=-1
    }
    this.awardContentWidth=this.awardList.children[0].offsetWidth
    this.init()
    this.initEvent()
  }
  init(){
    gsap.set(this.awardList,{width:this.awardContentWidth*2+1})
    if(this.direction==-1){
      gsap.set(this.awardList,{left:-this.awardContentWidth})
    }
  }
  initEvent(){
    setInterval(()=>{
      let currentLeft=this.awardList.offsetLeft
      if(currentLeft<=this.awardContentWidth*-1){
        currentLeft=0;
      }else if(currentLeft>=0){
        currentLeft=-this.awardContentWidth;
      }
      gsap.set(this.awardList,{left:currentLeft-this.speed*this.direction})
    }, 10)
  }
}


