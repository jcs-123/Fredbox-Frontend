import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Modal,
  Badge,
  Spinner,
  Alert,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Download,
  FileEarmarkExcel,
  FileEarmarkPdf,
  Eye,
  ArrowClockwise,
  Search,
  Calendar,
  Person,
} from "react-bootstrap-icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const MesscutReport = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [student, setStudent] = useState(null);
  const [details, setDetails] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch main report data
  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/messcut/report`);
      setData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // Filter logic
  const filtered = useMemo(() => {
    return data.filter((r) => {
      const s = search.toLowerCase();
      const matchText =
        r.name?.toLowerCase().includes(s) ||
        r.admissionNumber?.toLowerCase().includes(s);
      const matchFrom = fromDate ? new Date(r.lastDate) >= new Date(fromDate) : true;
      const matchTo = toDate ? new Date(r.lastDate) <= new Date(toDate) : true;
      return matchText && matchFrom && matchTo;
    });
  }, [data, search, fromDate, toDate]);

  // Fetch student details
  const handleView = async (row) => {
    try {
      setShowModal(true);
      setDetailLoading(true);
      setStudent(row);
      const res = await axios.get(`${API_URL}/api/messcut/student`, {
        params: { admissionNo: row.admissionNumber },
      });
      setDetails(res.data.data || []);
    } catch (err) {
      console.error("Error fetching student details:", err);
    } finally {
      setDetailLoading(false);
    }
  };



const exportExcel = async (rows, filename, isStudentDetail = false, studentInfo = null) => {
  if (!rows.length) return alert("No data to export!");

  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Messcut Report");

    // 🔷 Header Section
    sheet.mergeCells("A1", "G1");
    sheet.getCell("A1").value = "JYOTHI ENGINEERING COLLEGE";
    sheet.getCell("A1").font = { bold: true, size: 16, color: { argb: "2C3E50" } };
    sheet.getCell("A1").alignment = { horizontal: "center" };
    sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "E8F4FD" } };

    sheet.mergeCells("A2", "G2");
    sheet.getCell("A2").value = "Mess Cut Management System";
    sheet.getCell("A2").font = { bold: true, size: 12, color: { argb: "34495E" } };
    sheet.getCell("A2").alignment = { horizontal: "center" };

    sheet.mergeCells("A3", "G3");
    sheet.getCell("A3").value = isStudentDetail ? "STUDENT DETAILED REPORT" : "MESS CUT SUMMARY REPORT";
    sheet.getCell("A3").font = { bold: true, size: 14, color: { argb: "FFFFFF" } };
    sheet.getCell("A3").alignment = { horizontal: "center" };
    sheet.getCell("A3").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "2980B9" } };

    // 🔹 Info Section
    let infoStart = 5;
    sheet.getCell(`A${infoStart}`).value = "Generated On";
    sheet.getCell(`B${infoStart}`).value = new Date().toLocaleString("en-IN");
    infoStart++;

    sheet.getCell(`A${infoStart}`).value = "Total Records";
    sheet.getCell(`B${infoStart}`).value = rows.length;
    infoStart++;

    if (isStudentDetail && studentInfo) {
      sheet.getCell(`A${infoStart}`).value = "Student Name";
      sheet.getCell(`B${infoStart}`).value = studentInfo.name;
      infoStart++;

      sheet.getCell(`A${infoStart}`).value = "Admission Number";
      sheet.getCell(`B${infoStart}`).value = studentInfo.admissionNumber;
      infoStart++;

      sheet.getCell(`A${infoStart}`).value = "Academic Info";
      sheet.getCell(`B${infoStart}`).value = `${studentInfo.branch} - Sem ${studentInfo.sem}`;
      infoStart++;
    }

    infoStart += 1; // Add space before table

    // 🔹 Table Header
    const headers = Object.keys(rows[0]);
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "2C3E50" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // 🔹 Data Rows
    rows.forEach((row, idx) => {
      const newRow = sheet.addRow(Object.values(row));
      newRow.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: idx % 2 === 0 ? "F8F9FA" : "FFFFFF" },
        };
      });
    });

    // 🔹 Adjust column widths
    sheet.columns.forEach((col) => {
      col.width = 18;
    });

    // 🔹 Save Excel File
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${filename}_${Date.now()}.xlsx`);

  } catch (error) {
    console.error("Excel export error:", error);
    alert("Failed to generate Excel file. Please try again.");
  }
};

// Professional PDF Export with Advanced Styling
const exportPDF = (rows, filename, title, isStudentDetail = false, studentInfo = null) => {
  if (!rows.length) {
    alert("No data to export!");
    return;
  }

  try {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    let currentY = 15;

    // 🔷 HEADER STRIP
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 25, "F");

    // 🔷 COLLEGE TITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("JYOTHI ENGINEERING COLLEGE", pageWidth / 2, 12, { align: "center" });

    // 🔷 SUBTITLE
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Mess Cut Management System", pageWidth / 2, 19, { align: "center" });

    currentY = 33;

    // 🔷 REPORT TITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text(title.toUpperCase(), pageWidth / 2, currentY, { align: "center" });
    currentY += 8;

    // 🔹 Info Box (Student / Summary)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    const boxHeight = isStudentDetail ? 32 : 24;
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(12, currentY, pageWidth - 24, boxHeight, 3, 3, "FD");

    let infoY = currentY + 6;
    if (isStudentDetail && studentInfo) {
      doc.setFont("helvetica", "bold");
      doc.text(`Student Name:`, 16, infoY);
      doc.setFont("helvetica", "normal");
      doc.text(studentInfo.name, 55, infoY);

      infoY += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Admission No:`, 16, infoY);
      doc.setFont("helvetica", "normal");
      doc.text(studentInfo.admissionNumber, 55, infoY);

      infoY += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Branch & Sem:`, 16, infoY);
      doc.setFont("helvetica", "normal");
      doc.text(`${studentInfo.branch || '-'} | Semester ${studentInfo.sem || '-'}`, 55, infoY);

      infoY += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Generated On:`, 16, infoY);
      doc.setFont("helvetica", "normal");
      doc.text(new Date().toLocaleString("en-IN"), 55, infoY);
    } else {
      doc.setFont("helvetica", "bold");
      doc.text(`Date Range:`, 16, infoY);
      doc.setFont("helvetica", "normal");
      doc.text(`${fromDate || 'All Dates'} to ${toDate || 'All Dates'}`, 55, infoY);

      infoY += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Total Records:`, 16, infoY);
      doc.setFont("helvetica", "normal");
      doc.text(String(rows.length), 55, infoY);

      infoY += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Generated On:`, 16, infoY);
      doc.setFont("helvetica", "normal");
      doc.text(new Date().toLocaleString("en-IN"), 55, infoY);
    }

    currentY += boxHeight + 10;

    // 🔹 Table Data
    const headers = Object.keys(rows[0]);
    const tableData = rows.map(r => Object.values(r));

    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: currentY,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 9,
        textColor: [33, 33, 33],
        lineColor: [220, 220, 220],
        lineWidth: 0.2,
        cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
        overflow: "linebreak",
        valign: "middle"
      },
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255],
        fontSize: 9.5,
        halign: "center"
      },
      bodyStyles: {
        halign: "center",
        cellWidth: "wrap"
      },
      columnStyles: {
        0: { cellWidth: 12 },  // Sl.No
        1: { cellWidth: 30 },  // Student Name / Leaving Date
        2: { cellWidth: 25 },  // Admission / Returning Date
        3: { cellWidth: 25 },  // Branch / Reason
        4: { cellWidth: 25 },  // Status / Duration
        5: { cellWidth: 25 },  // Count or extra column
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      didDrawPage: (data) => {
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
        doc.text(
          "Confidential — Jyothi Engineering College",
          14,
          doc.internal.pageSize.height - 10
        );
      }
    });

    // 🔷 Watermark (Light JEC)
    doc.setPage(1);
    doc.setTextColor(230, 230, 230);
    doc.setFontSize(48);
    doc.text("JEC", pageWidth / 2, 150, {
      align: "center",
      angle: 45
    });

    doc.save(`${filename}_${Date.now()}.pdf`);
  } catch (error) {
    console.error("PDF export error:", error);
    alert("Failed to generate PDF file. Please try again.");
  }
};

  // Data preparation
  const prepareSummary = () =>
    filtered.map((r, i) => ({
      "#": i + 1,
      "Student Name": r.name,
      "Admission No": r.admissionNumber,
      Branch: r.branch,
      Semester: r.sem,
      "Mess Cuts": r.count,
      "Last Date": new Date(r.lastDate).toLocaleDateString("en-IN"),
    }));

  const prepareDetails = () =>
    details.map((d, i) => ({
      "#": i + 1,
      "Leaving Date": d.leavingDate,
      "Returning Date": d.returningDate,
      Reason: d.reason,
      Status: d.status,
      Duration: calculateDuration(d.leavingDate, d.returningDate),
    }));

  const calculateDuration = (leave, ret) => {
    try {
      const l = new Date(leave);
      const r = new Date(ret);
      const diff = Math.abs(r - l);
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return `${days} day${days !== 1 ? "s" : ""}`;
    } catch {
      return "N/A";
    }
  };

  const getBadgeVariant = (count) => {
    if (count === 0) return "success";
    if (count >= 5) return "danger";
    return "warning";
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "ACCEPT":
        return "success";
      case "REJECT":
        return "danger";
      case "PENDING":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      {/* HEADER */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Mess Cut Report</h2>
        <p className="text-muted mb-0">Student Mess Cut Records and Summary</p>
      </div>

      {/* FILTERS */}
      <Card className="shadow-sm border-0 mb-3">
        <Card.Header className="bg-primary text-white">
          <Search className="me-2" />
          Filter & Controls
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            <Col md={3} sm={6}>
              <Form.Label>
                <Calendar className="me-1" />
                From Date
              </Form.Label>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Col>
            <Col md={3} sm={6}>
              <Form.Label>
                <Calendar className="me-1" />
                To Date
              </Form.Label>
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <Form.Label>
                <Search className="me-1" />
                Search
              </Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Search by Name or Admission No"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearch("");
                    setFromDate("");
                    setToDate("");
                  }}
                >
                  Clear
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* EXPORT BUTTONS */}
      <div className="d-flex justify-content-end align-items-center flex-wrap gap-2 mb-3">
        <Button
          variant="success"
          className="d-flex align-items-center"
          onClick={() => exportExcel(prepareSummary(), "Messcut_Report")}
        >
          <FileEarmarkExcel className="me-2" />
          Export Excel
        </Button>
        <Button
          variant="danger"
          className="d-flex align-items-center"
          onClick={() =>
            exportPDF(prepareSummary(), "Messcut_Report", "Mess Cut Report")
          }
        >
          <FileEarmarkPdf className="me-2" />
          Export PDF
        </Button>
        <Button
          variant="outline-primary"
          onClick={fetchReport}
          className="d-flex align-items-center"
        >
          <ArrowClockwise className="me-2" />
          Refresh
        </Button>
      </div>

      {/* DATA TABLE */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading mess cut reports...</p>
            </div>
          ) : filtered.length === 0 ? (
            <Alert variant="info" className="m-3 text-center">
              No records found. Try adjusting your filters.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover bordered size="sm" className="align-middle mb-0">
                <thead style={{ backgroundColor: "#f2f3f5", color: "#000" }}>
                  <tr className="text-center">
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Admission No</th>
                    <th>Branch</th>
                    <th>Sem</th>
                    <th>Mess Cuts</th>
                    <th>Last Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={i}>
                      <td className="text-center fw-bold">{i + 1}</td>
                      <td>{r.name}</td>
                      <td>{r.admissionNumber}</td>
                      <td>{r.branch}</td>
                      <td className="text-center">{r.sem}</td>
                      <td className="text-center">
                        <Badge bg={getBadgeVariant(r.count)}>{r.count}</Badge>
                      </td>
                      <td className="text-center">
                        {new Date(r.lastDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleView(r)}
                        >
                          <Eye className="me-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <Person className="me-2" />
            {student?.name} — {student?.admissionNumber}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-3 text-muted">Loading details...</p>
            </div>
          ) : details.length === 0 ? (
            <Alert variant="info" className="text-center">
              No Mess Cut Records Found for this student.
            </Alert>
          ) : (
            <>
              <div className="d-flex justify-content-end mb-3 gap-2 flex-wrap">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() =>
                    exportExcel(
                      prepareDetails(),
                      `Messcut_${student.admissionNumber}_Details`
                    )
                  }
                >
                  <FileEarmarkExcel className="me-1" />
                  Excel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    exportPDF(
                      prepareDetails(),
                      `Messcut_${student.admissionNumber}_Details`,
                      `Mess Cut Details - ${student.name}`
                    )
                  }
                >
                  <FileEarmarkPdf className="me-1" />
                  PDF
                </Button>
              </div>

              <div className="table-responsive">
                <Table bordered hover size="sm" className="align-middle">
                  <thead style={{ backgroundColor: "#f5f5f5", color: "#000" }}>
                    <tr className="text-center">
                      <th>#</th>
                      <th>Leaving Date</th>
                      <th>Returning Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((d, i) => (
                      <tr key={i}>
                        <td className="text-center fw-bold">{i + 1}</td>
                        <td>{`${d.leavingDate} (${d.leavingTime})`}</td>
                        <td>{`${d.returningDate} (${d.returningTime})`}</td>
                        <td>{d.reason}</td>
                        <td className="text-center">
                          <Badge bg={getStatusBadge(d.status)}>{d.status}</Badge>
                        </td>
                        <td className="text-center">
                          {calculateDuration(d.leavingDate, d.returningDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MesscutReport;
