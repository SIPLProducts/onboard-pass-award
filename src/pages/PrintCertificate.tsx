import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import logo from '@/assets/logo.png';

const PrintCertificate = () => {
  const [searchParams] = useSearchParams();
  const [isPrinting, setIsPrinting] = useState(false);

  const certificateData = {
    id: searchParams.get('id') || '',
    courseName: searchParams.get('course') || '',
    employeeName: searchParams.get('name') || '',
    employeeId: searchParams.get('empId') || '',
    score: searchParams.get('score') || '0',
    completedAt: searchParams.get('date') || new Date().toISOString(),
  };

  const formattedDate = new Date(certificateData.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    // Auto-trigger print dialog after a short delay
    const timer = setTimeout(() => {
      setIsPrinting(true);
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>
        {`
          @media print {
            @page {
              size: landscape;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
      
      {/* Print button - hidden when printing */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg hover:opacity-90"
        >
          Print Certificate
        </button>
        <button
          onClick={() => window.close()}
          className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/80"
        >
          Close
        </button>
      </div>

      {/* Certificate */}
      <div className="flex min-h-screen items-center justify-center bg-white p-8">
        <div
          className="relative w-full max-w-4xl"
          style={{
            aspectRatio: '297/210', // A4 landscape
          }}
        >
          {/* Certificate container */}
          <div
            className="relative h-full w-full overflow-hidden bg-white"
            style={{
              border: '3px solid #0d9488',
            }}
          >
            {/* Top decorative bar */}
            <div
              className="absolute left-0 right-0 top-0 h-16"
              style={{ backgroundColor: '#0d9488' }}
            />
            
            {/* Bottom decorative bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16"
              style={{ backgroundColor: '#0d9488' }}
            />

            {/* Inner border */}
            <div
              className="absolute inset-3"
              style={{
                border: '1px solid #0d9488',
              }}
            />

            {/* Content */}
            <div className="relative flex h-full flex-col items-center justify-center px-12 py-8">
              {/* Logo */}
              <img
                src={logo}
                alt="LearnHub"
                className="mb-2 h-12 w-auto"
              />

              {/* Certificate title */}
              <p
                className="text-sm font-normal tracking-widest"
                style={{ color: '#0d9488' }}
              >
                CERTIFICATE OF COMPLETION
              </p>

              {/* Main title */}
              <h1
                className="mt-2 text-4xl font-bold"
                style={{ color: '#1e293b' }}
              >
                Course Completion
              </h1>

              {/* Decorative line */}
              <div
                className="my-4 h-0.5 w-32"
                style={{ backgroundColor: '#0d9488' }}
              />

              {/* This is to certify */}
              <p className="text-sm" style={{ color: '#64748b' }}>
                This is to certify that
              </p>

              {/* Employee name */}
              <h2
                className="mt-2 text-3xl font-bold"
                style={{ color: '#1e293b' }}
              >
                {certificateData.employeeName}
              </h2>

              {/* Employee ID */}
              <p className="mt-1 text-xs" style={{ color: '#64748b' }}>
                Employee ID: {certificateData.employeeId}
              </p>

              {/* has successfully completed */}
              <p className="mt-4 text-sm" style={{ color: '#64748b' }}>
                has successfully completed the course
              </p>

              {/* Course name */}
              <h3
                className="mt-2 text-xl font-bold"
                style={{ color: '#0d9488' }}
              >
                {certificateData.courseName}
              </h3>

              {/* Score */}
              <p className="mt-2 text-sm" style={{ color: '#1e293b' }}>
                with a score of {certificateData.score}%
              </p>

              {/* Date */}
              <p className="mt-2 text-xs" style={{ color: '#64748b' }}>
                Completed on {formattedDate}
              </p>

              {/* Signature area */}
              <div className="mt-8 flex flex-col items-center">
                <div
                  className="h-px w-32"
                  style={{ backgroundColor: '#cbd5e1' }}
                />
                <p className="mt-2 text-xs" style={{ color: '#64748b' }}>
                  Authorized Signature
                </p>
              </div>

              {/* Certificate ID */}
              <p
                className="absolute bottom-6 text-xs"
                style={{ color: '#64748b' }}
              >
                Certificate ID: {certificateData.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintCertificate;
