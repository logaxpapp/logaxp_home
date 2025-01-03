// src/components/Admin/Contracts/ContractDetails.tsx

import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useFetchContractByIdQuery,
  useAcceptContractMutation,
  useDeclineContractMutation,
} from '../../../api/contractApi';
import Loader from '../../Loader';

import { stripHtml } from '../../../utils/stripHtml';

// PDF/Image libraries
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Icons
import { AiOutlinePrinter, AiOutlineDownload } from 'react-icons/ai';
import { FaTimesCircle } from 'react-icons/fa';

const ContractDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 1. Data and mutations
  const { data: contract, error, isLoading } = useFetchContractByIdQuery(id!);
  const [acceptContract, { isLoading: isAccepting }] = useAcceptContractMutation();
  const [declineContract, { isLoading: isDeclining }] = useDeclineContractMutation();

  // 2. Example: Company & Contact Info (Adjust these details as needed)
  const companyInfo = {
    name: 'LogaXP Tech',
    addressLine1: '1108 Berry Street',
    addressLine2: 'Old Hickory, Tennessee, 37138, United States',
    repName: 'Rabi Umar',
    repTitle: 'Chief Operating Officer',
    contactNumber: '615-554-3592',
    supportEmail: 'support@logaxp.com',
  };

  // 3. Ref to capture the contract page for PDF generation
  const pageRef = useRef<HTMLDivElement>(null);

  // 4. Handle loading or errors
  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <div>
          <FaTimesCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-red-500">Error fetching contract details.</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <div>
          <FaTimesCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-red-500">Contract not found.</p>
        </div>
      </div>
    );
  }

  // 5. Handler functions

  // 5a. Accept Contract
  const handleAccept = async () => {
    try {
      await acceptContract(id!).unwrap();
      navigate('/dashboard/admin/contracts');
    } catch (err) {
      console.error('Failed to accept contract:', err);
    }
  };

  // 5b. Decline Contract
  const handleDecline = async () => {
    const reason = prompt('Please provide a reason for declining:');
    if (reason) {
      try {
        await declineContract({ id: id!, reason }).unwrap();
        navigate('/dashboard/admin/contracts');
      } catch (err) {
        console.error('Failed to decline contract:', err);
      }
    }
  };

  // 5c. Print the entire page
  const handlePrint = () => {
    window.print();
  };

  // 5d. Download entire page as PDF
  const handleDownloadPDF = async () => {
    if (!pageRef.current) return;

    try {
      const canvas = await html2canvas(pageRef.current, { scale: 2 });
      const imageData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'pt', 'letter');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate scaling
      const imgProps = pdf.getImageProperties(imageData);
      const imgWidth = pageWidth;
      let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // If the image is taller than the page, scale it down
      if (imgHeight > pageHeight) {
        const scaleFactor = pageHeight / imgHeight;
        imgHeight *= scaleFactor;
      }

      pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Contract-Agreement.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  // 6. Render the Contract Page
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Capture everything inside pageRef */}
      <div ref={pageRef} className="mx-auto max-w-7xl bg-white shadow-xl rounded-lg p-8 space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Contract Agreement</h1>
          <p className="text-sm text-gray-500 italic">
            Between <span className="font-bold text-teal-600">{companyInfo.name}</span> and{' '}
            <span className="font-bold text-gray-600">{contract.contractor.name}</span>
          </p>
        </header>

        {/* Company Details */}
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

        {/* Contractor Details */}
        <section className="bg-gray-50 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Contractor Details</h2>
          <div className="text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Name:</span> {contract.contractor.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {contract.contractor.email}
            </p>
            {contract.contractor.phone_number && (
              <p>
                <span className="font-medium">Phone:</span> {contract.contractor.phone_number}
              </p>
            )}
          </div>
        </section>

        {/* Contract Information */}
        <section className="bg-gray-50 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Contract Information</h2>
          <div className="text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Project:</span> {contract.projectName}
            </p>
            <p>
              <span className="font-medium">Description:</span> {stripHtml(contract.description)}
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

       {/* Attachments (if any) */}
      <section className="bg-blue-50 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Attachments</h2>
        {contract.attachments && contract.attachments.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            {contract.attachments.map((attachment: string, idx: number) => (
              <li key={idx}>
                <a
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {attachment}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 italic">
            <p>No attachments available for this contract.</p>
          </div>
        )}
          </section>
          <hr />
                {/* Risk Management */}
          {contract.riskSection && contract.riskSection.length > 0 && (
            <section className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Risk Management</h2>
              {contract.riskSection.map((risk, index) => (
                <div key={index} className="mb-4 text-gray-600">
                  <p>
                    <strong>Risk Name:</strong> {risk.riskName}
                  </p>
                  <p>
                    <strong>Severity:</strong> {risk.severity}
                  </p>
                  <p>
                    <strong>Probability:</strong> {risk.probability}
                  </p>
                  <p>
                    <strong>Impact:</strong> {risk.impact}
                  </p>
                  <p>
                  <strong>Description:</strong> {risk.description ? stripHtml(risk.description) : 'No description provided.'}
                  </p>
                  <p>
                    <strong>Mitigation Strategy:</strong> {risk.mitigationStrategy}
                  </p>
                </div>
              ))}
            </section>
          )}


        {/* Footer */}
        <footer className="pt-8 border-t border-gray-200 text-center">
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">
              <span className="font-semibold">Contact:</span> {companyInfo.contactNumber}
            </p>
            <p className="text-gray-700 font-medium">
              <span className="font-semibold">Support:</span> {companyInfo.supportEmail}
            </p>
          </div>
          <div className="mt-6 text-xs text-gray-400 italic">
            This contract is a legally binding document between the parties. By accepting, you
            confirm that you have read and agreed to all terms.
          </div>
        </footer>
      </div>

      {/* Action Buttons: Accept, Decline, Print, Download */}
      <div className="mt-6 flex flex-wrap justify-center items-center space-x-4">
        {/* Accept/Decline if contract is "Pending" */}
        {contract.status === 'Pending' && (
          <>
            <button
              onClick={handleAccept}
              disabled={isAccepting}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md shadow flex items-center"
            >
              {isAccepting ? 'Accepting...' : 'Accept Contract'}
            </button>
            <button
              onClick={handleDecline}
              disabled={isDeclining}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md shadow flex items-center"
            >
              {isDeclining ? 'Declining...' : 'Decline Contract'}
            </button>
          </>
        )}

        {/* Print & Download (always visible) */}
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

export default ContractDetails;
