# Copyright (c) 2025, Harsh Makwana and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import random
import time

class Assigment(Document):
    def validate(self):
        # Ensure student is enrolled in selected course and semester
        exists = frappe.db.exists("Enrollment", {
            "dynamic_link_pobq": self.student,
            "course": self.course,
            "semester": self.semester
        })

        if not exists:
            frappe.throw(
                title="Assignment Error",
                msg=f"Student '{self.student}' is not enrolled in Course '{self.course}' for Semester '{self.semester}'."
            )



@frappe.whitelist()
def update_student_pointer(student):
    frappe.enqueue(run_pointer_job, student=student)

def run_pointer_job(student):
    time.sleep(10)
    pointer = round(random.uniform(5.0, 10.0), 2)
    frappe.logger().info(f"[Pointer Job] Assigning {pointer} to {student}")
    student_doc = frappe.get_doc("students", student)
    student_doc.pointer = pointer
    student_doc.save(ignore_permissions=True)

def has_permission(doc=None, ptype=None, user=None):
    if not user:
        user = frappe.session.user

    if user == "Administrator":
        return True if doc else ""

    student_name = frappe.db.get_value("students", {"email": user})

    if doc:
        # For single record access
        return ptype == "read" and doc.student == student_name
    else:
        # For List View filtering
        if student_name:
            return f"`tabAssigment`.student = '{student_name}'"
        return "1=0"