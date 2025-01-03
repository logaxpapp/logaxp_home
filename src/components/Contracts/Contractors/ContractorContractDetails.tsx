import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useFetchContractByIdQuery,
  useAcceptContractMutation,
  useDeclineContractMutation,
} from '../../../api/contractApi';
import Loader from '../../Loader';

// PDF/Image libraries
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Icons
import { AiOutlinePrinter, AiOutlineDownload } from 'react-icons/ai';

const ContractorContractDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Data and mutations
  const { data: contract, error, isLoading } = useFetchContractByIdQuery(id!);
  const [acceptContract, { isLoading: isAccepting }] = useAcceptContractMutation();
  const [declineContract, { isLoading: isDeclining }] = useDeclineContractMutation();

  // Company and contact info
  const companyInfo = {
    name: 'LogaXP Tech',
    addressLine1: '1108 Berry Street',
    addressLine2: 'Old Hickory, Tennessee, 37138, United States',
    repName: 'Rabi Umar',
    repTitle: 'Chief Operating Officer',
    contactNumber: '615-554-3592',
    supportEmail: 'support@logaxp.com',
  };

  // A ref to capture the page content
  const pageRef = useRef<HTMLDivElement>(null);

  // If loading or error
  if (isLoading) return <Loader />;
  if (error) {
    return <div className="text-red-600 text-center mt-10">Error fetching contract.</div>;
  }
  if (!contract) {
    return <div className="text-gray-600 text-center mt-10">Contract not found.</div>;
  }

  // Handlers
  const handleAccept = async () => {
    try {
      await acceptContract(id!).unwrap();
      navigate('/dashboard/contractor/contracts');
    } catch (err) {
      console.error('Failed to accept contract:', err);
    }
  };

  const handleDecline = async () => {
    const reason = prompt('Please provide a reason for declining:');
    if (reason) {
      try {
        await declineContract({ id: id!, reason }).unwrap();
        navigate('/dashboard/contractor/contracts');
      } catch (err) {
        console.error('Failed to decline contract:', err);
      }
    }
  };

  /**
   * PRINT FUNCTIONALITY
   * Prints the *entire* current browser page.
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * DOWNLOAD ENTIRE PAGE AS PDF
   * Uses html2canvas to capture the pageRef DOM node and then
   * converts it into a PDF with jsPDF.
   */
  const handleDownloadPDF = async () => {
    if (!pageRef.current) return;

    try {
      // Capture the page as canvas
      const canvas = await html2canvas(pageRef.current, { scale: 2 });
      const imageData = canvas.toDataURL('image/png');

      // Create a new jsPDF (letter size, portrait)
      const pdf = new jsPDF('p', 'pt', 'letter');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate the image dimensions to fit the PDF
      const imgProps = pdf.getImageProperties(imageData);
      const imgWidth = pageWidth;
      let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // If the captured content is taller than 1 page, we might need to add more pages.
      // Simple approach: If content is taller than the PDF page, we shrink it to fit on one page.
      // More advanced approach: slice the canvas & add multiple pages. For now, we’ll do simple scaling.
      if (imgHeight > pageHeight) {
        const scaleFactor = pageHeight / imgHeight;
        imgHeight *= scaleFactor; // scale both dimensions
      }

      // Add the image to PDF
      pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save('Contract-Agreement.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Outer container ref */}
      <div ref={pageRef} className="mx-auto max-w-7xl bg-white shadow-xl rounded-lg p-8 space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Contract Agreement</h1>
          <p className="text-sm text-gray-500 italic">
            Between Loga <span className="text-lemonGreen-light font-bold">XP</span> Tech and{' '}
            {contract.contractor.name}
          </p>
        </header>

        {/* Company Details Card */}
        <section className="bg-gray-50 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Company Details</h2>
          <div className="text-gray-600 space-y-1">
            <p className="font-medium text-lg">{companyInfo.name}</p>
            <div className="whitespace-pre-line">
              <p>{companyInfo.addressLine1}</p>
              <p>{companyInfo.addressLine2}</p>
            </div>
            <p>
              <span className="font-semibold">Representative:</span> {companyInfo.repName},{' '}
              {companyInfo.repTitle}
            </p>
          </div>
        </section>

        {/* Contractor Details Card */}
        <section className="bg-gray-50 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Contractor Details</h2>
          <div className="text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Name:</span> {contract.contractor.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {contract.contractor.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {contract.contractor.phone_number}
            </p>
          </div>
        </section>

        {/* Contract Details */}
        <section className="bg-gray-50 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Contract Information</h2>
          <div className="text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Project:</span> {contract.projectName}
            </p>
            <p>
              <span className="font-medium">Description:</span> {contract.description}
            </p>
            <p>
              <span className="font-medium">Start Date:</span>{' '}
              {new Date(contract.startDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">End Date:</span>{' '}
              {new Date(contract.endDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Payment Terms:</span> {contract.paymentTerms}
            </p>
            <p>
              <span className="font-medium">Total Cost:</span> ${contract.totalCost}
            </p>
            <p className="flex items-center space-x-2">
              <span className="font-medium">Status:</span>
              <span
                className={`${
                  contract.status === 'Pending'
                    ? 'text-yellow-500'
                    : contract.status === 'Accepted'
                    ? 'text-green-600'
                    : 'text-red-600'
                } font-bold`}
              >
                {contract.status}
              </span>
            </p>
          </div>
        </section>

        {/* Deliverables */}
        {contract.deliverables && contract.deliverables.length > 0 && (
          <section className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Deliverables</h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {contract.deliverables.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Bottom Contact & Support Info */}
        <footer className="pt-8 border-t border-gray-200">
          <div className="text-center space-y-2">
            <p className="text-gray-700 font-medium">
              <span className="font-semibold">Contact:</span> {companyInfo.contactNumber}
            </p>
            <p className="text-gray-700 font-medium">
              <span className="font-semibold">Support:</span> {companyInfo.supportEmail}
            </p>
          </div>
          {/* A small legal or vital disclaimer can go here if needed */}
          <div className="mt-6 text-center text-xs text-gray-400 italic">
            This contract is a legally binding document between the parties. By accepting, you
            confirm that you have read and agreed to all terms.
          </div>
        </footer>
      </div>

      {/* Action Buttons (Print & Download) */}
      <div className="mt-6 flex flex-wrap justify-center items-center space-x-4">
        {/* Accept/Decline only if "Pending" */}
        {contract.status === 'Pending' && (
          <>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md shadow flex items-center space-x-2"
              onClick={handleAccept}
              disabled={isAccepting}
            >
              {isAccepting ? 'Accepting...' : 'Accept Contract'}
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md shadow flex items-center space-x-2"
              onClick={handleDecline}
              disabled={isDeclining}
            >
              {isDeclining ? 'Declining...' : 'Decline Contract'}
            </button>
          </>
        )}

        {/* Print & Download Buttons (always visible) */}
        <button
          onClick={handlePrint}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md shadow flex items-center space-x-2"
        >
          <AiOutlinePrinter />
          <span>Print</span>
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md shadow flex items-center space-x-2"
        >
          <AiOutlineDownload />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};

export default ContractorContractDetails;
