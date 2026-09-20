---
name: ui
description: 'Làm và review giao diện có chủ đích — chốt hướng thẩm mỹ trước khi code, bám design system có sẵn của repo, kiểm tra accessibility, responsive, trạng thái tương tác. Tránh giao diện "AI generic".'
when_to_use: '"làm UI", "thiết kế màn hình", "đẹp hơn", "review giao diện", "responsive", "dark mode", component mới.'
argument-hint: "[review] <màn hình | component | mô tả>"
---

# /jk:ui

Việc: $ARGUMENTS

## 1. Nền trước khi vẽ
- Tìm design system có sẵn: CSS variables/tokens, theme Tailwind, component trong `components/ui`, màn hình tương tự đã có. **Dùng lại trước, tạo mới sau.**
- Chốt: người dùng là ai, làm việc gì trên màn này, thông tin nào quan trọng nhất. Thứ bậc thị giác theo đúng thứ tự đó.
- Chốt một hướng thẩm mỹ bằng 1 câu (vd: "gọn, nhiều khoảng trắng, một màu nhấn"). Không trộn nhiều phong cách.

## 2. Làm
- Màu/khoảng cách/bo góc/font lấy từ token, không hardcode giá trị lẻ.
- Đủ trạng thái: loading (skeleton đúng kích thước thật) · rỗng · lỗi · hover · focus · disabled · active.
- Responsive: mobile trước; không cuộn ngang; vùng chạm ≥ 44px.
- Chữ người dùng thấy → theo cơ chế i18n của repo nếu có.

## 3. Kiểm (cả khi làm lẫn khi `review`)
| Nhóm | Kiểm |
|---|---|
| Accessibility | tương phản ≥ 4.5:1 chữ thường; focus nhìn thấy được; label cho input/icon button; thứ tự tab hợp lý; `alt` ảnh |
| Layout | căn lề thẳng hàng; nhịp khoảng cách đều (bội số 4/8); không nhảy layout khi tải (CLS) |
| Chữ | tối đa 2 font; cỡ chữ theo thang; dòng ≤ ~75 ký tự; chữ dài/tiếng Việt có dấu không vỡ layout |
| Theme | dark mode (nếu repo có) không mất tương phản, không màu hardcode |
| Hiệu năng | ảnh có kích thước; không animation chặn tương tác; tôn trọng `prefers-reduced-motion` |

Chỉnh một component có sẵn (đổi token, màu, khoảng cách, thêm một trạng thái) → chỉ chạy hai hàng **Accessibility** và **Layout**. Màn hình mới, đổi layout, hoặc `review` → chạy cả bảng.

Dấu hiệu "AI generic" cần tránh: gradient tím-xanh vô cớ, bóng đổ + bo góc lớn khắp nơi, emoji làm icon, mọi thứ căn giữa, card lồng card.

## 4. Kiểm chứng bằng mắt
Không tuyên bố "đẹp/đúng" khi chưa nhìn bản render. Chụp bao nhiêu ảnh thì theo quy mô:

| Thay đổi | Ảnh cần chụp |
|---|---|
| Một component, không đổi layout | 1 ảnh ở khổ liên quan; có đụng màu → thêm ảnh theme còn lại |
| Màn hình mới hoặc đổi layout | 375px + 1280px, sáng + tối |

Không chạy được app → nói rõ "chưa nhìn bản render", đừng đoán.

`review` → báo cáo theo bảng trên: vấn đề · `file:line` · gợi ý sửa, xếp nặng → nhẹ.
