// Copyright (c) 2025, Harsh Makwana and contributors
// For license information, please see license.txt

frappe.ui.form.on("Enrollment", {
 dynamic_link_pobq: function(frm) {
        if (frm.doc.enrollment_type && frm.doc.dynamic_link_pobq) {
            frappe.db.get_doc(frm.doc.enrollment_type, frm.doc.dynamic_link_pobq)
                .then(record => {
                    frm.set_value('custom_email', record.email);
                });
        }
    },
    registration_fees: function(frm) {
        let reg_fees = parseFloat(frm.doc.registration_fees) || 0;
        let course_fees = parseFloat(frm.doc.custom_course_fees) || 0;
        frm.set_value('total_fees', reg_fees + course_fees);
    },

    custom_course_fees: function(frm) {
        let reg_fees = parseFloat(frm.doc.registration_fees) || 0;
        let course_fees = parseFloat(frm.doc.custom_course_fees) || 0;
        frm.set_value('total_fees', reg_fees + course_fees);
    },
    onload(frm) {
		if (frm.is_new()) {
            frm.set_intro('Course Enrollment is open only for 3 more days!');
        }
	}

});