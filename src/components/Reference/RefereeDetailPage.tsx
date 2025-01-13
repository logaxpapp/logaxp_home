// src/components/RefereeDetailPage.tsx

import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetRefereeQuery,
  useDeleteRefereeMutation,
} from '../../api/referenceApi';
import { IReferee } from '../../types/referee';
import { useToast } from '../../features/Toast/ToastContext';
import {
  FiEdit,
  FiTrash2,
  FiArrowLeft,
  FiUser,
  FiPrinter,
  FiDownload,
} from 'react-icons/fi';
import {
  MdEmail,
  MdBusiness,
  MdWork,
  MdLocationOn,
  MdDateRange,
} from 'react-icons/md';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/** 
 * A small helper to format ISO date strings into something readable.
 */
const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString();
};

const RefereeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Fetch referee details
  const { data, error, isLoading, isError } = useGetRefereeQuery(id!);

  // Delete referee mutation
  const [deleteReferee, { isLoading: isDeleting }] = useDeleteRefereeMutation();

  // **Refs** for printing / PDF
  const componentRef = useRef<HTMLDivElement>(null);

  // --- Print Handler (react-to-print)
  const printFunc = useReactToPrint({
    // cast to 'any' or an extended type if TS is stubborn
    ...( {
      content: () => componentRef.current,
      documentTitle: 'MyPrintDocument',
    } as any ),
  });
  

  // We'll call printFunc() in the button's onClick
  const handlePrint = () => {
    if (printFunc) {
      printFunc(); // triggers the printing
    }
  };

  // --- Download PDF Handler (html2canvas + jsPDF)
  const handleDownloadPdf = async () => {
    if (!componentRef.current) return;
    try {
      const element = componentRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'pt', 'a4');
      // Calculate width/height to fit in A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('RefereeDetails.pdf');
    } catch (error) {
      console.error('PDF Download Error:', error);
      showToast('Failed to download PDF', 'error');
    }
  };

  // Handle Delete Action
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this referee?')) {
      return;
    }
    try {
      await deleteReferee(id!).unwrap();
      showToast('Referee deleted successfully!', 'success');
      navigate('/dashboard/referees');
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to delete referee.', 'error');
      console.error('Delete Referee Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center text-blue-600 hover:underline"
        >
          <FiArrowLeft className="mr-2" />
          Go Back
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-300 h-12 w-12" />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {typeof error === 'string'
                ? error
                : 'An error occurred while fetching referee details.'}
            </div>
          )}

          {/* Referee Details */}
          {!isLoading && !isError && data && (
            <>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Referee Details
                </h2>

                <div className="flex flex-wrap gap-3">
                  {/* Print */}
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                  >
                    <FiPrinter className="mr-2" />
                    Print
                  </button>

                  {/* Download PDF */}
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FiDownload className="mr-2" />
                    Download PDF
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => navigate(`/referees/edit/${data._id}`)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiEdit className="mr-2" />
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${
                        isDeleting
                          ? 'bg-red-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      }`}
                  >
                    <FiTrash2 className="mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              {/* Printable Content */}
              <div ref={componentRef} id="printableRefereeDetails">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex">
                    <div className="mr-3 text-gray-400">
                      <FiUser size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Name</h3>
                      <p className="text-base text-gray-800 font-medium">
                        {data.name}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex">
                    <div className="mr-3 text-gray-400">
                      <MdEmail size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Email</h3>
                      <p className="text-base text-gray-800 font-medium">
                        {data.email}
                      </p>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="flex">
                    <div className="mr-3 text-gray-400">
                      <MdBusiness size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Company Name</h3>
                      <p className="text-base text-gray-800 font-medium">
                        {data.companyName}
                      </p>
                    </div>
                  </div>

                  {/* Relationship */}
                  <div className="flex">
                    <div className="mr-3 text-gray-400">
                      <MdWork size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Relationship</h3>
                      <p className="text-base text-gray-800 font-medium">
                        {data.relationship}
                      </p>
                    </div>
                  </div>

                  {/* Position Held */}
                  <div className="flex">
                    <div className="mr-3 text-gray-400">
                      <MdWork size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Position Held</h3>
                      <p className="text-base text-gray-800 font-medium">
                        {data.positionHeld}
                      </p>
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="flex">
                    <div className="mr-3 text-gray-400">
                      <MdDateRange size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Start Date</h3>
                      <p className="text-base text-gray-800 font-medium">
                        {data.startDate ? formatDate(data.startDate) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="flex">
                    <div className="mr-3 text-gray-400">
                      <MdDateRange size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">End Date</h3>
                      <p className="text-base text-gray-800 font-medium">
                        {data.endDate ? formatDate(data.endDate) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex">
                    <div className="mr-3 text-gray-400">
                      <MdLocationOn size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Address</h3>
                      <p className="text-base text-gray-800 font-medium whitespace-pre-line">
                        {data.address}
                      </p>
                    </div>
                  </div>

                  {/* Reason for Leaving */}
                  <div className="flex">
                    <div className="mr-3 text-gray-400">
                      <FiTrash2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">
                        Reason for Leaving
                      </h3>
                      <p className="text-base text-gray-800 font-medium whitespace-pre-line">
                        {data.reasonForLeaving || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* User's Position */}
                  <div className="flex">
                    <div className="mr-3 text-gray-400">
                      <MdWork size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Your Position</h3>
                      <p className="text-base text-gray-800 font-medium">
                        {data.userPositionHeld || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* User Signature */}
                  <div className="flex">
                    <div className="mr-3 text-gray-400">
                      <FiEdit size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Signature</h3>
                      {data.userSignature ? (
                        data.userSignature.startsWith('data:image') ? (
                          <img
                            src={data.userSignature}
                            alt="Signature"
                            className="mt-2 h-20 w-40 object-contain border border-gray-200 p-2 rounded-md"
                          />
                        ) : (
                          <span
                            className="text-base font-medium text-gray-800 font-signature"
                            style={{ fontFamily: '"Dancing Script", cursive' }}
                          >
                            {data.userSignature}
                          </span>
                        )
                      ) : (
                        <p className="text-base text-gray-500">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefereeDetailPage;
