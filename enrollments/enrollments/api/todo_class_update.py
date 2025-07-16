
import frappe
from frappe.desk.doctype.todo.todo import ToDo 

class CustomToDo(ToDo):
    def on_update(self):
        frappe.msgprint("Hii Its Me Called By using Override Doctype Class")
