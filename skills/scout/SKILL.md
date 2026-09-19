---
name: scout
description: 'Dò codebase tìm file liên quan tới một việc, bằng agent haiku rẻ chạy song song. Trả về bản đồ file + pattern, không sửa gì.'
when_to_use: '"tìm file", "code X nằm ở đâu", "scout", "liệt kê file liên quan", trước khi làm ở vùng code lạ.'
argument-hint: "<việc cần tìm>"
---

# /jk:scout

Cần tìm: $ARGUMENTS

1. Tách việc thành các vùng tìm kiếm độc lập (ví dụ: route/API · component UI · store/state · test · config). Việc nhỏ → 1 vùng.
2. Spawn mỗi vùng một agent `jk:scout` (haiku), **tất cả trong cùng một message** để chạy song song. Tối đa 4 agent. Mỗi prompt ghi rõ: việc gốc, vùng của agent đó, thư mục nên xem.
3. Gộp kết quả, bỏ trùng, xếp theo mức liên quan:
```
## File chính      path:line — vai trò
## File liên quan
## Pattern cần theo
## Chưa rõ
```
Không đề xuất giải pháp trừ khi được hỏi. Gợi ý bước tiếp nếu hợp: `/jk:plan`, `/jk:fix`.
