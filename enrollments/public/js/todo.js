frappe.ui.form.on('ToDo', {
    refresh(frm) {
        frappe.msgprint("ToDo form refreshed!");
    },
    on_save(frm) {
        frappe.msgprint("ToDo form saved!");
    }
});
