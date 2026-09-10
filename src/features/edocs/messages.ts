export const messages = {
  "edocs.nav": { th: "จัดการคำร้องและเอกสาร", en: "E-Docs & Requests" },
  "roles.module.edocs": { th: "ระบบงานสารบรรณและคำร้อง", en: "E-Docs & Approval Workflow" },
  "edocs.title": { th: "ระบบบริหารจัดการคำร้องออนไลน์", en: "E-Document & Request Management" },
  "edocs.subtitle": { th: "ตรวจสอบและพิจารณาคำร้องจากนักศึกษาและบุคลากร", en: "Review and manage academic and administrative requests" },
  "edocs.publicTitle": { th: "ระบบยื่นคำร้องออนไลน์", en: "Online Request Portal" },
  "edocs.publicSubtitle": { th: "บริการยื่นคำร้อง ติดตามสถานะเอกสาร และขออนุมัติทางการศึกษา คณะเทคโนโลยีและนวัตกรรม", en: "Submit academic requests and track status online" },
  
  // Tabs & Filters
  "edocs.tabs.requests": { th: "รายการคำร้อง", en: "Requests" },
  "edocs.tabs.templates": { th: "แบบฟอร์มคำร้อง", en: "Request Forms" },
  "edocs.tabs.track": { th: "ติดตามสถานะคำร้อง", en: "Track Status" },
  "edocs.search.placeholder": { th: "ค้นหาเลขคำร้อง, ผู้ยื่น, หัวข้อ...", en: "Search tracking code, requester, title..." },
  "edocs.filter.allStatus": { th: "ทุกสถานะ", en: "All Statuses" },
  "edocs.filter.allTemplates": { th: "ทุกแบบฟอร์ม", en: "All Templates" },
  
  // Fields
  "edocs.field.trackingCode": { th: "เลขที่คำร้อง", en: "Tracking Code" },
  "edocs.field.template": { th: "ประเภทคำร้อง", en: "Request Type" },
  "edocs.field.requesterName": { th: "ชื่อ-นามสกุล ผู้ยื่น", en: "Requester Name" },
  "edocs.field.requesterEmail": { th: "อีเมลติดต่อ", en: "Requester Email" },
  "edocs.field.requesterPhone": { th: "เบอร์โทรศัพท์", en: "Phone Number" },
  "edocs.field.requesterType": { th: "สถานะผู้ยื่น", en: "Requester Type" },
  "edocs.field.studentOrStaffId": { th: "รหัสนักศึกษา / บุคลากร", en: "Student / Staff ID" },
  "edocs.field.title": { th: "หัวข้อคำร้อง", en: "Request Title" },
  "edocs.field.details": { th: "รายละเอียดคำร้อง", en: "Details" },
  "edocs.field.attachmentUrl": { th: "ลิงก์เอกสารแนบ", en: "Attachment URL" },
  "edocs.field.status": { th: "สถานะคำร้อง", en: "Status" },
  "edocs.field.reviewerRemarks": { th: "ความเห็นของผู้พิจารณา", en: "Reviewer Remarks" },
  "edocs.field.createdAt": { th: "วันที่ยื่นคำร้อง", en: "Submitted Date" },
  "edocs.field.reviewedAt": { th: "วันที่พิจารณา", en: "Reviewed Date" },
  
  // Status Labels
  "edocs.status.submitted": { th: "รอการตรวจสอบ", en: "Submitted" },
  "edocs.status.inReview": { th: "กำลังพิจารณา", en: "In Review" },
  "edocs.status.approved": { th: "อนุมัติแล้ว", en: "Approved" },
  "edocs.status.rejected": { th: "ไม่อนุมัติ / ตีกลับ", en: "Rejected" },
  "edocs.status.cancelled": { th: "ยกเลิกแล้ว", en: "Cancelled" },
  
  // Requester Types
  "edocs.type.student": { th: "นักศึกษา", en: "Student" },
  "edocs.type.faculty": { th: "อาจารย์", en: "Faculty Member" },
  "edocs.type.staff": { th: "เจ้าหน้าที่", en: "Staff" },
  "edocs.type.guest": { th: "บุคคลภายนอก", en: "Guest / Alumni" },

  // Actions
  "edocs.action.submit": { th: "ยื่นคำร้อง", en: "Submit Request" },
  "edocs.action.review": { th: "พิจารณาคำร้อง", en: "Review Request" },
  "edocs.action.approve": { th: "อนุมัติคำร้อง", en: "Approve" },
  "edocs.action.reject": { th: "ปฏิเสธคำร้อง", en: "Reject" },
  "edocs.action.track": { th: "ตรวจสอบสถานะ", en: "Check Status" },
  "edocs.action.viewDetail": { th: "ดูรายละเอียด", en: "View Details" },
  
  // Feedback
  "edocs.submit.success": { th: "ยื่นคำร้องสำเร็จ กรุณาบันทึกเลขที่คำร้องเพื่อใช้ติดตามสถานะ", en: "Request submitted successfully. Please save your tracking code." },
  "edocs.review.success": { th: "บันทึกผลการพิจารณาคำร้องแล้ว", en: "Request review updated successfully." },
  "edocs.notFound": { th: "ไม่พบข้อมูลคำร้องตามเลขที่ระบุ", en: "No request found with the specified tracking code." },
  "edocs.empty": { th: "ไม่พบรายการคำร้อง", en: "No requests found" },
  
  // Permissions
  "perm.edocs:read": { th: "ดูรายการคำร้องและเอกสาร", en: "View e-docs and requests" },
  "perm.edocs:manage": { th: "พิจารณาอนุมัติและจัดการคำร้อง", en: "Review, approve, and manage e-docs" },
} as const;

export type EdocsMessageKey = keyof typeof messages;
