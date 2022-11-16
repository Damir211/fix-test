//Скрипты для формы и инпутов
const inputsContainers = document.querySelectorAll('.input');
inputsContainers.forEach(inputContainer => {
    const input = inputContainer.querySelector('input');
    input.addEventListener('input', () => {
        if(input.value.trim()) return input.classList.add('active-placeholder');
        input.classList.remove('active-placeholder');
    });
});

