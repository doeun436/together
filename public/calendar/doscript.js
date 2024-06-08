document.addEventListener("DOMContentLoaded", function() {
    const calendar = {
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        holidays: {
            '0-1': true,  // 1월 1일
            '2-1': true,  // 삼일절
            '4-5': true,  // 어린이날
            '4-15':true,  // 석가탄신일
            '5-6': true,  // 현충일
            '7-15': true, // 광복절
            '9-3': true,  // 개천절
            '9-9': true,  // 한글날
            '11-25': true // 크리스마스
            // 0 = 1 , 11 = 12
        }
    }; // 공휴일 지정

    function renderCalendar(month, year) {
        
        const monthYear = document.getElementById("month");
        const Year = document.getElementById("year");
        const daysContainer = document.getElementById("days");
        const currentDateContainer = document.getElementById("current-date");

        const months = [
            "1월", "2월", "3월", "4월", "5월", "6월",
            "7월", "8월", "9월", "10월", "11월", "12월"
        ];

        
        monthYear.innerText = `${months[month]}`;
        Year.innerText = `${year}`;
        

        daysContainer.innerHTML = "";

        const firstDay = new Date(year, month, 1).getDay();
        const adjustedFirstDay = (firstDay === 0 ? 6 : firstDay - 1); // 월요일부터 표시
        const lastDate = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
        const currentDay = today.getDate();

        for (let i = 0; i < adjustedFirstDay; i++) {
            daysContainer.appendChild(document.createElement("span"));
        }

        for (let day = 1; day <= lastDate; day++) {
            const dayElement = document.createElement("span");
            dayElement.innerText = day;

            const dayOfWeek = (new Date(year, month, day).getDay() + 6) % 7;


            if (calendar.holidays[`${month}-${day}`]) {
                dayElement.classList.add('holiday');
                dayElement.classList.add('redday');

            } //빨간날 표시

            if (isCurrentMonth && day === currentDay) {
                dayElement.classList.add('today');
            } //오늘 날짜 표시
            

            daysContainer.appendChild(dayElement);
        }
        

        if (isCurrentMonth) {
            currentDateContainer.innerText = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
        } else {
            currentDateContainer.innerText = '';
        }
    }
    
    

    document.getElementById("main-menu").addEventListener("click", function() {
        window.open('https://www.naver.com/')
    }); // 그룹 옆 <버튼 클릭시 메인메뉴로 이동

    document.getElementById("members").addEventListener("click", function() {
        window.open('https://www.naver.com/')
    }); // 그룹 옆 <버튼 클릭시 멤버창 이동

    document.getElementById("schedule-button").addEventListener("click", function() {
        window.open('https://www.naver.com/')
    }); // 그룹 옆 <버튼 클릭시 일정으로 이동
 
    document.getElementById("checklist-button").addEventListener("click", function() {
        window.open('https://www.naver.com/')
    }); // 그룹 옆 <버튼 클릭시 체크리스트로 이동



    document.getElementById("prev-month").addEventListener("click", function() {
        calendar.currentMonth--;
        if (calendar.currentMonth < 0) {
            calendar.currentMonth = 11;
            calendar.currentYear--;
        }
        renderCalendar(calendar.currentMonth, calendar.currentYear);
    }); // < 버튼 클릭시 전달 표시

    document.getElementById("next-month").addEventListener("click", function() {
        calendar.currentMonth++;
        if (calendar.currentMonth > 11) {
            calendar.currentMonth = 0;
            calendar.currentYear++;
        }
        renderCalendar(calendar.currentMonth, calendar.currentYear);
    });  // > 버튼 클릭시 다음달 표시

    

  
    renderCalendar(calendar.currentMonth, calendar.currentYear);
});
