# Copyright (c) 2025, Harsh and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class testenrollment(Document):
	def on_submit(self):
		course = frappe.get_doc("Courses", self.course)
		course.available_seats -= 1
		course.save(ignore_permissions=True)

	def on_cancel(self):
		course = frappe.get_doc("Courses", self.course)
		course.available_seats += 1
		course.save(ignore_permissions=True)
