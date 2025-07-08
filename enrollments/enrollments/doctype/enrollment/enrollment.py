# Copyright (c) 2025, Harsh Makwana and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc

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

@frappe.whitelist()
def make_todo(target_doc=None):
    refrenceType = frappe.flags.args.refrenceType
    source_name = frappe.flags.args.source_name

    target_doc = get_mapped_doc(
        refrenceType,source_name,{
            refrenceType:{
                "doctype":"ToDo",
                "field_map":{
                    "name":"reference_name",
                    "doctype":"reference_type"
                },
                "postprocess": update_todo_fields
            }
        }
    )
    return target_doc

def update_todo_fields(source_doc, target_doc, source_parent=None):
    target_doc.description = f"Student {source_doc.dynamic_link_pobq} enrolled. Course Fee: ₹{source_doc.course_fees}"
    target_doc.priority = "High"
    target_doc.assigned_by = frappe.session.user