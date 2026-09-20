---
name: fix
description: 'Sửa bug, test fail, type/lint error, lỗi CI theo quy trình bắt buộc tìm nguyên nhân gốc có bằng chứng trước khi sửa, rồi chứng minh hết lỗi và không side-effect.'
when_to_use: '"bị lỗi", "không chạy", "sửa lỗi", "debug", "tại sao X", "test fail", "CI đỏ", dán stack trace/log.'
argument-hint: "[--quick] <mô tả lỗi | log | stack trace | link CI>"
---

# /jk:fix

Lỗi: $ARGUMENTS

## Mức (tự suy ra, không cần cờ)

| Dấu hiệu | Chẩn đoán |
|---|---|
| Lỗi tự nói ra nguyên nhân: typo, import sai, type/lint chỉ đúng một dòng, thiếu key config | Xác định file + nguyên nhân 1 câu → sửa → chạy lại đúng lệnh đã báo lỗi. Bỏ bước 1–2 |
| Còn lại | Đủ bước 1–5 |

`--quick` ép mức nhanh. Lỗi chỉ *trông có vẻ* hiển nhiên (flaky, lúc được lúc không, không tái hiện ổn định) thì **không** thuộc hàng trên.

**Cấm đề xuất hay viết bản sửa trước khi xong bước 1–2.** Sửa triệu chứng = thất bại.

## 1. Scout
- File nơi lỗi hiện ra + nơi gọi nó + test đang phủ vùng đó.
- `git log --oneline -15 -- <file>` — commit gần đây có thể là thủ phạm.
- Vùng lạ → spawn `jk:scout` (haiku).

## 2. Chẩn đoán
Ghi lại **trạng thái trước khi sửa**: lệnh tái hiện + output nguyên văn. Đây là mốc để so ở bước 4.

Áp dụng kỷ luật `/jk:think`: giữ ≥ 2 giả thuyết, chọn phép kiểm phân biệt chúng, đòi chuỗi cơ chế.

Chỉ được sang bước 3 khi trả lời được mỗi mục bằng một câu cụ thể:
1. **Triệu chứng**: message/assertion/hành vi — chép nguyên văn.
2. **Tái hiện**: chuỗi tối thiểu gây lỗi (lệnh, input, môi trường).
3. **Mong đợi vs thực tế**.
4. **Nguyên nhân gốc**: dòng cụ thể / check thiếu / race / vi phạm contract — dẫn `file:line`.
5. **Vì sao giờ mới lỗi**: commit, dữ liệu, env, nâng cấp dependency nào làm lộ ra.
6. **Phạm vi ảnh hưởng**: các đường code khác phụ thuộc hành vi hỏng hoặc chung nguyên nhân.

Mục nào còn "chắc là", "có lẽ" → đi thu thêm bằng chứng (log, chạy thử, bisect) hoặc hỏi người dùng. Không đoán.

## 3. Sửa
Sửa tại nguyên nhân, không tại triệu chứng. Thay đổi nhỏ nhất đủ đúng, theo pattern có sẵn.

## 4. Kiểm chứng + phòng tái phát
1. Chạy lại đúng lệnh tái hiện ở bước 2 → so output trước/sau.
2. Có test framework → thêm test fail khi chưa sửa, pass khi đã sửa.
3. Chạy test trong phạm vi ảnh hưởng đã xác định ở mục 6 — đúng vùng đó, không chỉ file đã sửa và cũng không phải cả bộ.
4. Type-check/lint/build không có lỗi mới. Contract công khai không đổi.
5. Mức **M/L** (≥ 3 file, hoặc chạm logic nghiệp vụ/auth/tiền/dữ liệu, hoặc đổi contract) → spawn `jk:reviewer` kiểm: đã sửa đúng gốc chưa, có vỡ gì trong phạm vi ảnh hưởng không. Mức **S** → tự đọc lại diff.

Điểm 1 là bắt buộc ở mọi mức — không có nó thì không biết đã sửa được hay chưa.

Side-effect → DỪNG, hỏi người dùng với 2–4 lựa chọn (revert thử hướng khác / thu hẹp phạm vi sửa / cập nhật chỗ phụ thuộc / chấp nhận). Không vá lặng lẽ.

## Luật 3 lần
Kiểm chứng fail → quay lại bước 2 (chẩn đoán lại, không sửa thêm lên bản sửa cũ).
Sau **2** lần fail → spawn `jk:advisor` (Fable) với: triệu chứng, bằng chứng, các giả thuyết đã loại, các lần sửa đã thử.
Sau **3** lần fail → dừng, nói với người dùng: có thể vấn đề nằm ở thiết kế, bàn trước khi thử tiếp.

## 5. Báo cáo
```
Nguyên nhân: … (file:line)
Sửa: … (file)
Bằng chứng: output trước → sau
Test thêm: … | Phạm vi đã kiểm: …
Chưa kiểm được: … (nếu có)
```
Không commit trừ khi được yêu cầu → gợi ý `/jk:git cm`.
