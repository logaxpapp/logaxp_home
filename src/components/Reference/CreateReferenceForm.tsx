import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../features/Toast/ToastContext';

// RTK Query Hooks
import {
  useGetRefereesQuery,
  useCreateReferenceMutation,
  useSendReferenceMutation,
} from '../../api/referenceApi';
import { useFetchAllUsersQuery } from '../../api/usersApi';

// Icons / UI
import { AiOutlineCamera } from 'react-icons/ai';
import SignatureModal from '../../utils/SignaturePad';

// Types
import { IReferee } from '../../types/referee';
import { IUser } from '../../types/user';
import { IReference } from '../../types/reference';

interface CreateReferenceFormData {
  // Which Applicant is this reference for?
  applicantId: string;

  // Optionally pick an existing Referee
  refereeId?: string;

  // If creating a new Referee, these fields are all required by your Mongoose schema
  refereeName: string;
  refereeEmail: string;
  refereeCompanyName: string;
  refereeRelationship: string;
  refereeStartDate: string;  // "YYYY-MM-DD"
  refereeEndDate: string;    // "YYYY-MM-DD"
  refereeAddress: string;
  refereePositionHeld: string;
  refereeUserPositionHeld: string;
  refereeReasonForLeaving: string;
  userSignature: string;     // Must be provided for new referees per your schema

  // Minimal fields for the Reference doc
  referenceRelationship: string; // e.g., "Admin note" or short label
  adminNote?: string;            // If you want an optional typed note
}

const CreateReferenceForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // 1) Fetch potential applicants (Users)
  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useFetchAllUsersQuery({ page: 1, limit: 50 });

  // 2) Fetch existing Referees
  const {
    data: refereesData,
    isLoading: isRefereesLoading,
    isError: isRefereesError,
    error: refereesError,
  } = useGetRefereesQuery({ page: 1, limit: 50 });

  // 3) RTK Mutations: create + send
  const [createReference, createRefState] = useCreateReferenceMutation();
  const [sendReference, sendRefState] = useSendReferenceMutation();

  // Local state for the form
  const [formData, setFormData] = useState<CreateReferenceFormData>({
    applicantId: '',
    refereeId: '',
    refereeName: '',
    refereeEmail: '',
    refereeCompanyName: '',
    refereeRelationship: '',
    refereeStartDate: '',
    refereeEndDate: '',
    refereeAddress: '',
    refereePositionHeld: '',
    refereeUserPositionHeld: '',
    refereeReasonForLeaving: '',
    userSignature: '',
    referenceRelationship: '',
    adminNote: '',
  });

  // For the signature modal
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Extract states from our mutations
  const {
    isLoading: isCreating,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
    error: createError,
  } = createRefState;

  const {
    isLoading: isSending,
    isError: isSendError,
    error: sendError,
  } = sendRefState;

  // -- Side-effects for success/error messages
  useEffect(() => {
    if (isCreateSuccess) {
      showToast('Reference created. Sending now...', 'success');
    }
  }, [isCreateSuccess, showToast]);

  useEffect(() => {
    if (isCreateError && createError) {
      const msg =
        (createError as any)?.data?.message || 'Failed to create reference.';
      showToast(msg, 'error');
    }
  }, [isCreateError, createError, showToast]);

  useEffect(() => {
    if (isSendError && sendError) {
      const msg = (sendError as any)?.data?.message || 'Failed to send reference.';
      showToast(msg, 'error');
    }
  }, [isSendError, sendError, showToast]);

  // Navigate away once fully done (no sending, success, no error)
  useEffect(() => {
    if (!isSending && isCreateSuccess && !isSendError) {
      navigate('/dashboard/references');
    }
  }, [isSending, isCreateSuccess, isSendError, navigate]);

  // handleChange for inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Minimal validation
  const validateForm = (): boolean => {
    // Must choose an applicant
    if (!formData.applicantId) {
      showToast('Please select an Applicant (User).', 'error');
      return false;
    }
    // If not picking an existing Referee => fill all required fields
    if (!formData.refereeId) {
      if (!formData.refereeName.trim()) {
        showToast('Referee name is required for a new Referee.', 'error');
        return false;
      }
      if (!formData.refereeEmail.trim()) {
        showToast('Referee email is required.', 'error');
        return false;
      }
      if (!formData.refereeCompanyName.trim()) {
        showToast('Referee company name is required.', 'error');
        return false;
      }
      if (!formData.refereeRelationship.trim()) {
        showToast('Referee relationship is required.', 'error');
        return false;
      }
      if (!formData.refereeStartDate) {
        showToast('Referee start date is required.', 'error');
        return false;
      }
      if (!formData.refereeEndDate) {
        showToast('Referee end date is required.', 'error');
        return false;
      }
      if (!formData.refereeAddress.trim()) {
        showToast('Referee address is required.', 'error');
        return false;
      }
      if (!formData.refereePositionHeld.trim()) {
        showToast('Referee position held is required.', 'error');
        return false;
      }
      if (!formData.refereeUserPositionHeld.trim()) {
        showToast('User position held is required.', 'error');
        return false;
      }
      if (!formData.refereeReasonForLeaving.trim()) {
        showToast('Reason for leaving is required.', 'error');
        return false;
      }
      if (!formData.userSignature.trim()) {
        showToast('Referee signature is required.', 'error');
        return false;
      }
    }

   
    return true;
  };

  // handleSubmit -> create + send
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Build the minimal reference payload
    const payload: Partial<IReference> & {
      refereeDetails?: any;
      refereeId?: string;
      applicant?: string;
    } = {
      applicant: formData.applicantId,
      // The reference's "relationship" field
      relationship: formData.referenceRelationship,

      // We can optionally store adminNote in "additionalComments"
      // if you want that. For example:
      // additionalComments: formData.adminNote || '',

      // We might leave these blank or placeholders if the referee is expected to fill them later
      positionHeld: '',
      startDate: '',
      endDate: '',
      reasonForLeaving: '',
      salary: '',
      performance: '',
      conduct: '',
      integrity: '',
      additionalComments: '',
    };

    if (formData.refereeId) {
      // existing referee
      payload.refereeId = formData.refereeId;
    } else {
      // brand-new referee
      payload.refereeDetails = {
        name: formData.refereeName,
        email: formData.refereeEmail,
        companyName: formData.refereeCompanyName,
        relationship: formData.refereeRelationship,
        startDate: formData.refereeStartDate,
        endDate: formData.refereeEndDate,
        reasonForLeaving: formData.refereeReasonForLeaving,
        address: formData.refereeAddress,
        positionHeld: formData.refereePositionHeld,
        userPositionHeld: formData.refereeUserPositionHeld,
        userSignature: formData.userSignature,
      };
    }

    try {
      console.log('Final Payload =>', payload);
      // 1) create
      const newRef = await createReference(payload).unwrap();
      console.log('CreateReference response =>', newRef);
      if (!newRef._id) return;

      // 2) send
      const sentRef = await sendReference(newRef._id).unwrap();
      console.log('SendReference response =>', sentRef);

      showToast('Reference sent successfully!', 'success');
    } catch (err) {
      console.error('Create/Send Reference Error:', err);
      // error toast handled by useEffect
    }
  };

  // For the signature modal
  const handleSaveSignature = (signature: string) => {
    setFormData((prev) => ({ ...prev, userSignature: signature }));
  };

  return (
    <div className="m-2 mx-auto p-6 bg-white shadow-md rounded-md text-gray-700">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
  Initiate a Professional Reference
      </h2>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        Provide the applicant’s information and select or create a referee to send them a formal reference request.
      </p>
      {/* Loading or error states */}
      {isUsersLoading && <p>Loading users...</p>}
      {isUsersError && (
        <p className="text-red-500">Error loading users: {String(usersError)}</p>
      )}
      {isRefereesLoading && <p>Loading referees...</p>}
      {isRefereesError && (
        <p className="text-red-500">Error loading referees: {String(refereesError)}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        {/* Applicant (User) */}
        <div className="bg-gray-50 p-4 rounded-md shadow">
          <h4 className="text-md font-semibold text-gray-800 mb-3">
            Select Applicant &amp; Referee
          </h4>

          {/* Two columns on medium+ screens, stacking on small */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Applicant */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Applicant (User) <span className="text-red-500">*</span>
              </label>
              <select
                name="applicantId"
                value={formData.applicantId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 mt-1"
              >
                <option value="">-- Select Applicant --</option>
                {usersData?.users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Column 2: Referee */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Existing Referee (Optional)
              </label>
              <select
                name="refereeId"
                value={formData.refereeId}
                onChange={handleChange}
                disabled={!formData.applicantId}
                className="w-full border border-gray-300 rounded p-2 mt-1"
              >
                <option value="">-- Select Referee --</option>
                {refereesData?.referees
                  ?.filter((ref) => ref.user === formData.applicantId)
                  .map((ref) => (
                    <option key={ref._id} value={ref._id}>
                      {ref.name} ({ref.email})
                    </option>
                  ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                If you have an existing Referee doc, select it. Otherwise fill out new details below.
              </p>
            </div>
          </div>
        </div>
        {/* NEW REFEREE DETAILS */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            New Referee Details (required if no existing referee selected)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* name */}
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Referee Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="refereeName"
                value={formData.refereeName}
                onChange={handleChange}
                disabled={!!formData.refereeId}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            </div>

            {/* email */}
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Referee Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="refereeEmail"
                value={formData.refereeEmail}
                onChange={handleChange}
                disabled={!!formData.refereeId}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            </div>

            {/* companyName */}
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="refereeCompanyName"
                value={formData.refereeCompanyName}
                onChange={handleChange}
                disabled={!!formData.refereeId}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            </div>

            {/* relationship */}
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Referee Relationship <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="refereeRelationship"
                value={formData.refereeRelationship}
                onChange={handleChange}
                disabled={!!formData.refereeId}
                className="w-full border border-gray-300 rounded p-2 text-sm"
                placeholder="e.g., Manager"
              />
            </div>

            {/* startDate */}
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="refereeStartDate"
                value={formData.refereeStartDate}
                onChange={handleChange}
                disabled={!!formData.refereeId}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            </div>

            {/* endDate */}
            <div>
              <label className="block text-xs font-medium text-gray-600">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="refereeEndDate"
                value={formData.refereeEndDate}
                onChange={handleChange}
                disabled={!!formData.refereeId}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            </div>

            

            {/* positionHeld */}
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Position Held <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="refereePositionHeld"
                value={formData.refereePositionHeld}
                onChange={handleChange}
                disabled={!!formData.refereeId}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            </div>

            {/* userPositionHeld */}
            <div>
              <label className="block text-xs font-medium text-gray-600">
                User Position Held <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="refereeUserPositionHeld"
                value={formData.refereeUserPositionHeld}
                onChange={handleChange}
                disabled={!!formData.refereeId}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            </div>
            {/* address */}
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="refereeAddress"
                value={formData.refereeAddress}
                onChange={handleChange}
                disabled={!!formData.refereeId}
                className="w-full border border-gray-300 rounded p-2 text-sm"
                rows={2}
              />
            </div>

            {/* reasonForLeaving */}
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Reason for Leaving <span className="text-red-500">*</span>
              </label>
              <textarea
                name="refereeReasonForLeaving"
                value={formData.refereeReasonForLeaving}
                onChange={handleChange}
                disabled={!!formData.refereeId}
                className="w-full border border-gray-300 rounded p-2 text-sm"
                rows={2}
              />
            </div>

            {/* userSignature */}
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Referee Signature <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setIsSignatureModalOpen(true)}
                  disabled={!!formData.refereeId}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <AiOutlineCamera className="mr-2" />
                  Adopt Signature
                </button>
                {formData.userSignature && (
                  <div className="flex items-center space-x-2">
                    {formData.userSignature.startsWith('data:image') ? (
                      <img
                        src={formData.userSignature}
                        alt="Signature Preview"
                        className="h-12 w-40 object-contain border border-gray-300 p-2 rounded-md"
                      />
                    ) : (
                      <span
                        className="text-lg font-medium text-gray-700 font-signature"
                        style={{ fontFamily: '"Dancing Script", cursive' }}
                      >
                        {formData.userSignature}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Capture or type the referee’s signature if creating a new referee.
              </p>
            </div>
          </div>
        </div>
        {/* Submit */}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/references')}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating || isSending}
            className={`px-6 py-2 font-medium rounded-md text-white ${
              isCreating || isSending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isCreating || isSending ? 'Processing...' : 'Create & Send'}
          </button>
        </div>
      </form>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={(sig) => handleSaveSignature(sig)}
      />
    </div>
  );
};

export default CreateReferenceForm;
