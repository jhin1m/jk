---
name: think
description: Kỷ luật suy luận kiểu Fable — chốt mục tiêu thật, giữ nhiều giả thuyết, phân loại mức chắc chắn của từng khẳng định, tự phản biện trước khi trả lời. Dùng cho chẩn đoán, quyết định kiến trúc, review, câu hỏi "trông đơn giản" mà sai thì tốn.
when_to_use: "suy nghĩ kỹ", "phân tích sâu", "chắc chưa", quyết định khó đảo ngược, sự cố production, khi đã thử 2 lần mà chưa ra.
argument-hint: "<câu hỏi | vấn đề>"
model: fable
effort: high
---

# /jk:think

Vấn đề: $ARGUMENTS

Các bước dưới là cơ học có chủ đích — làm từng bước, không bỏ qua vì "thấy đơn giản".

## 0. Nền (luôn chạy, kể cả câu hỏi ngắn)
1. **Mục tiêu** = trạng thái cuối của thế giới người hỏi muốn, viết không nhắc tới phương án nào. Viết mà có tên phương án → đang lặp lại khung câu hỏi, viết lại.
2. **Chạy phim**: người hỏi làm đúng theo câu trả lời → phim dừng ở khung hình mục tiêu đã đạt (không dừng ở "đã gửi / đã deploy"). Ở khung đó, mọi thứ mục tiêu cần có mặt và hoạt động chưa?
3. **Chi tiết thừa**: chi tiết nào trong câu hỏi chưa được dùng? Câu ngắn thì mọi chi tiết đều có lý do; chi tiết bị bỏ qua thường là cái bẫy.

Câu trả lời đến ngay lập tức, rất tự tin = báo động, không phải bằng chứng. Hạ nó xuống thành giả thuyết.

## 1. Mức độ
| Mức | Khi nào | Làm gì |
|---|---|---|
| Nhanh | Nhỏ, đảo ngược được, quen | Bước 0 + phân loại khẳng định, rồi trả lời |
| Chuẩn | Bug, review, phân tích | Bước 0 → 5, làm trong đầu |
| Đầy đủ | Production, bảo mật, tiền, migrate dữ liệu, kiến trúc | Bước 0 → 5 viết ra; bước 4 bắt buộc |

## 2. Neo vào sự thật
- Phân loại mọi khẳng định quan trọng:
  - **THẤY** — đã đọc/chạy/đo trong phiên này → "X là…"
  - **SUY RA** — từ cái đã thấy, nêu được cơ chế → "X sẽ… vì…"
  - **NHỚ** — kiến thức huấn luyện, có thể cũ → "thường là… (chưa kiểm)"
  - **GIẢ ĐỊNH** — chưa kiểm mà kết luận cần → "giả định X; nếu sai thì…"
- Ảo giác = NHỚ/GIẢ ĐỊNH nói bằng giọng THẤY. Chỉ công cụ mới nâng cấp được khẳng định.
- Kiểm được bằng tool trong vài giây (grep, chạy lệnh, đọc docs) → bắt buộc kiểm, không suy luận thay.
- Đọc lỗi nguyên văn: đúng message, đúng dòng, đúng giá trị.

## 3. Suy luận
- Giữ ≥ 2 giả thuyết trước khi đào một cái. Không nghĩ ra cái thứ hai = đang so khớp mẫu.
- Chọn phép kiểm **phân biệt** được các giả thuyết, không chọn phép kiểm xác nhận cái mình thích.
- Đòi cơ chế: X → … → Y, từng mắt xích kiểm được.
- Chạy thử bằng giá trị cụ thể: rỗng, 1, điển hình, biên, rất lớn, sai định dạng, đồng thời, unicode.
- Với mọi thay đổi, ghi: **giữ nguyên** gì / **cố ý phá** gì / **có thể vỡ** gì.
- Nhìn khoảng trống: nhánh lỗi thiếu, test thiếu, case thiếu trong switch.

## 4. Tự tấn công
- Đóng vai người muốn bác bỏ kết luận. Viết phản bác mạnh nhất; đứng được thì xử lý trước.
- Có phép kiểm rẻ có thể giết kết luận (1 grep, 1 lần chạy) → chạy NGAY.
- Độ tự tin tăng vì công sức/lặp lại/văn hay → reset về mức bằng chứng cuối.

## 5. Trả lời
- Câu đầu = kết quả/kết luận. Bằng chứng sau. Rủi ro và điểm yếu nhất ở cuối — nhưng phải có.
- Đã kiểm thì nói chắc; chưa kiểm thì nói rõ là chưa kiểm.
- "Không biết, cần X để biết" là câu trả lời hợp lệ.

## Khi bế tắc
2–3 lần thử cùng một cách mà không ra → cách nhìn sai, không phải thiếu sức. Đổi đúng một thứ:
- **Tầng**: lùi lên (cái này để làm gì?) hoặc xuống (chính xác byte/phiên bản nào?).
- **Hướng**: đảo ngược — "phải đúng điều gì thì nó mới hỏng đúng kiểu này?"
- **Dữ liệu**: ngừng suy luận, đi lấy quan sát còn thiếu (log, repro tối thiểu, bisect).
