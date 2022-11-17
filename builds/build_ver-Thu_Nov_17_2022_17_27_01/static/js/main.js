"use strict";

//Скролл до элементов
var anchorLinksElements = document.querySelectorAll('[data-scroll-to]');
anchorLinksElements.forEach(function (link) {
  var selector = link.dataset.scrollTo;
  link.addEventListener('click', function (e) {
    e.preventDefault();
    scrollToElement(selector);
  });
});

function scrollToElement(selector) {
  var targetElement = document.querySelector(selector);
  if (!targetElement) return;
  targetElement.scrollIntoView({
    block: "start",
    behavior: "smooth"
  });
}
"use strict";

//Скрипты для формы и инпутов
var inputsContainers = document.querySelectorAll('.input');
inputsContainers.forEach(function (inputContainer) {
  var input = inputContainer.querySelector('input');
  input.addEventListener('input', function () {
    if (input.value.trim()) return input.classList.add('active-placeholder');
    input.classList.remove('active-placeholder');
  });
});

var validateEmail = function validateEmail(email) {
  return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

function ValidateForm(form, callback) {
  var _this = this;

  this.validateInputs = form.querySelectorAll('[data-validate]');
  this.validateHandlersIsInited = false;

  this.validateInputHandlersInit = function () {
    return _this.validateInputs.forEach(function (input) {
      if (input.dataset.validate === "required") {
        input.addEventListener('input', function () {
          if (input.value.trim().length) return input.classList.remove('error');
          input.classList.add('error');
        });
      }

      if (input.dataset.validate === "email") {
        input.addEventListener('input', function () {
          if (validateEmail(input.value)) return input.classList.remove('error');
          input.classList.add('error');
        });
      }
    });
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var error = false;

    _this.validateInputs.forEach(function (input) {
      if (!_this.validateHandlersIsInited) {
        _this.validateInputHandlersInit();

        _this.validateHandlersIsInited = true;
      }

      if (input.dataset.validate === "required" && !input.value.trim().length) {
        input.classList.add('error');
        error = true;
      }

      if (input.dataset.validate === "email" && !validateEmail(input.value)) {
        input.classList.add('error');
        error = true;
      }
    });

    if (!error) {
      callback();
    }
  });
} // Маска телеофна


var telInputs = document.querySelectorAll('.tel-mask');
telInputs.forEach(function (input) {
  var instanceInput = new MaskInput(input);
});

function MaskInput(input) {
  input.addEventListener('input', function (event) {
    var selectionCoords = input.selectionStart;
    var isEdit = false;
    if (selectionCoords !== input.value.length) isEdit = true;
    var eventDelete = ['deleteContentBackward', 'deleteWordBackward', 'deleteByCut'];
    if (event.inputType && eventDelete.includes(event.inputType)) return;
    var digitValue = input.value.replace('+7', '').replace(/\D/g, '');

    if (!event.inputType || event.inputType === "insertFromPaste") {
      if (digitValue.length === 11 && digitValue[0] === '8') digitValue = digitValue.slice(1);
    }

    var resultValue = '(###) ###-##-##';

    for (var i = 0; i < digitValue.length; i++) {
      resultValue = resultValue.replace('#', digitValue[i]);
    }

    if (resultValue.includes('#')) {
      resultValue = resultValue.split('#')[0];
    }

    input.value = '+7 ' + resultValue;
    if (isEdit) input.setSelectionRange(selectionCoords, selectionCoords);
  });
}
"use strict";

// slider
function Slider(element) {
  var _this = this;

  this.sliderWidth = element.offsetWidth;
  this.sliderElements = element.querySelectorAll('.slider__item');
  this.sliderElementsCount = this.sliderElements.length;
  this.sliderWrapper = element.querySelector('.slider__container');
  this.sliderLeftButton = element.querySelector('.slider__left');
  this.sliderRightButton = element.querySelector('.slider__right');
  this.maxLeftShiftPosition = this.sliderWidth * 0.2;
  this.maxRightShiftPosition = -(this.sliderWidth * 0.2 + (this.sliderElementsCount - 1) * this.sliderWidth);
  this.activeSlider = 0;
  this.sliderPosition = 0;
  this.sliderElements.forEach(function (slider) {
    slider.style.width = _this.sliderWidth + 'px';
  });

  this.setActiveSlider = function () {
    _this.sliderElements.forEach(function (element) {
      element.classList.remove('active');
    });

    _this.sliderElements[_this.activeSlider].classList.add('active');
  };

  this.setPositionSlider = function () {
    _this.sliderPosition = -(_this.activeSlider * _this.sliderWidth);
    _this.sliderWrapper.style.transition = '0.3s';

    _this.sliderWrapper.addEventListener('transitionend', function () {
      _this.sliderWrapper.style.transition = 'none';
    }, {
      once: true
    });

    _this.sliderWrapper.style.transform = "translateX(".concat(_this.sliderPosition, "px)");
  }; //Обработчики на свайпы


  this.slideMoveHandler = function (e) {
    _this.currentMousePosition = (e.clientX ? e.clientX : e.changedTouches[0].clientX) - _this.startMousePosition + _this.sliderPosition;
    if (_this.currentMousePosition > _this.maxLeftShiftPosition) _this.currentMousePosition = _this.maxLeftShiftPosition;
    if (_this.currentMousePosition < _this.maxRightShiftPosition) _this.currentMousePosition = _this.maxRightShiftPosition;
    _this.sliderWrapper.style.transform = "translateX(".concat(_this.currentMousePosition, "px)");
  };

  this.slideStartMoveHandler = function (e, moveHandler, endHandler) {
    e.preventDefault();
    _this.startMousePosition = e.clientX ? e.clientX : e.changedTouches[0].clientX;

    _this.sliderWrapper.addEventListener(moveHandler, _this.slideMoveHandler);

    _this.sliderWrapper.addEventListener(endHandler, function () {
      _this.sliderWrapper.removeEventListener(moveHandler, _this.slideMoveHandler);

      if (_this.currentMousePosition <= _this.sliderPosition + _this.maxLeftShiftPosition && _this.currentMousePosition >= _this.sliderPosition - _this.maxLeftShiftPosition) {
        _this.setActiveSlider();

        _this.setPositionSlider();

        console.log('center');
        return;
      }

      if (_this.currentMousePosition > _this.sliderPosition) {
        _this.activeSlider--;
        console.log('left');

        _this.setActiveSlider();

        _this.setPositionSlider();

        return;
      }

      if (_this.currentMousePosition < _this.sliderPosition) {
        _this.activeSlider++;
        console.log('right');

        _this.setActiveSlider();

        _this.setPositionSlider();

        return;
      }

      console.log(_this.sliderPosition - _this.maxLeftShiftPosition);
    }, {
      once: true
    });
  };

  this.sliderWrapper.addEventListener('mousedown', function (e) {
    _this.slideStartMoveHandler(e, 'mousemove', 'mouseup');
  });
  this.sliderWrapper.addEventListener('touchstart', function (e) {
    _this.slideStartMoveHandler(e, 'touchmove', 'touchend');
  }); //Кнопки управления

  if (this.sliderRightButton) {
    this.sliderRightButton.addEventListener('click', function () {
      if (_this.activeSlider < _this.sliderElementsCount - 1) {
        _this.activeSlider++;

        _this.setActiveSlider();

        _this.setPositionSlider();
      }
    });
  }

  if (this.sliderLeftButton) {
    this.sliderLeftButton.addEventListener('click', function () {
      if (_this.activeSlider) {
        _this.activeSlider--;

        _this.setActiveSlider();

        _this.setPositionSlider();
      }
    });
  }
}

var slider = document.querySelector('.slider');
var sliderInstance = new Slider(slider);
"use strict";

//Скрипт для видео плеера
document.addEventListener('DOMContentLoaded', function () {
  document.body.insertAdjacentHTML('beforeend', "<div class=\"videopopup\">\n            <div class=\"videopopup__close\"></div>\n            <div class=\"videopopup__overlay\"></div>\n            <div class=\"videopopup__container\"></div>\n        </div>");
  var closeButton = document.querySelector('.videopopup__close');
  var overlay = document.querySelector('.videopopup__overlay');
  closeButton.addEventListener('click', videoHide);
  overlay.addEventListener('click', videoHide);
});
var videoButtons = document.querySelectorAll('[data-youtubevideo-play]');
videoButtons.forEach(function (videoButton) {
  var source = videoButton.dataset.youtubevideoPlay;
  videoButton.addEventListener('click', function (e) {
    e.preventDefault();
    videoShow(source);
  });
});

function videoShow(source) {
  var container = document.querySelector('.videopopup__container');
  var videopopup = document.querySelector('.videopopup');
  var resultSource = source.includes('?') ? source.includes('autoplay') ? source : source + '&autoplay=1' : source + '?autoplay=1';
  var iframe = "<iframe width=\"560\" height=\"315\" \n    src=\"".concat(resultSource, "\" \n    title=\"YouTube video player\" frameborder=\"0\" \n    allow=\"accelerometer; autoplay; clipboard-write; \n    encrypted-media; gyroscope; picture-in-picture\" \n    allowfullscreen></iframe>");
  container.insertAdjacentHTML('beforeend', iframe);
  videopopup.classList.add('active');
  document.body.classList.add('no-scroll');
}

function videoHide() {
  var container = document.querySelector('.videopopup__container');
  var videopopup = document.querySelector('.videopopup');
  container.innerHTML = "";
  videopopup.classList.remove('active');
  document.body.classList.remove('no-scroll');
}