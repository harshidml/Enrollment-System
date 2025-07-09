# Copyright (c) 2025, Harsh Makwana and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

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