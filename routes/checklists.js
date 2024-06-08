const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 체크리스트 모두 가져오기
router.get("/", (req, res) => {
  const sql = "SELECT * FROM checklists";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
});

// 새로운 체크리스트 생성
router.post("/", (req, res) => {
  const { name, memo, type, completed } = req.body;

  if (
    !name ||
    name.length > 9 ||
    !memo ||
    memo.length > 16 ||
    !["personal", "shared"].includes(type)
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const sql =
    "INSERT INTO checklists (name, memo, type, completed) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, memo, type, completed], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const newChecklist = { id: result.insertId, name, memo, type, completed };
    res.status(201).json(newChecklist);
  });
});

// 체크리스트 업데이트
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, memo, completed } = req.body;

  if (!name || name.length > 9 || !memo || memo.length > 16) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const sql =
    "UPDATE checklists SET name = ?, memo = ?, completed = ? WHERE id = ?";
  db.query(sql, [name, memo, completed, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Checklist not found" });
    }
    res.json({ id, name, memo, completed });
  });
});

// 체크리스트 삭제
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM checklists WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: "Deleted Checklist" });
  });
});

module.exports = router;
