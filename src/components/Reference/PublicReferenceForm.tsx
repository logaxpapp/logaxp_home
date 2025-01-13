import React, { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import SignatureCanvas from 'react-signature-canvas';

// Hooks & Helpers
import { useGetReferenceFormQuery, useSubmitReferenceFormMutation } from '../../api/referenceApi';
import { useToast } from '../../features/Toast/ToastContext';

// Assets
import Logo from '../../assets/images/green.svg';

/**
 * The interface describing all the fields the referee will fill out.
 * Make sure these match your Mongoose schema where applicable.
 */
interface IEmploymentReferenceFormData {
  startDate: string;        // was "from"
  endDate: string;          // was "to"
  positionHeld: string;     // was "positionHeld" (unchanged)
  relationship?: string;
  reasonForLeaving: string;
  salary: string;
  daysAbsent?: string;
  periodsAbsent?: string;
  conduct?: string;
  performance?: string;
  integrity?: string;
  additionalComments?: string;
  name: string;
  jobTitle: string;
  date: string;             // date signed
  companyName: string;
  companyAddress: string;
  reEmploy: string;         // "Yes" | "No" | "Maybe"
  refereeSignature?: string; // base64 or typed
}

interface IEmploymentReferenceErrors {
  [key: string]: string | undefined;
}

const PublicReferenceForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // 1) Retrieve the token from query params
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  // 2) Fetch existing reference data
  const {
    data: referenceData,
    error: fetchError,
    isLoading: isFetching,
  } = useGetReferenceFormQuery(token);

  

  // 3) Mutation for submitting the form
  const [
    submitReferenceForm,
    { isLoading: isSubmitting, isSuccess, isError, error: submitError },
  ] = useSubmitReferenceFormMutation();

  // 4) Local form state
  const [formData, setFormData] = useState<IEmploymentReferenceFormData>({
    startDate: '',
    endDate: '',
    positionHeld: '',
    relationship: '',
    reasonForLeaving: '',
    salary: '',
    daysAbsent: '',
    periodsAbsent: '',
    conduct: '',
    performance: '',
    integrity: '',
    additionalComments: '',
    name: '',
    jobTitle: '',
    date: '',
    companyName: '',
    companyAddress: '',
    reEmploy: '',
    refereeSignature: '',
  });

  // 5) Signature handling
  const [isSignatureModalOpen, setSignatureModalOpen] = useState(false);
  const [useSignaturePad, setUseSignaturePad] = useState(false);
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const [typedSignature, setTypedSignature] = useState(''); 
  const [drawnSignature, setDrawnSignature] = useState(''); 

  // 6) Errors
  const [errors, setErrors] = useState<IEmploymentReferenceErrors>({});

  // 7) Prefill if reference data is available
  useEffect(() => {
    if (referenceData?.reference) {
      const {
        startDate,
        endDate,
        positionHeld,
        relationship,
        reasonForLeaving,
        salary,
        daysAbsent,
        periodsAbsent,
        conduct,
        performance,
        integrity,
        additionalComments,
        
      } = referenceData.reference;

      setFormData((prev) => ({
        ...prev,
        startDate: startDate ? new Date(startDate).toISOString().split('T')[0] : '',
        endDate: endDate ? new Date(endDate).toISOString().split('T')[0] : '',
        positionHeld: positionHeld || '',
        relationship: relationship || '',
        reasonForLeaving: reasonForLeaving || '',
        salary: salary || '',
        daysAbsent: daysAbsent || '',
        periodsAbsent: periodsAbsent || '',
        conduct: conduct || '',
        performance: performance || '',
        integrity: integrity || '',
        additionalComments: additionalComments || '',
      }));
    }
  }, [referenceData]);

  // 8) On success
  useEffect(() => {
    if (isSuccess) {
      showToast('Reference submitted successfully!', 'success');
      navigate('/thank-you');
    }
  }, [isSuccess, navigate, showToast]);

  // 9) On error
  useEffect(() => {
    if (isError && submitError) {
      const errMsg =
        (submitError as any)?.data?.message || 'Failed to submit reference.';
      showToast(errMsg, 'error');
    }
  }, [isError, submitError, showToast]);

  // 10) Handle input
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // 11) Validate
  const validateForm = (): boolean => {
    const newErrors: IEmploymentReferenceErrors = {};

    if (!formData.startDate) newErrors.startDate = 'Start date is required.';
    if (!formData.endDate) newErrors.endDate = 'End date is required.';
    if (!formData.positionHeld.trim()) newErrors.positionHeld = 'Position held is required.';
    if (!formData.reasonForLeaving.trim()) {
      newErrors.reasonForLeaving = 'Reason for leaving is required.';
    }
    if (!formData.salary.trim()) newErrors.salary = 'Salary is required.';
    if (!formData.name.trim()) newErrors.name = 'Your name is required.';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Your job title is required.';
    if (!formData.date) newErrors.date = 'Date is required.';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required.';
    if (!formData.companyAddress.trim()) {
      newErrors.companyAddress = 'Company address is required.';
    }
    if (!formData.reEmploy) {
      newErrors.reEmploy = 'This field is required.';
    }
    // Check signature
    if (!typedSignature && !drawnSignature) {
      newErrors.signature = 'Signature is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 12) Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalSignature = drawnSignature || typedSignature;

    const payload = {
      token,
      ...formData,
      refereeSignature: finalSignature,
    };

    try {
      await submitReferenceForm(payload).unwrap();
      // success handled by isSuccess effect
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  // 13) Signature Modal
  const openSignatureModal = () => {
    setSignatureModalOpen(true);
  };

  const closeSignatureModal = () => {
    setSignatureModalOpen(false);
    setUseSignaturePad(false);
    setTypedSignature('');
    setDrawnSignature('');
    setErrors((prev) => ({ ...prev, signature: undefined }));
  };

  const handleAdoptSignature = () => {
    if (useSignaturePad) {
      if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
        const dataURL = signaturePadRef.current
          .getTrimmedCanvas()
          .toDataURL('image/png');
        setDrawnSignature(dataURL);
        setTypedSignature('');
        setSignatureModalOpen(false);
        setErrors((prev) => ({ ...prev, signature: undefined }));
      } else {
        setErrors((prev) => ({
          ...prev,
          signature: 'Please provide a drawn signature.',
        }));
      }
    } else {
      // Typed signature
      if (!typedSignature.trim()) {
        setErrors((prev) => ({
          ...prev,
          signature: 'Name is required to adopt signature.',
        }));
      } else {
        setDrawnSignature('');
        setSignatureModalOpen(false);
        setErrors((prev) => ({ ...prev, signature: undefined }));
      }
    }
  };

  const handleClearSignature = () => {
    signaturePadRef.current?.clear();
    setErrors((prev) => ({ ...prev, signature: undefined }));
  };

  // 14) If isFetching
  if (isFetching) {
    return <p className="p-4">Loading reference data...</p>;
  }

  // 15) If fetchError
  if (fetchError) {
    return (
      <div className="p-4 text-red-600">
        <p>Failed to load reference. The link may be invalid or expired.</p>
      </div>
    );
  }

  // 16) If no data
  if (!referenceData) {
    return <div className="p-4">No reference data found.</div>;
  }

  // For display in the header, etc.
  const refObj = referenceData.reference;
  const applicantName = refObj?.applicant?.name || '...';
  const refereePosition = refObj?.referee?.userPositionHeld || '...';
  const refereeStartDate = refObj?.referee?.startDate
    ? new Date(refObj.referee.startDate).toLocaleDateString()
    : '...';

  return (
    <div className="mx-auto p-6 bg-gray-100 shadow-md rounded-md max-w-7xl">
      <div className="border-b-2 pb-6 mb-8 p-8 bg-gray-50 rounded-md shadow-md">
        {/* --- HEADER SECTION --- */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between border-b-2 pb-6 mb-8">
          <div className="flex items-center space-x-4">
            <img src={Logo} alt="Company Logo" className="h-12 w-auto" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reference Request</h1>
              <p className="text-sm text-gray-600">
                Candidate:{' '}
                <span className="font-medium">
                  {applicantName}
                </span>
                <br />
                Position:{' '}
                <span className="font-medium">
                  {refereePosition}
                </span>{' '}
                |{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  View Job
                </a>
              </p>
            </div>
          </div>
          <button
            className="mt-4 md:mt-0 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => alert('View Consent button clicked')}
          >
            View Consent
          </button>
        </div>

        {/* --- Candidate Notes Section --- */}
        <div className="bg-gray-100 p-5 rounded-md mb-8">
          <h2 className="text-lg font-semibold text-gray-800">Candidate Notes</h2>
          <p className="text-sm text-gray-600">
            {applicantName} worked for your company as a{' '}
            <span className="font-medium">{refereePosition}</span>{' '}
            starting from{' '}
            <span className="font-medium">{refereeStartDate}</span>.
          </p>
        </div>

        {/* Introduction Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Thank You for Providing a Reference
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Thank you for taking the time to provide an <strong>employment reference</strong> for 
            the candidate listed above. This information will be used solely to assess the applicant’s 
            suitability for a position at <span className="font-medium">LogaXP</span>. Please answer each question 
            thoroughly based on your professional experiences with the applicant.
            </p>
        </div>
        {/* Confidentiality Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>Note:</strong> This reference is strictly confidential and will only be used
            to assess the applicant's suitability for the position. It does not serve as an
            employment offer or guarantee. Please ensure that all the information provided is
            accurate and complete.
          </p>
        </div>

        {/* Legal Disclaimer */}
        <div className="text-xs text-gray-500 mb-6">
          <p>
            <strong>Important:</strong> This role is exempt from the Rehabilitation of Offenders
            Act 1974. This means that all relevant convictions must be disclosed as part of
            this reference.
          </p>
        </div>

        {/* The actual form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
          {/* --- Employment Period Section --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>
            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* positionHeld */}
          <div>
            <label htmlFor="positionHeld" className="block text-sm font-medium text-gray-700">
              Position(s) Held<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="positionHeld"
              name="positionHeld"
              value={formData.positionHeld}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                errors.positionHeld ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              placeholder="e.g., Care Assistant"
            />
            {errors.positionHeld && (
              <p className="text-red-500 text-xs mt-1">{errors.positionHeld}</p>
            )}
          </div>

          {/* Relationship (Optional) */}
          <div>
            <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
              Relationship
            </label>
            <input
              type="text"
              id="relationship"
              name="relationship"
              value={formData.relationship}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="e.g., Supervisor"
            />
          </div>
          </div>

          {/* reasonForLeaving */}
          <div>
            <label htmlFor="reasonForLeaving" className="block text-sm font-medium text-gray-700">
              Reason(s) for Leaving<span className="text-red-500">*</span>
            </label>
            <textarea
              id="reasonForLeaving"
              name="reasonForLeaving"
              value={formData.reasonForLeaving}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                errors.reasonForLeaving ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              rows={3}
            />
            {errors.reasonForLeaving && (
              <p className="text-red-500 text-xs mt-1">{errors.reasonForLeaving}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* salary */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
              Salary / Rate of Pay<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                errors.salary ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              placeholder="e.g., $12/hour"
            />
            {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
          </div>

           {/* Re-employment Section */}
        <div>
          <label htmlFor="reEmploy" className="block text-sm font-medium text-gray-700">
            Would you re-employ them?<span className="text-red-500">*</span>
          </label>
          <select
            id="reEmploy"
            name="reEmploy"
            value={formData.reEmploy}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${
              errors.reEmploy ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="">-- Please choose an option --</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Maybe">Maybe</option>
          </select>
          {errors.reEmploy && (
            <p className="text-red-500 text-xs mt-1">{errors.reEmploy}</p>
          )}
        </div>
        </div>

          {/* Days Absent / Periods Absent (Optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="daysAbsent" className="block text-sm font-medium text-gray-700">
                Days Absent
              </label>
              <input
                type="text"
                id="daysAbsent"
                name="daysAbsent"
                value={formData.daysAbsent}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g., 5 days"
              />
            </div>
            <div>
              <label htmlFor="periodsAbsent" className="block text-sm font-medium text-gray-700">
                Periods Absent
              </label>
              <input
                type="text"
                id="periodsAbsent"
                name="periodsAbsent"
                value={formData.periodsAbsent}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g., Winter 2023"
              />
            </div>
          </div>

          {/* performance (Optional) */}
          <div>
            <label htmlFor="performance" className="block text-sm font-medium text-gray-700">
              Performance
            </label>
            <textarea
              id="performance"
              name="performance"
              value={formData.performance}
              onChange={handleInputChange}
              className={`mt-1 block w-full border border-gray-300 rounded-md`}
              rows={3}
            />
          </div>

          {/* conduct (Optional) */}
          <div>
            <label htmlFor="conduct" className="block text-sm font-medium text-gray-700">
              Conduct
            </label>
            <textarea
              id="conduct"
              name="conduct"
              value={formData.conduct}
              onChange={handleInputChange}
              className={`mt-1 block w-full border border-gray-300 rounded-md`}
              rows={3}
            />
          </div>

          {/* integrity (Optional) */}
          <div>
            <label htmlFor="integrity" className="block text-sm font-medium text-gray-700">
              Integrity
            </label>
            <textarea
              id="integrity"
              name="integrity"
              value={formData.integrity}
              onChange={handleInputChange}
              className={`mt-1 block w-full border border-gray-300 rounded-md`}
              rows={3}
            />
          </div>

          {/* additionalComments (Optional) */}
          <div>
            <label htmlFor="additionalComments" className="block text-sm font-medium text-gray-700">
              Additional Comments
            </label>
            <textarea
              id="additionalComments"
              name="additionalComments"
              value={formData.additionalComments}
              onChange={handleInputChange}
              className={`mt-1 block w-full border border-gray-300 rounded-md`}
              rows={3}
            />
          </div>

          {/* Referee Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Your Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Your Full Name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* jobTitle */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                Your Job Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.jobTitle ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Your Position"
              />
              {errors.jobTitle && (
                <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>
              )}
            </div>
          </div>

          {/* date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* companyName */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                errors.companyName ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Your Company Name"
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
            )}
          </div>

          {/* companyAddress */}
          <div>
            <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700">
              Company Address<span className="text-red-500">*</span>
            </label>
            <textarea
              id="companyAddress"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                errors.companyAddress ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              rows={3}
              placeholder="Your Company Address"
            />
            {errors.companyAddress && (
              <p className="text-red-500 text-xs mt-1">{errors.companyAddress}</p>
            )}
          </div>
        </form>

       

        {/* Signature & Submit */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-300 p-6 rounded-md mt-8">
          {/* Signature */}
          <div className="w-full md:w-2/3">
            <label htmlFor="signature" className="block text-sm font-medium text-gray-700">
              Your Signature<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-3 mt-2">
              {typedSignature && (
                <div
                  className="text-xl text-gray-800 font-signature border border-gray-300 p-2 rounded"
                  style={{ fontFamily: '"Dancing Script", cursive' }}
                >
                  {typedSignature}
                </div>
              )}
              {drawnSignature && (
                <img
                  src={drawnSignature}
                  alt="Signature Preview"
                  className="h-16 border border-gray-300 rounded"
                />
              )}
              <button
                type="button"
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                onClick={openSignatureModal}
              >
                {typedSignature || drawnSignature ? 'Edit Signature' : 'Sign'}
              </button>
            </div>
            {errors.signature && (
              <p className="text-red-500 text-xs mt-1">{errors.signature}</p>
            )}
          </div>
          {/* Submit button */}
          <div className="w-full md:w-1/3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full inline-flex items-center justify-center px-4 py-2 text-white font-semibold rounded ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Reference'}
            </button>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      <Dialog
        open={isSignatureModalOpen}
        onClose={closeSignatureModal}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 text-gray-800"
      >
        <Dialog.Panel className="bg-white rounded-lg p-8 max-w-lg w-full">
          <Dialog.Title className="text-2xl font-semibold mb-4">
            Adopt Your Signature
          </Dialog.Title>

          <div className="mb-4 flex space-x-4">
            <button
              type="button"
              onClick={() => setUseSignaturePad(false)}
              className={`px-4 py-2 rounded ${
                !useSignaturePad ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              Type Signature
            </button>
            <button
              type="button"
              onClick={() => setUseSignaturePad(true)}
              className={`px-4 py-2 rounded ${
                useSignaturePad ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              Draw Signature
            </button>
          </div>

          {/* Typed vs. Drawn Signature */}
          {!useSignaturePad ? (
            // Typed
            <div>
              <label
                htmlFor="modalTypedSignature"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Name *
              </label>
              <input
                type="text"
                id="modalTypedSignature"
                value={typedSignature}
                onChange={(e) => {
                  setTypedSignature(e.target.value);
                  setErrors((prev) => ({ ...prev, signature: undefined }));
                }}
                className={`mt-1 block w-full border ${
                  errors.signature ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Type your name"
              />
              {errors.signature && (
                <p className="text-red-500 text-sm mt-1">{errors.signature}</p>
              )}
            </div>
          ) : (
            // Drawn
            <div>
              <label
                htmlFor="signaturePad"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Draw Your Signature *
              </label>
              <div className="border border-gray-300 rounded-md shadow-sm">
                <SignatureCanvas
                  penColor="black"
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: 'signature-canvas',
                  }}
                  ref={signaturePadRef}
                />
              </div>
              {errors.signature && (
                <p className="text-red-500 text-sm mt-1">{errors.signature}</p>
              )}
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={handleClearSignature}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleAdoptSignature}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Adopt and Sign
            </button>
            <button
              type="button"
              onClick={closeSignatureModal}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default PublicReferenceForm;
