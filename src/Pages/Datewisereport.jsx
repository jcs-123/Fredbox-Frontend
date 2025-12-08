import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  InputGroup,
  Pagination
} from "react-bootstrap";

import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = import.meta.env.VITE_API_URL || "https://fredbox-backend.onrender.com";

function DateWiseReport() {
  const [selectedDate, setSelectedDate] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  /* ======================================================
       LOAD REAL DATA (Attendance + Messcut + User)
  ====================================================== */
 const handleLoadData = async () => {
  if (!selectedDate) return alert("Please select a date!");

  try {
    // 1️⃣ Load Attendance
    const attendanceRes = await axios.get(
      `${API_URL}/attendance?date=${selectedDate}`
    );
    let list = attendanceRes.data.data || [];

    // 2️⃣ Load messcut (full meals object)
    const messcutRes = await axios.get(
      `${API_URL}/api/messcut/by-datereport?date=${selectedDate}`
    );

    // Build messcut lookup
    const messcutMap = {};
    messcutRes.data.data.forEach((m) => {
      messcutMap[m.admissionNumber] = m; // store full object
    });

    // 3️⃣ Build final output
    const finalList = await Promise.all(
      list
        .filter((s) => s.semester && s.semester !== "N/A") // only students
        .map(async (student) => {
          let branch = "N/A";

          // Load department
          try {
            const userRes = await axios.get(
              `${API_URL}/user?admissionNumber=${student.admissionNumber}`
            );
            branch = userRes.data?.data?.branch || "N/A";
          } catch {}

          const mess = messcutMap[student.admissionNumber];

          // 🟢 If no messcut → all meals available
          const meals = mess
            ? mess.meals
            : { B: true, L: true, T: true, D: true };

          return {
            name: student.name,
            sem: student.semester,
            room: student.roomNo,
            branch,
            breakfast: meals.B,
            lunch: meals.L,
            tea: meals.T,
            dinner: meals.D,
            dayType: mess?.dayType || "PRESENT",
          };
        })
    );

    setData(finalList);
    setPage(1);
  } catch (err) {
    console.log(err);
    alert("Failed to load data.");
  }
};

  /* ======================================================
       FILTER SEARCH
  ====================================================== */
  const filteredData = data.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  /* ======================================================
       EXPORT EXCEL
  ====================================================== */
  const exportExcel = async () => {
    if (!data.length) return alert("No data!");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Date Wise Mess Report");

    // TITLE
    sheet.mergeCells("A1", "I1");
    sheet.getCell("A1").value = `Date Wise Mess Report - ${selectedDate}`;
    sheet.getCell("A1").font = { bold: true, size: 16, color: { argb: "FFFFFF" } };
    sheet.getCell("A1").alignment = { horizontal: "center" };
    sheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1976D2" }
    };

    // HEADER
    const headers = [
      "Sl.No",
      "Name",
      "Semester",
      "Room",
      "Department",
      "Breakfast",
      "Lunch",
      "Tea",
      "Dinner"
    ];
    const headerRow = sheet.addRow(headers);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "42A5F5" }
      };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    paginatedData.forEach((row, i) => {
      sheet.addRow([
        i + 1,
        row.name,
        row.sem,
        row.room,
        row.branch,
        row.breakfast ? "Yes" : "No",
        row.lunch ? "Yes" : "No",
        row.tea ? "Yes" : "No",
        row.dinner ? "Yes" : "No"
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `DateWiseReport_${selectedDate}.xlsx`);
  };

  /* ======================================================
       EXPORT PDF
  ====================================================== */
  const exportPDF = () => {
    if (!data.length) return alert("No data!");

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Date Wise Mess Report - ${selectedDate}`, 14, 15);

    const tableData = paginatedData.map((row, i) => [
      i + 1,
      row.name,
      row.sem,
      row.room,
      row.branch,
      row.breakfast ? "Yes" : "No",
      row.lunch ? "Yes" : "No",
      row.tea ? "Yes" : "No",
      row.dinner ? "Yes" : "No"
    ]);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Sl.No",
          "Name",
          "Semester",
          "Room",
          "Department",
          "Breakfast",
          "Lunch",
          "Tea",
          "Dinner"
        ]
      ],
      body: tableData
    });

    doc.save(`DateWiseReport_${selectedDate}.pdf`);
  };

  /* ======================================================
       RENDER UI
  ====================================================== */
  return (
    <Container fluid className="py-4 bg-light" style={{ minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body>
              <h3 className="text-center fw-bold text-primary mb-4">
                Date Wise Mess Report
              </h3>

              {/* FILTER */}
              <Row className="g-3 justify-content-center mb-4">
                <Col md={4}>
                  <Form.Control
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-3"
                  />
                </Col>

                <Col md="auto">
                  <Button
                    onClick={handleLoadData}
                    className="px-4 fw-semibold rounded-3"
                    style={{
                      background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                      border: "none"
                    }}
                  >
                    Load Data
                  </Button>
                </Col>
              </Row>

              {/* SEARCH */}
              <Row className="justify-content-between mb-3">
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text className="bg-white">🔍</InputGroup.Text>
                    <Form.Control
                      placeholder="Search Name..."
                      onChange={(e) => setSearch(e.target.value)}
                      className="rounded-end-3"
                    />
                  </InputGroup>
                </Col>

                {/* EXPORT BUTTONS */}
                <Col md="auto" className="d-flex gap-2">
                  <Button variant="success" onClick={exportExcel}>
                    Export Excel
                  </Button>
                  <Button variant="danger" onClick={exportPDF}>
                    Export PDF
                  </Button>
                </Col>
              </Row>

              {/* TABLE */}
              {data.length > 0 ? (
                <>
                  <div className="table-responsive shadow-sm rounded-3 mb-3">
                    <Table bordered hover className="align-middle text-center">
                      <thead
                        className="text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #1976d2, #42a5f5)"
                        }}
                      >
                        <tr>
                          <th className="text-black">Sl. No</th>
                          <th className="text-black">Name</th>
                          <th className="text-black"> Semester</th>
                          <th className="text-black">Room</th>
                          <th className="text-black">Department</th>
                          <th className="text-black">Breakfast</th>
                          <th className="text-black">Lunch</th>
                          <th className="text-black">Tea</th>
                          <th className="text-black">Dinner</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((row, index) => (
                          <tr key={index}>
                            <td>{(page - 1) * rowsPerPage + index + 1}</td>
                            <td>{row.name}</td>
                            <td>{row.sem}</td>
                            <td>{row.room}</td>
                            <td>{row.branch}</td>
                            <td>{row.breakfast ? "✔️" : "❌"}</td>
                            <td>{row.lunch ? "✔️" : "❌"}</td>
                            <td>{row.tea ? "✔️" : "❌"}</td>
                            <td>{row.dinner ? "✔️" : "❌"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {/* PAGINATION */}
                  <Pagination className="justify-content-center">
                    <Pagination.Prev
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    />
                    {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item
                        key={i}
                        active={page === i + 1}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    />
                  </Pagination>
                </>
              ) : (
                <div className="text-center py-5">
                  <h5 className="text-secondary">
                    {selectedDate
                      ? "No data found for selected date."
                      : "Select a date and click Load Data."}
                  </h5>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DateWiseReport;
