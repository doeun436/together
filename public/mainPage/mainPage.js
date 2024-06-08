const br = document.createElement('br');

// 유저 이름 로드
function loadUserName() {
    fetch('/get-username')
    .then(response => response.json())
    .then(data => {
        const username = data.username;
        const userNameText = document.getElementById('userName');
        userNameText.textContent = username;
    })
    .catch(error => {
        console.error('사용자 이름 가져오기 중 오류:', error);
    });
}

// 페이지 로드 시 이름 갱신
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.href.includes("mypage.html")) {
        loadUserName();
    }
});

// 그룹 목록 로드
function loadGroups() {
    fetch('/groups')
        .then(response => response.json())
        .then(groups => {
            const myGroupText = document.getElementById('myGroupText');
            const container = document.getElementById('content-container');
            if (groups.length === 0) {
                myGroupText.style.display = 'block';
            } else {
                myGroupText.style.display = 'none';
                groups.forEach(group => {
                    const groupElement = document.createElement('div');
                    groupElement.className = 'group-item';
                    groupElement.id = group.inviteCode;
                    groupElement.innerHTML = 
                    `<div class="text-container">
                    <div class="small-text">초대 코드: ${group.inviteCode}</div>
                    <div class="title-text">그룹 이름: ${group.groupName}</div></div>
                    <button class="rightArrow-icon"></button> 
                    <button class="bigXBtn" onclick="groupDelete(event)"></button>`;
                    container.appendChild(groupElement);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// 승인 대기 중인 그룹 목록 로드
function loadInviteGroups() {
    fetch('/invite-groups')
        .then(response => response.json())
        .then(inviteGroups => {
            const contentText = document.getElementById('invite-contentText');
            const container = document.getElementById('content-container');
            if (inviteGroups.length === 0) {
                contentText.style.display = 'block';
            } else {
                contentText.style.display = 'none';
                inviteGroups.forEach(inviteGroup => {
                    container.style.padding = '24px';

                    const invite_groupElement = document.createElement('div');
                    invite_groupElement.className = 'group-item';
                    invite_groupElement.innerHTML = 
                    `<div class="text-container">
                    <div class="small-text">초대 코드: ${inviteGroup.inviteCode}</div>
                    <div class="title-text">그룹 이름: ${inviteGroup.groupName}</div></div>`;
                    container.appendChild(invite_groupElement);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.href.includes("plus-group.html")) {
        loadInviteGroups();
    }
});


// 내 그룹, 참여중인 그룹 로드
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.href.includes("main.html")) {
        loadGroups();
        
        document.getElementById('myGroupButton').addEventListener('click', function() {

        document.getElementById('groupText').style.display = 'none';
        this.classList.add('box-button-select');
        this.classList.remove('box-button-dis');
    
        document.getElementById('joinedGroupButton').classList.add('box-button-dis');
        document.getElementById('joinedGroupButton').classList.remove('box-button-select');
        });
        
        document.getElementById('joinedGroupButton').addEventListener('click', function() {
            document.getElementById('groupText').style.display = 'block';
        
            this.classList.add('box-button-select');
            this.classList.remove('box-button-dis');
        
            document.getElementById('myGroupButton').classList.add('box-button-dis');
            document.getElementById('myGroupButton').classList.remove('box-button-select');
        });
    }
});

// 이름 수정
function editUsername() {
    var newUsername = prompt("변경할 닉네임을 입력하세요:");
    if (newUsername !== null && newUsername !== "") {
        document.getElementById("userName").textContent = newUsername;
    }

    fetch('/save-username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newUsername })
    })
    .then(response => response.json())
    .then(data => {
      console.log('사용자 이름이 저장되었습니다:', data.username.newUsername);
    })
    .catch(error => {
      console.error('오류 발생:', error);
    });
}

// 로그아웃
function logOutOK() {
    document.getElementById('xBtn').style.display = 'none';

    document.getElementById('overlayText').innerHTML = '성공적으로<br>로그아웃 하였습니다';

    document.getElementById('overlayText').classList.add('message');
    document.getElementById('overlayText').classList.remove('overlayText');

    document.getElementById('overlayText-small').innerHTML = '메인 화면으로 돌아갑니다';

    document.getElementById('overlayText-small').classList.add('message-small');
    document.getElementById('overlayText-small').classList.remove('overlayText-small');

    document.getElementById('overlayTap-top').classList.add('messageTap');
    document.getElementById('overlayTap-top').classList.remove('overlayTap-top');

    document.getElementById('overlayTap-bottom').style.display = 'none';

    document.getElementById('overlayTap-top').addEventListener('click', function() {
        window.location.href = '/mainPage/index.html';
    });
}

// 회원탈퇴
function withdrawalOK() {
    // 이름 기본 이름으로 변경
    const newUsername = '기본 이름';

    fetch('/save-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newUsername })
      })
      .then(response => response.json())
      .then(data => {
        console.log('사용자 이름이 변경되었습니다:', data.username.newUsername);
      })
      .catch(error => {
        console.error('오류 발생:', error);
    });

    // 승인 대기 중인 그룹 삭제
    fetch('/delete-all-groups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('모든 그룹이 삭제되었습니다.');
            // 그룹 목록 등을 업데이트하는 등의 추가 작업을 수행할 수 있습니다.
        } else {
            alert('그룹 삭제에 실패했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('그룹 삭제 중 오류가 발생했습니다.');
    });

    document.getElementById('xBtn-withdrawa').style.display = 'none';

    document.getElementById('overlayText-withdrawa').innerHTML = '성공적으로<br>탈퇴 하였습니다';

    document.getElementById('overlayText-withdrawa').classList.add('message');
    document.getElementById('overlayText-withdrawa').classList.remove('overlayText');

    document.getElementById('overlayText-small-withdrawa').innerHTML = '메인 화면으로 돌아갑니다';

    document.getElementById('overlayText-small-withdrawa').classList.add('message-small');
    document.getElementById('overlayText-small-withdrawa').classList.remove('overlayText-small');

    document.getElementById('overlayTap-top-withdrawa').classList.add('messageTap');
    document.getElementById('overlayTap-top-withdrawa').classList.remove('overlayTap-top');

    document.getElementById('overlayTap-bottom-withdrawa').style.display = 'none';

    document.getElementById('overlayTap-top-withdrawa').addEventListener('click', function() {
        window.location.href = '/mainPage/index.html';
    });
}

// 로그아웃 모달 열기
function logOut() {
    var overlay = document.getElementById('logOutOverlay');
    overlay.style.display = 'block';

    var buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(function(button) {
        button.disabled = true;
    });
}

// 회원탈퇴 모달 열기
function withdrawal() {
    var overlay = document.getElementById('withdrawalOverlay');
    overlay.style.display = 'block';

    var buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(function(button) {
        button.disabled = true;
    });
}

// 오버레이 숨기기
function hideOverlay() {
    document.getElementById('logOutOverlay').style.display = 'none';
    document.getElementById('withdrawalOverlay').style.display = 'none';

    var buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(function(button) {
        button.disabled = false;
    });
}

// 그룹 생성 모달 열기
function groupCreateOpen() {
    var overlay = document.getElementById('groupCreate-overlay');
    overlay.style.display = 'block';

    var buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(function(button) {
        button.disabled = true;
    });
}

// 그룹 참여 모달 열기
function groupJoinOpen() {
    var overlay = document.getElementById('groupJoin-overlay');
    overlay.style.display = 'block';

    var buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(function(button) {
        button.disabled = true;
    });
}

// 그룹 모달 닫기
function groupOverlayHide() {
    document.getElementById('alterTap-create').style.display = 'none';
    document.getElementById('alterTap-join').style.display = 'none';
    document.getElementById('groupCreate-overlay').style.display = 'none';
    document.getElementById('groupJoin-overlay').style.display = 'none';
    document.getElementById('groupName').value = '';
    document.getElementById('groupCode').value = '';
    document.getElementById('overlay-create').style.display ='block';
    document.getElementById('overlay-create-ok').style.display ='none';
    document.getElementById('checkBtn-create').style.display = 'block';
    document.getElementById('overlay-join').style.display ='block';
    document.getElementById('overlay-join-ok').style.display ='none';

    var buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(function(button) {
        button.disabled = true;
    });

    location.reload(true);
}

// 그룹 생성
function groupCreate() {
    const groupName = document.getElementById('groupName').value;
    document.getElementById('groupName').value = '';

    if (groupName.length != 0 && groupName.length <= 9) {
        fetch('/groups')
            .then(response => response.json())
            .then(groups => {
                if(groups.length >= 6) {
                    alert("그룹은 최대 6개까지 생성 가능합니다.");
                } else {
                    fetch('/create-group', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ groupName })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            const inviteCode = data.inviteCode;
                            document.getElementById('invite-code').textContent = inviteCode;
                
                            document.getElementById('overlay-create').style.display = 'none';
                            document.getElementById('overlay-create-ok').style.display = 'block';
                        } else {
                            alert('그룹 생성에 실패했습니다.');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('그룹 생성 중 오류가 발생했습니다.');
                    });

                    document.getElementById('overlay-create').style.display ='none';
                    document.getElementById('overlay-create-ok').style.display ='block';
                    document.getElementById('checkBtn-create').style.display = 'none';
                    document.getElementById('alterTap-create').style.display = 'none';
                }
        });
    } else if (groupName.length == 0 || groupName.length > 9) {
        document.getElementById('alterTap-create').style.display = 'block';
    }
}

// 그룹 참여
function groupJoin() {
    var devCode = 123456;
    var groupName = '테스트용 그룹';

    var inviteCode = document.getElementById('groupCode').value;
    document.getElementById('groupCode').value = '';

    if(inviteCode == devCode) {
    fetch('/invite-groups')
            .then(response => response.json())
            .then(inviteGroups => {
                if(inviteGroups.length >= 5) {
                    alert("그룹은 최대 5개까지 참여 가능합니다.");
                } else {
                    fetch('/join-group', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ groupName, inviteCode })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            document.getElementById('alterTap-join').style.display = 'none';
                            document.getElementById('overlay-join').style.display ='none';
                            document.getElementById('overlay-join-ok').style.display ='block';
                            document.getElementById('myCode').textContent = inviteCode;
                        } else {
                            alert('그룹 참여에 실패했습니다.');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('그룹 참여 중 오류가 발생했습니다.');
                    });
                }
        });
    } else if (inviteCode == null || inviteCode != devCode) {
        document.getElementById('alterTap-join').style.display = 'block';
    }
}

// 관리 모드로 전환
function managementOn() {
    document.getElementById('management-overlay').style.display = 'block';

    // 그룹 이동 버튼 제거
    var rightArrow = document.getElementsByClassName('rightArrow-icon');
    for( var i = 0; i < rightArrow.length; i++ ){
        var rightArrowItem = rightArrow.item(i);
        rightArrowItem.style.display = "none";
    }

    // 그룹 제거 버튼 생성
    var xBtn = document.getElementsByClassName('bigXBtn');
    for(var j = 0; j < xBtn.length; j++ ){
        var xBtnItem = xBtn.item(j);
        xBtnItem.style.display = "block";
    }
}

// 그룹 제거
function groupDelete(event) {
    const parentDiv = event.target.parentElement;
    const parentDivID = parentDiv.id;
    parentDiv.remove();
    
    // 제거한 그룹의 id 를 서버로 전송
    fetch('/group-delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: parentDivID })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}