# Copyright (c) 2025, Harsh Makwana and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Enrollment(Document):
    def validate(self):
        course_doc = frappe.get_doc("Courses", self.course)

        if course_doc.available_seats <= 0:
            frappe.throw(f"No seats available for {course_doc.name}. {course_doc.available_seats} seats left.")

        self.course_fees = course_doc.price
        self.total_fees = course_doc.price

    def after_insert(self):
        course_doc = frappe.get_doc("Courses", self.course)
        course_doc.available_seats -= 1
        course_doc.save()

    def on_trash(self):
        if frappe.db.exists("Courses", self.course):
            course_doc = frappe.get_doc("Courses", self.course)
            course_doc.available_seats += 1
            course_doc.save()

