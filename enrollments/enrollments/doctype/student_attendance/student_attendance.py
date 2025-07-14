import frappe
from frappe.utils import today
from frappe.model.document import Document
import time

class StudentAttendance(Document):
        pass


def update_attendance_count():
    attendance_records = frappe.get_all("Student Attendance", 
        filters={"date": today(), "docstatus": 0}, 
        fields=["name"])

    for record in attendance_records:
        doc = frappe.get_doc("Student Attendance", record.name)
        for row in doc.attendance:
            if row.student:
                print(f"Incrementing attendance for: {row.student}")
                student_doc = frappe.get_doc("students", row.student)
                student_doc.attendance = (student_doc.attendance or 0) + 1
                student_doc.save(ignore_permissions=True)