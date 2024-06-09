const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const app = express();
const port = 3000;
const fs = require("fs");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mainPage", "index.html"));
});
app.get("/chindex/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "checklist", "chindex.html"));
});

// 각 기능별 middleware 설정
app.use(
  "/calendar",
  express.static(path.join(__dirname, "public", "calendar"))
);
app.use(
  "/checklist",
  express.static(path.join(__dirname, "public", "checklist"))
);
app.use(
  "/mainPage",
  express.static(path.join(__dirname, "public", "mainPage"))
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/asset", express.static(path.join(__dirname, "public", "asset")));
app.use("/scripts", express.static(path.join(__dirname, "public", "scripts")));

app.use(cors());
app.use(express.json());

// JSON 데이터를 저장할 파일 경로
const invite_dataFilePath = path.join(__dirname, "data", "invite_data.json"); 
const group_dataFilePath = path.join(__dirname, "data", "groups.json");
const user_dataFilePath = path.join(__dirname, "data", "user.json");
const DATA_FILE = path.join(__dirname, "data", "checklists.json");
const invite_group_dataFilePath = path.join(
  __dirname,
  "data",
  "invite-group.json"
);

// JSON 데이터를 저장할 디렉토리 생성
if (!fs.existsSync(path.dirname(group_dataFilePath))) {
  fs.mkdirSync(path.dirname(group_dataFilePath), { recursive: true });
}

if (!fs.existsSync(path.dirname(user_dataFilePath))) {
  fs.mkdirSync(path.dirname(user_dataFilePath), { recursive: true });
}

if (!fs.existsSync(path.dirname(invite_group_dataFilePath))) {
  fs.mkdirSync(path.dirname(invite_group_dataFilePath), { recursive: true });
}

if (!fs.existsSync(path.dirname(invite_dataFilePath))) {
  fs.mkdirSync(path.dirname(invite_dataFilePath), { recursive: true });
}


// JSON 파일이 없으면 빈 배열로 초기화
if (!fs.existsSync(group_dataFilePath)) {
  fs.writeFileSync(group_dataFilePath, JSON.stringify([]));
}

if (!fs.existsSync(user_dataFilePath)) {
  fs.writeFileSync(user_dataFilePath, JSON.stringify([]));
}

if (!fs.existsSync(invite_group_dataFilePath)) {
  fs.writeFileSync(invite_group_dataFilePath, JSON.stringify([]));
}

if (!fs.existsSync(invite_dataFilePath)) {
  fs.writeFileSync(invite_dataFilePath, JSON.stringify([]));
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// JSON 파일에서 체크리스트 데이터를 읽어오는 함수
function readData(callback) {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) {
      return callback(err);
    }
    try {
      const parsedData = JSON.parse(data);
      callback(null, parsedData);
    } catch (parseError) {
      callback(parseError);
    }
  });
}

// JSON 파일에 체크리스트 데이터를 저장하는 함수
function writeData(data, callback) {
  fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8", (err) => {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
}

// 그룹 생성 요청 처리
app.post("/create-group", (req, res) => {
  const { groupName } = req.body;
  const userData = JSON.parse(fs.readFileSync(user_dataFilePath, "utf8"));
  const inviteCode = Math.floor(100000 + Math.random() * 900000).toString();

  // 그룹 데이터 로드
  const groups = JSON.parse(fs.readFileSync(group_dataFilePath));

  // 그룹 데이터에 새 그룹 추가
  groups.push({ groupName, inviteCode });

  // 그룹 데이터 저장
  fs.writeFileSync(group_dataFilePath, JSON.stringify(groups));

  res.json({ success: true, inviteCode });
});

// 그룹 목록 요청 처리
app.get("/groups", (req, res) => {
  const groups = JSON.parse(fs.readFileSync(group_dataFilePath));
  res.json(groups);
});

// user 데이터 저장
app.post("/save-username", (req, res) => {
  const newUserName = req.body;
  try {
    // user 데이터 파일에서 사용자 데이터 읽기
    let userData = JSON.parse(fs.readFileSync(user_dataFilePath, "utf8"));

    // 새로운 사용자 이름으로 업데이트
    userData.username = newUserName;

    // 업데이트된 사용자 데이터를 파일에 쓰기
    fs.writeFileSync(user_dataFilePath, JSON.stringify(userData.username));

    // 클라이언트에 성공 응답 보내기
    res.json({ success: true, username: newUserName });
  } catch (error) {
    console.error("사용자 이름 저장 중 오류:", error);
    // 클라이언트에 오류 응답 보내기
    res
      .status(500)
      .json({ success: false, error: "사용자 이름 저장 중 오류 발생" });
  }
});

app.post("/save-code", (req, res) => {
  const newInviteCode = req.body; // 요청에서 초대 코드 추출

  try {
    // 초대 코드 데이터 파일에서 데이터 읽기
    let inviteData = JSON.parse(fs.readFileSync(invite_dataFilePath, "utf8"));

    // 새로운 초대 코드로 업데이트
    inviteData.inviteCode = newInviteCode;

    // 업데이트된 초대 코드 데이터를 파일에 쓰기
    fs.writeFileSync(invite_dataFilePath, JSON.stringify(inviteData.inviteCode));

    // 클라이언트에 성공 응답 보내기
    res.json({ success: true, inviteCode: newInviteCode });
  } catch (error) {
    console.error("초대 코드 저장 중 오류:", error);
    // 클라이언트에 오류 응답 보내기
    res
      .status(500)
      .json({ success: false, error: "초대 코드 저장 중 오류 발생" });
  }
});

// user 이름 가져오기
app.get("/get-username", (req, res) => {
  try {
    // user 데이터 파일에서 사용자 데이터 읽기
    let userData = JSON.parse(fs.readFileSync(user_dataFilePath, "utf8"));

    // 클라이언트에 사용자 이름 전송
    res.json({ username: userData.newUsername });
  } catch (error) {
    console.error("사용자 이름 불러오기 중 오류:", error);
    // 클라이언트에 오류 응답 보내기
    res.status(500).json({ error: "사용자 이름 불러오기 중 오류 발생" });
  }
});

// 그룹 참여 요청 처리
app.post("/join-group", (req, res) => {
  const { groupName, inviteCode } = req.body;

  // 그룹 데이터 로드
  const invite_groups = JSON.parse(fs.readFileSync(invite_group_dataFilePath));

  // 그룹 데이터에 새 그룹 추가
  invite_groups.push({ groupName, inviteCode });

  // 그룹 데이터 저장
  fs.writeFileSync(invite_group_dataFilePath, JSON.stringify(invite_groups));

  res.json({ success: true });
});

// 승인 대기 중인 그룹 가져오기
app.get("/invite-groups", (req, res) => {
  const inviteGroups = JSON.parse(fs.readFileSync(invite_group_dataFilePath));
  res.json(inviteGroups);
});

// 그룹을 전부 삭제
app.post("/delete-all-groups", (req, res) => {
  try {
    // 파일에서 데이터를 읽어옵니다.
    let inviteGroups = JSON.parse(
      fs.readFileSync(invite_group_dataFilePath, "utf8")
    );
    let myGroups = JSON.parse(fs.readFileSync(group_dataFilePath, "utf8"));

    // 그룹 데이터를 빈 배열로 초기화합니다.
    inviteGroups = [];
    myGroups = [];

    // 파일에 빈 배열을 씁니다.
    fs.writeFileSync(invite_group_dataFilePath, JSON.stringify(inviteGroups));
    fs.writeFileSync(group_dataFilePath, JSON.stringify(myGroups));

    // 클라이언트에 성공 응답을 보냅니다.
    res.json({ success: true, message: "모든 그룹이 삭제되었습니다." });
  } catch (error) {
    console.error("모든 그룹 삭제 중 오류:", error);
    // 클라이언트에 오류 응답을 보냅니다.
    res
      .status(500)
      .json({ success: false, error: "모든 그룹 삭제 중 오류 발생" });
  }
});

// 특정 그룹 삭제 (관리 모드에서)
app.post('/group-delete', (req, res) => {
  const groupId = req.body.id;
  let groups = JSON.parse(
    fs.readFileSync(group_dataFilePath, "utf8")
  );
  groups = groups.filter(group => group.inviteCode !== groupId);
  fs.writeFileSync(group_dataFilePath, JSON.stringify(groups));
});

// 체크리스트 데이터 가져오기
app.get("/api/checklists", (req, res) => {
  readData((err, data) => {
    if (err) {
      return res.status(500).send("데이터를 읽는 중 오류가 발생했습니다.");
    }
    res.json(data);
  });
});

// 특정 체크리스트 데이터 가져오기
app.get("/api/checklists/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);
  readData((err, data) => {
    if (err) {
      return res.status(500).send("데이터를 읽는 중 오류가 발생했습니다.");
    }
    if (index < 0 || index >= data.length) {
      return res
        .status(404)
        .send("해당 인덱스의 체크리스트가 존재하지 않습니다.");
    }
    console.log("Fetched checklist:", data[index]); // 디버깅 로그 추가
    res.json(data[index]);
  });
});

// 체크리스트 데이터 저장하기
app.post("/api/checklists", (req, res) => {
  const newChecklist = req.body;
  readData((err, data) => {
    if (err) {
      return res.status(500).send("데이터를 읽는 중 오류가 발생했습니다.");
    }
    data.push(newChecklist);
    writeData(data, (err) => {
      if (err) {
        return res
          .status(500)
          .send("데이터를 저장하는 중 오류가 발생했습니다.");
      }
      res.status(200).send("체크리스트가 성공적으로 저장되었습니다.");
    });
  });
});

// 체크리스트 데이터 수정하기
app.put("/api/checklists/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);
  const updatedChecklist = req.body;
  readData((err, data) => {
    if (err) {
      return res.status(500).send("데이터를 읽는 중 오류가 발생했습니다.");
    }
    if (index < 0 || index >= data.length) {
      return res
        .status(404)
        .send("해당 인덱스의 체크리스트가 존재하지 않습니다.");
    }
    data[index] = { ...data[index], ...updatedChecklist };
    writeData(data, (err) => {
      if (err) {
        return res
          .status(500)
          .send("데이터를 저장하는 중 오류가 발생했습니다.");
      }
      console.log("Updated checklist:", data[index]); // 디버깅 로그 추가
      res.status(200).json(data[index]); // 변경된 데이터를 클라이언트로 반환
    });
  });
});

// 체크리스트 데이터 삭제하기
app.delete("/api/checklists/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);
  readData((err, data) => {
    if (err) {
      return res.status(500).send("데이터를 읽는 중 오류가 발생했습니다.");
    }
    if (index < 0 || index >= data.length) {
      return res
        .status(404)
        .send("해당 인덱스의 체크리스트가 존재하지 않습니다.");
    }
    data.splice(index, 1);
    writeData(data, (err) => {
      if (err) {
        return res
          .status(500)
          .send("데이터를 저장하는 중 오류가 발생했습니다.");
      }
      res.status(200).send("체크리스트가 성공적으로 삭제되었습니다.");
    });
  });
});

// // 모든 체크리스트 가져오기
// app.get("/api/checklists", async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM checklists");
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: "Database error" });
//   }
// });

// // 특정 체크리스트 가져오기
// app.get("/api/checklists/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const [rows] = await db.query("SELECT * FROM checklists WHERE id = ?", [
//       id,
//     ]);
//     if (rows.length > 0) {
//       res.json(rows[0]);
//     } else {
//       res.status(404).json({ message: "Checklist not found" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: "Database error" });
//   }
// });

// // 체크리스트 추가
// app.post("/api/checklists", async (req, res) => {
//   const { type, name, memo, checked } = req.body;
//   try {
//     const [result] = await db.query(
//       "INSERT INTO checklists (type, name, memo, checked) VALUES (?, ?, ?, ?)",
//       [type, name, memo, checked]
//     );
//     const newChecklist = {
//       id: result.insertId,
//       type,
//       name,
//       memo,
//       checked,
//     };
//     res.status(201).json(newChecklist);
//   } catch (err) {
//     res.status(500).json({ error: "Database error" });
//   }
// });

// // 체크리스트 업데이트
// app.put("/api/checklists/:id", async (req, res) => {
//   const { id } = req.params;
//   const { type, name, memo, checked } = req.body;
//   try {
//     const [result] = await db.query(
//       "UPDATE checklists SET type = ?, name = ?, memo = ?, checked = ? WHERE id = ?",
//       [type, name, memo, checked, id]
//     );
//     if (result.affectedRows > 0) {
//       res.json({ id, type, name, memo, checked });
//     } else {
//       res.status(404).json({ message: "Checklist not found" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: "Database error" });
//   }
// });

// // 체크리스트 삭제
// app.delete("/api/checklists/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const [result] = await db.query("DELETE FROM checklists WHERE id = ?", [
//       id,
//     ]);
//     if (result.affectedRows > 0) {
//       res.status(204).end();
//     } else {
//       res.status(404).json({ message: "Checklist not found" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: "Database error" });
//   }
// });

// 날짜 샘플 데이터
const markedDates = [
  { year: 2024, month: 4, day: 1 },
  { year: 2024, month: 4, day: 5 },
  { year: 2024, month: 5, day: 10 },
  { year: 2024, month: 5, day: 15 },
];

app.get("/api/marked-dates", (req, res) => {
  res.json(markedDates);
});

// 샘플 멤버 데이터
const members = [
  { name: "Member 1" },
  { name: "Member 2" },
  { name: "Member 3" },
  { name: "Member 4" },
];

app.get("/api/members", (req, res) => {
  res.json(members);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
