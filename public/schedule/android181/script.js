document.addEventListener("DOMContentLoaded", () => {
    const hoursContainer = document.getElementById('hours');
    const minutesContainer = document.getElementById('minutes');
    const hoursDisplay = document.getElementById('hours-display');
    const minutesDisplay = document.getElementById('minutes-display');
    const timePicker = document.getElementById('time-picker');

    // Populate hours
    for (let i = 0; i < 24; i++) {
        let hourOption = document.createElement('div');
        hourOption.className = 'time-picker-option';
        hourOption.innerText = i < 10 ? '0' + i : i;
        hourOption.addEventListener('click', () => selectOption(hourOption, 'hours'));
        hoursContainer.appendChild(hourOption);
    }

    // Populate minutes with only 00 and 30
    [0, 30].forEach(i => {
        let minuteOption = document.createElement('div');
        minuteOption.className = 'time-picker-option';
        minuteOption.innerText = i < 10 ? '0' + i : i;
        minuteOption.addEventListener('click', () => selectOption(minuteOption, 'minutes'));
        minutesContainer.appendChild(minuteOption);
    });

    hoursDisplay.addEventListener('click', () => {
        timePicker.style.display = 'flex';
        hoursContainer.style.display = 'block';
        minutesContainer.style.display = 'none';
    });

    minutesDisplay.addEventListener('click', () => {
        timePicker.style.display = 'flex';
        hoursContainer.style.display = 'none';
        minutesContainer.style.display = 'block';
    });

    function selectOption(element, type) {
        const siblings = element.parentElement.children;
        for (let sibling of siblings) {
            sibling.classList.remove('selected');
        }
        element.classList.add('selected');
        updateTimeDisplay(type, element.innerText);
    }

    function updateTimeDisplay(type, value) {
        if (type === 'hours') {
            hoursDisplay.innerText = value;
            localStorage.setItem('selectedHours1', value); // 로컬 스토리지에 저장
        } else if (type === 'minutes') {
            minutesDisplay.innerText = value;
            localStorage.setItem('selectedMinutes1', value); // 로컬 스토리지에 저장
        }
        timePicker.style.display = 'none'; // Hide the picker after selection
    }
});
