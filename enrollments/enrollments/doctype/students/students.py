import frappe
from frappe.model.document import Document

class students(Document):
    pass

@frappe.whitelist()
def get_latest_assignment_details(student):
    assignment = frappe.get_list(
        "Assigment",
        filters={"student": student},
        fields=["name"],
        order_by="creation desc",
        limit_page_length=1
    )

    if not assignment:
        return None

    assignment_doc = frappe.get_doc("Assigment", assignment[0].name)

    return {
        "assignment_name": assignment_doc.name,
        "assignment_details": assignment_doc.assignment_details
    }
