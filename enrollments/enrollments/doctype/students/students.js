frappe.ui.form.on('students', {
    refresh: function(frm) {
        if (!frm.is_new()) {
            frm.page.clear_primary_action();

            frm.page.set_primary_action('Assignment Details', () => {
                frappe.call({
                    method: "enrollments.enrollments.doctype.students.students.get_latest_assignment_details",
                    args: {
                        student: frm.doc.name
                    },
                    callback: function(response) {
                        const assignment = response.message;

                        if (!assignment || !assignment.assignment_details.length) {
                            frappe.msgprint("No assignment details found.");
                            return;
                        }

                        const row = assignment.assignment_details[0];

                        // Show assignment details with Completed button
                        const d = new frappe.ui.Dialog({
                            title: `Assignment Info for ${frm.doc.name}`,
                            fields: [
                                {
                                    fieldtype: "HTML",
                                    fieldname: "assignment_html",
                                    options: `
                                        <div>
                                            <b>📅 Submission Date:</b> ${row.submission_date || 'Not set'}<br><br>
                                            <b>📝 Assignment Details:</b><br>${row.details || 'No details'}
                                        </div>
                                    `
                                }
                            ],
                            primary_action_label: "✅ Mark as Completed",
                            primary_action() {
                                frappe.call({
                                    method: "enrollments.enrollments.doctype.assigment.assigment.update_student_pointer",
                                    args: {
                                        student: frm.doc.name
                                    },
                                    callback: function(r) {
                                        frappe.msgprint(`Pointer updated for Student: ${frm.doc.name}`);
                                        d.hide();
                                    }
                                });
                            }
                        });

                        d.show();
                    }
                });
            });
        }
    }
});
