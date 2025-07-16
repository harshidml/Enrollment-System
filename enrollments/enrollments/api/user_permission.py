import frappe

def apply_student_user_permission(user_doc, method=None):
    roles = [role.role for role in user_doc.roles]
    if "Student" not in roles:
        return

    student_name = frappe.db.get_value("students", {"email": user_doc.email}, "name")
    if not student_name:
        return


    exists = frappe.db.exists("User Permission", {
        "user": user_doc.name,
        "allow": "students",
        "for_value": student_name,
        "applicable_for": "Assigment"
    })
    if exists:
        return


    frappe.get_doc({
        "doctype": "User Permission",
        "user": user_doc.name,
        "allow": "students",
        "for_value": student_name,
        "apply_to_all_doctypes": 0,
        "applicable_for": "Assigment"
    }).insert(ignore_permissions=True)
