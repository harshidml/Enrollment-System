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

                        let content = `
                            <b>📅 Submission Date:</b> ${row.submission_date || 'Not set'}<br><br>
                            <b>📝 Assignment Details:</b><br>${row.details || 'No details'}
                        `;

                        frappe.msgprint({
                            title: `Assignment Info for Student: ${frm.doc.name}`,
                            message: content,
                            indicator: "blue"
                        });
                    }
                });
            });
        }
    }
});
