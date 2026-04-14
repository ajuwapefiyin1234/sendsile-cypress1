import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';
import { MdOutlineFileUpload } from 'react-icons/md';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

const ExportButton = ({ data, headers, filename = 'export' }) => {
  const [showAlert, setShowAlert] = React.useState(false);
  const tableRef = useRef(null);

  const handleExport = (type) => {
    if (!data || data.length === 0 || !headers || headers.length === 0) {
      setShowAlert(true);
      return;
    }

    switch (type) {
      case 'pdf':
        exportToPDF();
        break;
      case 'csv':
        exportToCSV();
        break;
      case 'png':
        exportToPNG();
        break;
      default:
        toast.error('Unsupported export type');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [headers.map((header) => header.name || '')],
      body: data.map((row) =>
        headers.map((header) =>
          header.accessor ? row[header.accessor] || '' : ''
        )
      ),
    });
    doc.save(`${filename}.pdf`);
  };

  const exportToCSV = () => {
    const csvHeaders = headers.map((header) => header.name || '').join(',');
    const csvData = data
      .map((row) =>
        headers
          .map((header) => (header.accessor ? row[header.accessor] || '' : ''))
          .join(',')
      )
      .join('\n');
    const blob = new Blob([`${csvHeaders}\n${csvData}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToPNG = () => {
    if (tableRef.current) {
      html2canvas(tableRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="text-[14px] leading-[20px] text-[#8B909A] box-border items-center p-2 gap-2 h-9 bg-white border border-[#ECEEF4] rounded-[7px]"
          >
            <MdOutlineFileUpload className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[168px] bg-white gap-2.5 p-3">
          <DropdownMenuItem
            onClick={() => handleExport('pdf')}
            className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
          >
            PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExport('csv')}
            className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
          >
            CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExport('png')}
            className="p-2 text-[14px] leading-[19px] text-[#8B909A]"
          >
            PNG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Data Available</AlertDialogTitle>
            <AlertDialogDescription>
              There is no data available to export. Please ensure you have data
              loaded before attempting to export.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden table for PNG export */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <Table ref={tableRef}>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index}>{header.name || ''}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header, cellIndex) => (
                  <TableCell key={cellIndex}>
                    {header.accessor ? row[header.accessor] || '' : ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

ExportButton.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      accessor: PropTypes.string,
    })
  ).isRequired,
  filename: PropTypes.string,
};

export default ExportButton;
