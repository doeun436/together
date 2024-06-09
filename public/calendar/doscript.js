document.addEventListener("DOMContentLoaded", function() {
    const calendar = {
        currentMonth: new Date().getMonth(),  //현제 월
        currentYear: new Date().getFullYear(),  //현재 연도
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

    function fetchMarkedDates() {
        return fetch('/api/marked-dates')
            .then(response => response.json());
    }  // 백엔드 날짜 가져오기


    function renderCalendar(month, year) {
        
        const monthYear = document.getElementById("month");  // 월 표시
        const Year = document.getElementById("year");  // 연도 표시
        const daysContainer = document.getElementById("days");  // 날짜 표시
        const currentDateContainer = document.getElementById("current-date");  //오늘 날짜 표시

        const months = [
            "1월", "2월", "3월", "4월", "5월", "6월",
            "7월", "8월", "9월", "10월", "11월", "12월"
        ];

        
        monthYear.innerText = `${months[month]}`;  // 월 업데이트
        Year.innerText = `${year}`;  // 연도 업데이트
        

        daysContainer.innerHTML = "";  // 날짜 초기화

        const firstDay = new Date(year, month, 1).getDay();  // 해당 월 첫째 날 요일
        const adjustedFirstDay = (firstDay === 0 ? 6 : firstDay - 1); // 월요일부터 표시
        const lastDate = new Date(year, month + 1, 0).getDate();  // 해당 월 마지막 날짜
        const today = new Date();  // 오늘 날짜 

        const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();  // 현재 월 확인
        const currentDay = today.getDate();  // 오늘 날짜

        for (let i = 0; i < adjustedFirstDay; i++) {
            daysContainer.appendChild(document.createElement("span"));
        }  // 첫째 날 전까지 빈 칸 추가

        for (let day = 1; day <= lastDate; day++) {
            const dayElement = document.createElement("span");
            dayElement.innerText = day;

            const dayOfWeek = (new Date(year, month, day).getDay() + 6) % 7;


            if (calendar.holidays[`${month}-${day}`]) {
                dayElement.classList.add('holiday'); // 빨간 점선 원 표시
                dayElement.classList.add('redday');  // 빨간 텍스트 표시

            }  // 공휴일 표시

            if (isCurrentMonth && day === currentDay) {
                dayElement.classList.add('today');
            }  // 오늘 날짜 표시
            

            daysContainer.appendChild(dayElement);
        }

        if (isCurrentMonth) {
            currentDateContainer.innerText = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
        } else {
            currentDateContainer.innerText = '';
        } // 오늘 날짜 표시 업데이트
    }

    async function fetchMemberData() {
        try {
            const response = await fetch('/api/members');
            return await response.json();
        } catch (error) {
            console.error('Error fetching member data:', error);
            return [];
        }
    }  //멤버 벡엔드 가져오기
    

    document.getElementById("main-menu").addEventListener("click", function() {
        window.location.href = '../../mainPage/main.html';
    }); // 그룹 옆 < 버튼 클릭시 메인메뉴로 이동

    document.getElementById("members").addEventListener("click", function() {
        document.getElementById("modal").style.display = "block";
    }); // 멤버 버튼 클릭시 멤버창 표시

    document.querySelector(".close-button").addEventListener("click", function() {
        document.getElementById("modal").style.display = "none";
    }); // 닫기 버튼 클릭시 멤버창 닫기

    // 일정 화면으로 이동
    document.getElementById('schedule-button').addEventListener('click', function() {
        window.location.href = '../../schedule/android178/index.html';
    });

    // 체크리스트 화면으로 이동
    document.getElementById('checklist-button').addEventListener('click', function() {
        window.location.href = '../../checklist/chindex.html';
    });



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


  
 