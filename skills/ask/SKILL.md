---
name: ask
description: 'Trả lời câu hỏi kỹ thuật/kiến trúc dựa trên code thật của repo — chỉ phân tích, không sửa file. Dùng khi muốn hiểu, so sánh, đánh giá trước khi quyết định.'
when_to_use: '"giải thích", "cái này hoạt động thế nào", "nên dùng X hay Y", "có ổn không", hỏi đáp không kèm yêu cầu sửa.'
argument-hint: "<câu hỏi>"
disallowed-tools: Edit Write NotebookEdit
---

# /jk:ask

Câu hỏi: $ARGUMENTS

Chế độ chỉ đọc: không sửa file, không chạy lệnh ghi (install, migrate, commit…).

1. **Nền**: chốt người hỏi thật sự cần biết gì để làm gì. Câu hỏi về một vấn đề cần *đánh giá*, không cần bản sửa.
2. **Neo vào code**: câu trả lời liên quan repo → đọc code/config thật trước (Grep/Read; vùng rộng → `jk:scout`). Liên quan thư viện có thể đã đổi version → tra docs hiện hành (context7/WebFetch), đừng dựa trí nhớ.
3. **Trả lời**:
   - Câu đầu là câu trả lời trực tiếp.
   - Dẫn chứng `file:line` cho khẳng định về repo.
   - So sánh phương án → bảng ngắn + **một khuyến nghị**, không liệt kê cho có.
   - Phân biệt rõ: đã kiểm trong code vs kiến thức chung chưa kiểm.
4. Câu trả lời dẫn tới việc cần làm → gợi ý lệnh tiếp: `/jk:plan`, `/jk:cook`, `/jk:fix`.

Câu hỏi khó, sai thì đắt (kiến trúc, bảo mật, dữ liệu) → áp dụng `/jk:think` mức Đầy đủ.
