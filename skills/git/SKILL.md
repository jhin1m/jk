---
name: git
description: 'Thao tác git qua agent haiku rẻ — commit theo Conventional Commits (tự tách theo nhóm), push, tạo PR, merge. Luôn quét secret trước khi commit.'
when_to_use: '"commit", "push", "tạo PR", "merge nhánh", "cm", "cp".'
argument-hint: "cm | cp | pr [to] [from] | merge [to] [from]"
---

# /jk:git

Lệnh: $ARGUMENTS

| Lệnh | Việc |
|---|---|
| `cm` | Commit (tách theo nhóm logic) |
| `cp` | Commit rồi push nhánh hiện tại |
| `pr [to=main] [from=nhánh hiện tại]` | Push + tạo PR bằng `gh pr create` |
| `merge [to=main] [from=nhánh hiện tại]` | Merge `from` vào `to` |

Không có đối số → hỏi bằng AskUserQuestion chọn một trong bốn.

## Chạy
- `cm` / `cp`: spawn `jk:committer` (haiku) với lệnh tương ứng. Truyền thêm 1–2 câu tóm tắt mục đích thay đổi nếu cuộc trò chuyện có (giúp message đúng ý). Đang ở `main` với `cp` → hỏi người dùng có muốn tạo nhánh trước không.
- `pr`: sau commit/push, tự viết PR: tiêu đề theo commit chính; body gồm Tóm tắt · Thay đổi · Cách kiểm chứng · Rủi ro. Link plan nếu có (đường dẫn tương đối repo). Không nhắc AI.
- `merge`: kiểm working tree sạch → `git fetch` → merge. Có conflict → liệt kê file conflict và dừng, không tự giải quyết nếu chưa được đồng ý.

## An toàn
- Phát hiện secret → chặn commit, chỉ ra file + dòng.
- Không `--force` lên main/master. Không `reset --hard`, `clean -fd` khi chưa hỏi.
- Push bị từ chối → đề xuất `git pull --rebase`, không tự force.

## Báo cáo
```
✓ commit: <hash> <message>   (mỗi commit một dòng)
✓ push: có/không
✓ PR: <url>
```
