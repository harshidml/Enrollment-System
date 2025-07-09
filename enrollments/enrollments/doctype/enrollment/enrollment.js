// Copyright (c) 2025, Harsh Makwana and contributors
// For license information, please see license.txt

frappe.ui.form.on("Enrollment", {
 dynamic_link_pobq: function(frm) {
        if (frm.doc.enrollment_type && frm.doc.dynamic_link_pobq) {
            frappe.db.get_doc(frm.doc.enrollment_type, frm.doc.dynamic_link_pobq)
                .then(record => {
                    frm.set_value('email', record.email);
                    frm.set_value('semester', record.semester);

                });
        }
    },
    registration_fees: function(frm) {
        let reg_fees = parseFloat(frm.doc.registration_fees) || 0;
        let course_fees = parseFloat(frm.doc.course_fees) || 0;
        frm.set_value('total_fees', reg_fees + course_fees);
    },

    course_fees: function(frm) {
        let reg_fees = parseFloat(frm.doc.registration_fees) || 0;
        let course_fees = parseFloat(frm.doc.course_fees) || 0;
        frm.set_value('total_fees', reg_fees + course_fees);
    },
    onload(frm) {
		if (frm.is_new()) {
            frm.set_intro('Course Enrollment is open only for 3 more days!');
        }
	},
    refresh: function(frm) {
        if (!frm.is_new()) {
            frm.page.clear_primary_action();

            frm.page.set_primary_action('Cancel Enrollment', () => {
                frappe.confirm(
                    '⚠️ Deleting this enrollment will only give you 50% refund.\n\nDo you still want to permanently delete it?',
                    function () {
                        frappe.call({
                            method: "frappe.client.delete",
                            args: {
                                doctype: frm.doctype,
                                name: frm.docname
                            },
                            callback: function() {
                                frappe.set_route("List", frm.doctype);
                                frappe.show_alert("Enrollment Cancelled");
                            }
                        });
                    },
                    function () {
                        frappe.msgprint("Enrollment cancell Aborted.");
                    }
                );
            });
        }
    },

    // Test

    setup: function(frm) {
        frm.make_methods = {
            'ToDo': () => {
                frappe.model.open_mapped_doc({
                    method: "enrollments.enrollments.doctype.enrollment.enrollment.make_todo",
                    args: {
                        source_name: frm.doc.name,
                        refrenceType:"Enrollment"
                    }
                });
            }
        };
    }


});