import jsPDF from 'jspdf';
import { Certificate } from '@/types/lms';

export const generateCertificate = (certificate: Certificate) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background gradient effect using rectangles
  doc.setFillColor(13, 148, 136); // Primary teal
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.rect(0, pageHeight - 30, pageWidth, 30, 'F');

  // Border
  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner border
  doc.setLineWidth(0.5);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Certificate title
  doc.setTextColor(13, 148, 136);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 50, { align: 'center' });

  // Main title
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('Course Completion', pageWidth / 2, 70, { align: 'center' });

  // Decorative line
  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 50, 78, pageWidth / 2 + 50, 78);

  // This is to certify
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('This is to certify that', pageWidth / 2, 95, { align: 'center' });

  // Employee name
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.employeeName, pageWidth / 2, 112, { align: 'center' });

  // Employee ID
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Employee ID: ${certificate.employeeId}`, pageWidth / 2, 122, { align: 'center' });

  // has successfully completed
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(12);
  doc.text('has successfully completed the course', pageWidth / 2, 138, { align: 'center' });

  // Course name
  doc.setTextColor(13, 148, 136);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.courseName, pageWidth / 2, 155, { align: 'center' });

  // Score
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`with a score of ${certificate.score}%`, pageWidth / 2, 168, { align: 'center' });

  // Date
  const formattedDate = new Date(certificate.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(11);
  doc.text(`Completed on ${formattedDate}`, pageWidth / 2, 180, { align: 'center' });

  // Signature line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 40, pageHeight - 50, pageWidth / 2 + 40, pageHeight - 50);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.text('Authorized Signature', pageWidth / 2, pageHeight - 42, { align: 'center' });

  // Certificate ID
  doc.setFontSize(8);
  doc.text(`Certificate ID: ${certificate.id}`, pageWidth / 2, pageHeight - 18, { align: 'center' });

  // Save the PDF
  doc.save(`Certificate_${certificate.courseName.replace(/\s+/g, '_')}_${certificate.employeeId}.pdf`);
};
