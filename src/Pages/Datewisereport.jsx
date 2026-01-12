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

const API_URL =
  import.meta.env.VITE_API_URL || "https://fredbox-backend.onrender.com";

function DateWiseReport() {
  const [selectedDate, setSelectedDate] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // ✅ MEAL CUT COUNTS
  const [breakfastCut, setBreakfastCut] = useState(0);
  const [lunchCut, setLunchCut] = useState(0);
  const [teaCut, setTeaCut] = useState(0);
  const [dinnerCut, setDinnerCut] = useState(0);

  /* ======================================================
       LOAD DATA (Attendance + Messcut + User)
  ====================================================== */
  const handleLoadData = async () => {
    if (!selectedDate) return alert("Please select a date!");

    try {
      const attendanceRes = await axios.get(
        `${API_URL}/attendance?date=${selectedDate}`
      );
      let list = attendanceRes.data.data || [];

      const messcutRes = await axios.get(
        `${API_URL}/api/messcut/by-datereport?date=${selectedDate}`
      );

      const messcutMap = {};
      messcutRes.data.data.forEach((m) => {
        messcutMap[m.admissionNumber] = m;
      });

      let b = 0, l = 0, t = 0, d = 0;

      const finalList = await Promise.all(
        list
          .filter((s) => s.semester && s.semester !== "N/A")
          .map(async (student) => {
            let branch = "N/A";

            try {
              const userRes = await axios.get(
                `${API_URL}/user?admissionNumber=${student.admissionNumber}`
              );
              branch = userRes.data?.data?.branch || "N/A";
            } catch {}

            const mess = messcutMap[student.admissionNumber];
            const meals = mess
              ? mess.meals
              : { B: true, L: true, T: true, D: true };

            if (!meals.B) b++;
            if (!meals.L) l++;
            if (!meals.T) t++;
            if (!meals.D) d++;

            return {
              name: student.name,
              sem: student.semester,
              room: student.roomNo,
              branch,
              breakfast: meals.B,
              lunch: meals.L,
              tea: meals.T,
              dinner: meals.D
            };
          })
      );

      setBreakfastCut(b);
      setLunchCut(l);
      setTeaCut(t);
      setDinnerCut(d);

      setData(finalList);
      setPage(1);

    } catch (err) {
      console.log(err);
      alert("Failed to load data.");
    }
  };

  /* ======================================================
       SEARCH & PAGINATION
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
    if (!data.length) return alert("No data to export");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Date Wise Mess Report");

    sheet.mergeCells("A1", "I1");
    sheet.getCell("A1").value = `Date Wise Mess Report - ${selectedDate}`;
    sheet.getCell("A1").font = { bold: true, size: 16 };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    sheet.addRow([
      "Sl.No",
      "Name",
      "Semester",
      "Room",
      "Department",
      "Breakfast",
      "Lunch",
      "Tea",
      "Dinner"
    ]);

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
    saveAs(new Blob([buffer]), `DateWiseMessReport_${selectedDate}.xlsx`);
  };

  /* ======================================================
       EXPORT PDF
  ====================================================== */
  const exportPDF = () => {
    if (!data.length) return alert("No data to export");

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Date Wise Mess Report - ${selectedDate}`, 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [[
        "Sl.No",
        "Name",
        "Semester",
        "Room",
        "Department",
        "Breakfast",
        "Lunch",
        "Tea",
        "Dinner"
      ]],
      body: paginatedData.map((row, i) => [
        i + 1,
        row.name,
        row.sem,
        row.room,
        row.branch,
        row.breakfast ? "Yes" : "No",
        row.lunch ? "Yes" : "No",
        row.tea ? "Yes" : "No",
        row.dinner ? "Yes" : "No"
      ])
    });

    doc.save(`DateWiseMessReport_${selectedDate}.pdf`);
  };

  /* ======================================================
       UI
  ====================================================== */
  return (
    <Container fluid className="py-4 bg-light">
      <Row className="justify-content-center">
        <Col lg={11}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body>

              <h3 className="text-center fw-bold text-primary mb-4">
                Date Wise Mess Report
              </h3>

              {/* DATE FILTER */}
              <Row className="justify-content-center mb-4">
                <Col md={4}>
                  <Form.Control
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </Col>
                <Col md="auto">
                  <Button onClick={handleLoadData}>Load Data</Button>
                </Col>
              </Row>

              {/* MEAL CUT COUNTS */}
              {data.length > 0 && (
                <Row className="mb-4 text-center">
                  <Col md={3}><Card><Card.Body><h6>Breakfast Cut</h6><h3 className="text-danger">{breakfastCut}</h3></Card.Body></Card></Col>
                  <Col md={3}><Card><Card.Body><h6>Lunch Cut</h6><h3 className="text-danger">{lunchCut}</h3></Card.Body></Card></Col>
                  <Col md={3}><Card><Card.Body><h6>Tea Cut</h6><h3 className="text-danger">{teaCut}</h3></Card.Body></Card></Col>
                  <Col md={3}><Card><Card.Body><h6>Dinner Cut</h6><h3 className="text-danger">{dinnerCut}</h3></Card.Body></Card></Col>
                </Row>
              )}

              {/* SEARCH + EXPORT */}
              <Row className="justify-content-between mb-3">
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text>🔍</InputGroup.Text>
                    <Form.Control
                      placeholder="Search Name..."
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>
                </Col>

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
              <div className="table-responsive">
                <Table bordered hover className="text-center">
                  <thead className="table-primary">
                    <tr>
                      <th>Sl.No</th>
                      <th>Name</th>
                      <th>Semester</th>
                      <th>Room</th>
                      <th>Department</th>
                      <th>B</th>
                      <th>L</th>
                      <th>T</th>
                      <th>D</th>
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
                <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)} />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i}
                    active={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next disabled={page === totalPages} onClick={() => setPage(page + 1)} />
              </Pagination>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DateWiseReport;
