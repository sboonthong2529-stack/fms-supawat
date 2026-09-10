export const messages = {
  "facilities.nav": { th: "จัดการห้องและยานพาหนะ", en: "Facilities & Bookings" },
  "roles.module.facilities": { th: "ระบบจองห้องประชุมและยานพาหนะ", en: "Facility & Vehicle Booking" },
  "facilities.title": { th: "ระบบจัดการห้องประชุมและยานพาหนะ", en: "Facility & Vehicle Management" },
  "facilities.subtitle": { th: "บริหารจัดการทรัพยากรห้องประชุม ห้องปฏิบัติการ รถยนต์ส่วนกลาง และอนุมัติการจอง", en: "Manage rooms, labs, vehicles, and approve booking reservations" },
  "facilities.publicTitle": { th: "บริการจองห้องประชุมและยานพาหนะ", en: "Facility & Vehicle Booking" },
  "facilities.publicSubtitle": { th: "ตรวจสอบตารางเวลาว่างและส่งคำขอจองห้องประชุม ห้องปฏิบัติการ หรือรถยนต์ส่วนกลาง", en: "Check availability and reserve conference rooms, labs, or faculty vehicles" },
  
  // Tabs & Filters
  "facilities.tabs.rooms": { th: "ห้องประชุม/ห้องแล็บ", en: "Rooms & Labs" },
  "facilities.tabs.vehicles": { th: "ยานพาหนะส่วนกลาง", en: "Vehicles" },
  "facilities.tabs.bookings": { th: "รายการจองทั้งหมด", en: "All Bookings" },
  "facilities.tabs.calendar": { th: "ปฏิทินการใช้ห้อง", en: "Availability Calendar" },
  "facilities.type.all": { th: "ทุกประเภท", en: "All Types" },
  "facilities.type.meetingRoom": { th: "ห้องประชุม", en: "Meeting Room" },
  "facilities.type.lab": { th: "ห้องปฏิบัติการคอมพิวเตอร์", en: "Computer Lab" },
  "facilities.type.auditorium": { th: "ห้องประชุมใหญ่/หอประชุม", en: "Auditorium" },
  "facilities.type.vehicle": { th: "รถตู้/ยานพาหนะคณะ", en: "Faculty Vehicle" },
  
  // Fields for Facilities
  "facilities.field.code": { th: "รหัสทรัพยากร", en: "Resource Code" },
  "facilities.field.nameTh": { th: "ชื่อ (ไทย)", en: "Name (TH)" },
  "facilities.field.nameEn": { th: "ชื่อ (อังกฤษ)", en: "Name (EN)" },
  "facilities.field.type": { th: "ประเภท", en: "Type" },
  "facilities.field.capacity": { th: "ความจุ (ที่นั่ง/ผู้โดยสาร)", en: "Capacity" },
  "facilities.field.location": { th: "สถานที่ / ทะเบียนรถ", en: "Location / License Plate" },
  "facilities.field.amenities": { th: "อุปกรณ์และสิ่งอำนวยความสะดวก", en: "Amenities & Equipment" },
  "facilities.field.imageUrl": { th: "ลิงก์รูปภาพ", en: "Image URL" },
  "facilities.field.status": { th: "สถานะ", en: "Status" },
  "facilities.field.active": { th: "พร้อมใช้งาน", en: "Available" },
  "facilities.field.inactive": { th: "ปิดปรับปรุง", en: "Maintenance" },

  // Fields for Booking
  "facilities.booking.number": { th: "เลขที่การจอง", en: "Booking Number" },
  "facilities.booking.facility": { th: "ห้อง/ยานพาหนะที่จอง", en: "Reserved Facility" },
  "facilities.booking.bookerName": { th: "ชื่อผู้จอง", en: "Booker Name" },
  "facilities.booking.bookerEmail": { th: "อีเมลผู้จอง", en: "Booker Email" },
  "facilities.booking.bookerPhone": { th: "เบอร์โทรศัพท์", en: "Phone" },
  "facilities.booking.bookerDept": { th: "หน่วยงาน/ภาควิชา", en: "Department / Unit" },
  "facilities.booking.purpose": { th: "วัตถุประสงค์การใช้งาน", en: "Purpose" },
  "facilities.booking.startTime": { th: "เวลาเริ่มต้น", en: "Start Time" },
  "facilities.booking.endTime": { th: "เวลาสิ้นสุด", en: "End Time" },
  "facilities.booking.attendeeCount": { th: "จำนวนผู้เข้าร่วม", en: "Attendees" },
  "facilities.booking.status": { th: "สถานะการจอง", en: "Booking Status" },
  
  // Booking Statuses
  "facilities.status.pending": { th: "รออนุมัติ", en: "Pending" },
  "facilities.status.approved": { th: "อนุมัติแล้ว", en: "Approved" },
  "facilities.status.rejected": { th: "ปฏิเสธ", en: "Rejected" },
  "facilities.status.cancelled": { th: "ยกเลิกแล้ว", en: "Cancelled" },

  // Actions
  "facilities.action.createFacility": { th: "เพิ่มห้อง/ยานพาหนะ", en: "Add Facility" },
  "facilities.action.editFacility": { th: "แก้ไขข้อมูล", en: "Edit Facility" },
  "facilities.action.deleteFacility": { th: "ลบ", en: "Delete" },
  "facilities.action.book": { th: "จองตอนนี้", en: "Book Now" },
  "facilities.action.approve": { th: "อนุมัติการจอง", en: "Approve Booking" },
  "facilities.action.reject": { th: "ปฏิเสธการจอง", en: "Reject Booking" },
  "facilities.action.viewDetail": { th: "ดูรายละเอียด", en: "View Details" },

  // Messages & Errors
  "facilities.book.success": { th: "ส่งคำขอจองสำเร็จ เจ้าหน้าที่จะตรวจสอบและแจ้งผลทางอีเมล", en: "Booking request submitted successfully." },
  "facilities.review.success": { th: "บันทึกผลการอนุมัติการจองเรียบร้อยแล้ว", en: "Booking status updated successfully." },
  "facilities.error.overlap": { th: "ช่วงเวลาดังกล่าวมีผู้จองและได้รับการอนุมัติแล้ว กรุณาเลือกช่วงเวลาอื่น", en: "The selected time slot is already booked. Please select another time." },
  "facilities.error.timeInvalid": { th: "เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มต้น", en: "End time must be after start time." },
  "facilities.empty": { th: "ไม่พบข้อมูลห้องประชุมหรือยานพาหนะ", en: "No facilities found" },
  
  // Permissions
  "perm.facilities:read": { th: "ดูข้อมูลห้องประชุมและรายการจอง", en: "View facilities and bookings" },
  "perm.facilities:manage": { th: "อนุมัติการจองและจัดการห้อง/ยานพาหนะ", en: "Approve bookings and manage facilities" },
} as const;

export type FacilitiesMessageKey = keyof typeof messages;
