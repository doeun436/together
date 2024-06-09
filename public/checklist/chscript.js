document.addEventListener("DOMContentLoaded", (event) => {
  loadChecklists();
});

function openModal() {
  document.getElementById("checklist-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("checklist-modal").style.display = "none";
}

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function saveChecklist() {
  const personalTab =
    document.getElementById("personal").style.display === "block";
  const checklistType = personalTab ? "personal" : "shared";
  const name = document.getElementById(`${checklistType}-checklist-name`).value;
  const memo = document.getElementById(`${checklistType}-checklist-memo`).value;

  if (name && memo) {
    const checklist = {
      type: checklistType,
      name: name,
      memo: memo,
    };

    fetch("/api/checklists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checklist),
    })
      .then((response) => response.text())
      .then((message) => {
        alert(message);
        const index = document.getElementById("checklist-container").children
          .length;
        addChecklistToDOM(checklist, index);
        setCheckboxStatus(index, false); // 체크박스 상태를 로컬 스토리지에 저장
        closeModal();
        checkChecklistCount();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("체크리스트를 저장하는 중 오류가 발생했습니다.");
      });
  } else {
    alert("체크리스트 이름과 메모를 모두 입력해주세요.");
  }
}

function loadChecklists() {
  fetch("/api/checklists")
    .then((response) => response.json())
    .then((checklists) => {
      checklists.forEach((checklist, index) => {
        addChecklistToDOM(checklist, index);
      });
      checkChecklistCount();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("체크리스트를 불러오는 중 오류가 발생했습니다.");
    });
}

function addChecklistToDOM(checklist, index) {
  const checklistContainer = document.getElementById("checklist-container");
  const newChecklist = document.createElement("div");
  newChecklist.className = "checklist-item";
  const typeLabel = checklist.type === "personal" ? "개인" : "공용";
  const typeIcon =
    checklist.type === "personal"
      ? "/checklist/img/perCheckIcon.png"
      : "/checklist/img/comCheckIcon.png";
  const checkboxIcon = getCheckboxStatus(index)
    ? "/checklist/img/checkbtnact.svg"
    : "/checklist/img/checkBtn.svg";
  newChecklist.innerHTML = `
    <div class="checklist-header">
      <img src="${typeIcon}" class="checklist-icon" alt="${typeLabel}" />
      <div class="checklist-info">
        <span class="checklist-title">${checklist.name}</span>
        <span class="checklist-memo">${checklist.memo}</span>
      </div>
      <img src="${checkboxIcon}" class="checklist-checkbox" data-index="${index}" onclick="toggleCheckbox(${index})">
    </div>
  `;
  checklistContainer.appendChild(newChecklist);
}

function openManagementModal() {
  const managementContainer = document.getElementById(
    "checklist-management-container"
  );
  managementContainer.innerHTML = "";

  fetch("/api/checklists")
    .then((response) => response.json())
    .then((checklists) => {
      checklists.forEach((checklist, index) => {
        const newChecklist = document.createElement("div");
        newChecklist.className = "checklist-item";
        const typeLabel = checklist.type === "personal" ? "개인" : "공용";
        const typeIcon =
          checklist.type === "personal"
            ? "/checklist/img/perCheckIcon.png"
            : "/checklist/img/comCheckIcon.png";
        newChecklist.innerHTML = `
          <div class="checklist-header">
            <img src="${typeIcon}" class="checklist-icon" alt="${typeLabel}" />
            <div class="checklist-info">
              <span class="checklist-title">${checklist.name}</span>
              <span class="checklist-memo">${checklist.memo}</span>
            </div>
            <span class="edit-checklist" onclick="editChecklist(${index}, '${checklist.name}', '${checklist.memo}')">수정</span>
            <img src="/checklist/img/bigXBtn.svg" class="delete-checklist" onclick="deleteChecklist(${index})">
          </div>
        `;
        managementContainer.appendChild(newChecklist);
      });

      document.getElementById("management-modal").style.display = "flex";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("체크리스트를 불러오는 중 오류가 발생했습니다.");
    });
}

function closeManagementModal() {
  document.getElementById("management-modal").style.display = "none";
}

function openMemberModal() {
  document.getElementById("member-modal").style.display = "flex";
}

function closeMemberModal() {
  document.getElementById("member-modal").style.display = "none";
}

function editChecklist(index, oldName, oldMemo) {
  const name = prompt("새로운 체크리스트 이름을 입력하세요:", oldName);
  const memo = prompt("새로운 체크리스트 메모를 입력하세요:", oldMemo);

  if (name && memo) {
    fetch(`/api/checklists/${index}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, memo }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((message) => {
        alert(message);
        openManagementModal(); // 관리 모달을 다시 열어 갱신된 리스트를 보여줌
        reloadChecklists(); // 메인 체크리스트도 갱신
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("체크리스트를 수정하는 중 오류가 발생했습니다.");
      });
  } else {
    alert("체크리스트 이름과 메모를 모두 입력해주세요.");
  }
}

function deleteChecklist(index) {
  fetch(`/api/checklists/${index}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((message) => {
      alert(message);
      removeCheckboxStatus(index); // 체크리스트 상태 제거
      openManagementModal(); // 관리 모달을 다시 열어 갱신된 리스트를 보여줌
      reloadChecklists(); // 메인 체크리스트도 갱신
      checkChecklistCount(); // 체크리스트 갱신 후 플러스 아이콘 상태 확인
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("체크리스트를 삭제하는 중 오류가 발생했습니다.");
    });
}

function reloadChecklists() {
  const checklistContainer = document.getElementById("checklist-container");
  checklistContainer.innerHTML = "";
  loadChecklists();
}

function toggleCheckbox(index) {
  const checklistStatuses =
    JSON.parse(localStorage.getItem("checklistStatuses")) || {};
  const newStatus = !checklistStatuses[index];
  checklistStatuses[index] = newStatus;
  localStorage.setItem("checklistStatuses", JSON.stringify(checklistStatuses));

  const checkboxes = document.querySelectorAll(".checklist-checkbox");
  checkboxes.forEach((checkbox) => {
    const checkboxIndex = parseInt(checkbox.dataset.index, 10);
    checkbox.src = checklistStatuses[checkboxIndex]
      ? "/checklist/img/checkbtnact.svg"
      : "/checklist/img/checkBtn.svg";
  });

  console.log(`Toggle checkbox at index: ${index}, new status: ${newStatus}`); // 디버깅용 로그 추가
}

function setCheckboxStatus(index, status) {
  const checklistStatuses =
    JSON.parse(localStorage.getItem("checklistStatuses")) || {};
  checklistStatuses[index] = status;
  localStorage.setItem("checklistStatuses", JSON.stringify(checklistStatuses));
}

function getCheckboxStatus(index) {
  const checklistStatuses =
    JSON.parse(localStorage.getItem("checklistStatuses")) || {};
  return checklistStatuses.hasOwnProperty(index)
    ? checklistStatuses[index]
    : false;
}

function removeCheckboxStatus(index) {
  const checklistStatuses =
    JSON.parse(localStorage.getItem("checklistStatuses")) || {};
  delete checklistStatuses[index];
  localStorage.setItem("checklistStatuses", JSON.stringify(checklistStatuses));
}

function checkChecklistCount() {
  fetch("/api/checklists")
    .then((response) => response.json())
    .then((checklists) => {
      const plusIcon = document.querySelector(".plus-icon-container");
      if (checklists.length >= 6) {
        plusIcon.style.display = "none";
      } else {
        plusIcon.style.display = "flex";
      }
    });
}

  // 일정 화면으로 이동
  document.getElementById('schedule').addEventListener('click', function() {
    window.location.href = '../../schedule/android178/index.html';
  });

  // 캘린더 화면으로 이동
  document.getElementById('calendar').addEventListener('click', function() {
    window.location.href = '../../calendar/doindex.html';
  });

  document.getElementById("main-menu").addEventListener("click", function() {
    window.location.href = '../../mainPage/main.html';
});