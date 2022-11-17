// slider
function Slider(element){
    this.sliderWidth = element.offsetWidth;
    this.sliderElements = element.querySelectorAll('.slider__item');
    this.sliderElementsCount = this.sliderElements.length;
    this.sliderWrapper = element.querySelector('.slider__container');
    this.sliderLeftButton = element.querySelector('.slider__left');
    this.sliderRightButton = element.querySelector('.slider__right');
    this.maxLeftShiftPosition = this.sliderWidth * 0.2;
    this.maxRightShiftPosition = -((this.sliderWidth * 0.2) + (this.sliderElementsCount - 1) * this.sliderWidth);
    this.activeSlider = 0;
    this.sliderPosition = 0;

    this.sliderElements.forEach(slider => {
        slider.style.width = this.sliderWidth + 'px';
    })
    
    this.setActiveSlider = () => {
        this.sliderElements.forEach(element => {
            element.classList.remove('active');
        });
        this.sliderElements[this.activeSlider].classList.add('active');
    }
    this.setPositionSlider = () => {
        this.sliderPosition = -(this.activeSlider * this.sliderWidth);
        this.sliderWrapper.style.transition = '0.3s';
        this.sliderWrapper.addEventListener('transitionend', () => {        
            this.sliderWrapper.style.transition = 'none';
        }, {once: true})
        this.sliderWrapper.style.transform = `translateX(${this.sliderPosition}px)`;
    }

    
    //Обработчики на свайпы
    this.slideMoveHandler = (e) => {
        this.currentMousePosition = (e.clientX ? e.clientX : e.changedTouches[0].clientX) - this.startMousePosition + this.sliderPosition;
        if(this.currentMousePosition > this.maxLeftShiftPosition) this.currentMousePosition = this.maxLeftShiftPosition;
        if(this.currentMousePosition < this.maxRightShiftPosition) this.currentMousePosition = this.maxRightShiftPosition;
        this.sliderWrapper.style.transform = `translateX(${this.currentMousePosition}px)`;
    }
    this.slideStartMoveHandler = (e, moveHandler, endHandler) => {
        e.preventDefault();
        this.startMousePosition = (e.clientX ? e.clientX : e.changedTouches[0].clientX);
        this.sliderWrapper.addEventListener(moveHandler, this.slideMoveHandler)
        this.sliderWrapper.addEventListener(endHandler, () => {
            this.sliderWrapper.removeEventListener(moveHandler, this.slideMoveHandler);
            if(this.currentMousePosition <= this.sliderPosition + this.maxLeftShiftPosition 
            && this.currentMousePosition >= this.sliderPosition - this.maxLeftShiftPosition){
                this.setActiveSlider();
                this.setPositionSlider();
                console.log('center');
                return;
            }
            if(this.currentMousePosition > this.sliderPosition){
                this.activeSlider--;
                console.log('left');
                this.setActiveSlider();
                this.setPositionSlider();
                return;
            }
            if(this.currentMousePosition < this.sliderPosition){
                this.activeSlider++;
                console.log('right');
                this.setActiveSlider();
                this.setPositionSlider();
                return;
            }
            console.log(this.sliderPosition - this.maxLeftShiftPosition)
        }, {once: true});
    }
    this.sliderWrapper.addEventListener('mousedown', (e) => {
        this.slideStartMoveHandler(e, 'mousemove', 'mouseup');
    });
    this.sliderWrapper.addEventListener('touchstart', (e) => {
        this.slideStartMoveHandler(e, 'touchmove', 'touchend');
    });
    //Кнопки управления
    if(this.sliderRightButton){
        this.sliderRightButton.addEventListener('click', () => {
            if(this.activeSlider < (this.sliderElementsCount - 1)){
                this.activeSlider++;
                this.setActiveSlider();
                this.setPositionSlider();
            }
        });
    }
    if(this.sliderLeftButton){
        this.sliderLeftButton.addEventListener('click', () => {
            if(this.activeSlider){
                this.activeSlider--;
                this.setActiveSlider();
                this.setPositionSlider();
            }
        });
    }

}

const slider = document.querySelector('.slider');
const sliderInstance = new Slider(slider);