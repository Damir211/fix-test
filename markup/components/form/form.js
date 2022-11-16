//Скрипты для формы и инпутов
const inputsContainers = document.querySelectorAll('.input');
inputsContainers.forEach(inputContainer => {
    const input = inputContainer.querySelector('input');
    input.addEventListener('input', () => {
        if(input.value.trim()) return input.classList.add('active-placeholder');
        input.classList.remove('active-placeholder');
    });
});

function ValidateForm( form, callback ){
    this.validateInputs = form.querySelectorAll('[data-validate]');
    this.validateHandlersIsInited = false;
    this.validateInputHandlersInit = () => this.validateInputs.forEach(input => {
        if(input.dataset.validate === "required"){
            input.addEventListener('input', () => {
                if(input.value.trim().length) return input.classList.remove('error');
                input.classList.add('error');
            });
        }
        if(input.dataset.validate === "email"){
            input.addEventListener('input', () => {
                if(validateEmail( input.value )) return input.classList.remove('error');
                input.classList.add('error');
            });
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let error = false;

        this.validateInputs.forEach(input => {
            if(!this.validateHandlersIsInited){
                this.validateInputHandlersInit();
                this.validateHandlersIsInited = true;
            }
            if(input.dataset.validate === "required" && !input.value.trim().length){
                input.classList.add('error');
                error = true;
            } 
            if(input.dataset.validate === "email" && !validateEmail( input.value )){
                input.classList.add('error');
                error = true;
            }
        });

        if(!error){
            callback();
        }
    });
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};