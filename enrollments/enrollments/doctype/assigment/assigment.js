// Copyright (c) 2025, Harsh Makwana and contributors
// For license information, please see license.txt

frappe.ui.form.on('Assigment', {
    course: filter_students,
    semester: filter_students,

    student: function(frm) {
        if (frm.doc.student) {
            // Check if the child table is empty
            if (!frm.doc.assignment_details || frm.doc.assignment_details.length === 0) {
                // Add a new row to the child table
                let child = frm.add_child('assignment_details');
                child.student = frm.doc.student;

                // Refresh the child table to show updates
                frm.refresh_field('assignment_details');
            } else {
                // If already a row exists, update the first row's student
                frm.doc.assignment_details[0].student = frm.doc.student;
                frm.refresh_field('assignment_details');
            }
        }
    }
});

function filter_students(frm) {
    const course = frm.doc.course;
    const semester = frm.doc.semester;

    if (course && semester) {
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Enrollment",
                filters: { course, semester },
                fields: ["dynamic_link_pobq"]
            },
            callback: function(res) {
                const students = res.message.map(d => d.dynamic_link_pobq);
                frm.set_query("student", () => ({ filters: [["name", "in", students]] }));
            }
        });
    }
}