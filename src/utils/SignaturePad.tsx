// src/utils/SignaturePad.tsx

import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import SignatureCanvas from 'react-signature-canvas';
import {
  AiOutlineClear,
  AiOutlineCheck,
  AiOutlineUpload,
} from 'react-icons/ai';
import { FiX } from 'react-icons/fi';
import { HiPencilAlt } from 'react-icons/hi';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
}

type SignatureOption = 'type' | 'draw' | 'upload';

const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSave }) => {
  const [signatureOption, setSignatureOption] = useState<SignatureOption>('type');
  const [typedSignature, setTypedSignature] = useState<string>('');
  const [errors, setErrors] = useState<{ name?: string; signature?: string }>({});
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Handle Input Change for Typed Signature
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTypedSignature(value);
    if (value.trim() !== '') {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  // Handle File Selection for Uploaded Signature
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, signature: 'Please upload a valid image file.' }));
        return;
      }

      setUploadedFile(file);
      setErrors((prev) => ({ ...prev, signature: undefined }));

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save Signature
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (signatureOption === 'draw') {
        if (signaturePadRef.current?.isEmpty()) {
          setErrors((prev) => ({ ...prev, signature: 'Signature is required.' }));
          setIsSaving(false);
          return;
        }
        const signature = signaturePadRef.current?.getTrimmedCanvas().toDataURL('image/png') || '';
        onSave(signature);
        onClose();
      } else if (signatureOption === 'type') {
        if (typedSignature.trim() === '') {
          setErrors((prev) => ({ ...prev, name: 'Name is required.' }));
          setIsSaving(false);
          return;
        }
        onSave(typedSignature.trim());
        onClose();
      } else if (signatureOption === 'upload') {
        if (!uploadedFile) {
          setErrors((prev) => ({ ...prev, signature: 'Please upload a signature image.' }));
          setIsSaving(false);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          onSave(reader.result as string);
          onClose();
        };
        reader.readAsDataURL(uploadedFile);
      }
    } catch (error) {
      console.error('Error saving signature:', error);
      // Optionally, set a general error message
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Clear Signature (for Draw option)
  const handleClearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setErrors((prev) => ({ ...prev, signature: undefined }));
    }
  };

  // Handle Cancel Action
  const handleCancel = () => {
    setSignatureOption('type');
    setTypedSignature('');
    setUploadedFile(null);
    setUploadedPreview('');
    setErrors({});
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
    onClose();
  };

  // Handle Drag and Drop for Upload
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, signature: 'Please upload a valid image file.' }));
        return;
      }

      setUploadedFile(file);
      setErrors((prev) => ({ ...prev, signature: undefined }));

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset modal state when it closes
  useEffect(() => {
    if (!isOpen) {
      handleCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={handleCancel}
      >
        <div className="flex items-center justify-center min-h-screen px-4 text-center">
          {/* Custom Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-50"
            leave="ease-in duration-200"
            leaveFrom="opacity-50"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-50"></div>
          </Transition.Child>

          {/* Trick the browser into centering the modal contents */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              {/* Close Button */}
              <button
                onClick={handleCancel}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close Modal"
              >
                <FiX size={24} />
              </button>

              <Dialog.Title
                as="h3"
                className="text-2xl font-semibold text-gray-800 mb-6 text-center"
              >
                Adopt Your Signature
              </Dialog.Title>

              {/* Toggle between Type, Draw, and Upload signature */}
              <div className="mb-6 flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setSignatureOption('type')}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    signatureOption === 'type'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                >
                  <HiPencilAlt className="mr-2" size={20} />
                  Type
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureOption('draw')}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    signatureOption === 'draw'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                >
                  <HiPencilAlt className="mr-2" size={20} />
                  Draw
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureOption('upload')}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    signatureOption === 'upload'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                >
                  <AiOutlineUpload className="mr-2" size={20} />
                  Upload
                </button>
              </div>

              {/* Conditionally render Type, Draw, or Upload signature */}
              <div className="mb-6">
                {signatureOption === 'type' && (
                  <div>
                    <label
                      htmlFor="typedSignature"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="typedSignature"
                      name="typedSignature"
                      value={typedSignature}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-4 py-2 border text-white text-lg bg-black  ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-signature`}
                      placeholder="Your Full Name"
                      style={{ fontFamily: '"Dancing Script", cursive' }} // Apply the cursive font
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}

                    {/* Live Preview */}
                    {typedSignature.trim() !== '' && (
                      <div className="mt-4 p-2 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Preview:</p>
                        <div
                          className="text-2xl text-gray-800"
                          style={{ fontFamily: '"Dancing Script", cursive' }}
                        >
                          {typedSignature}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {signatureOption === 'draw' && (
                  <div>
                    <label
                      htmlFor="signaturePad"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Draw Your Signature <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-300 rounded-md shadow-sm mb-2">
                      <SignatureCanvas
                        penColor="black"
                        canvasProps={{
                          width: 500,
                          height: 200,
                          className: 'signature-canvas',
                        }}
                        ref={signaturePadRef}
                        backgroundColor="#f9fafb"
                      />
                    </div>
                    {errors.signature && (
                      <p className="text-red-500 text-sm mt-1">{errors.signature}</p>
                    )}
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={handleClearSignature}
                        className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <AiOutlineClear className="mr-1" /> Clear
                      </button>
                    </div>
                  </div>
                )}

                {signatureOption === 'upload' && (
                  <div>
                    <label
                      htmlFor="signatureUpload"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Upload Your Signature Image <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`flex items-center justify-center px-4 py-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                        errors.signature
                          ? 'border-red-500'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <label
                        htmlFor="signatureUpload"
                        className="flex flex-col items-center text-center"
                      >
                        <AiOutlineUpload size={40} className="text-gray-400" />
                        <span className="mt-2 text-sm text-gray-600">
                          Drag & drop an image here, or click to select
                        </span>
                        <input
                          type="file"
                          id="signatureUpload"
                          name="signatureUpload"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {errors.signature && (
                      <p className="text-red-500 text-sm mt-1">{errors.signature}</p>
                    )}
                    {uploadedPreview && (
                      <div className="mt-4 flex items-center space-x-4">
                        <img
                          src={uploadedPreview}
                          alt="Uploaded Signature Preview"
                          className="h-24 w-48 object-contain border border-gray-300 p-2 rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => { setUploadedFile(null); setUploadedPreview(''); }}
                          className="flex items-center px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <AiOutlineClear className="mr-1" /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  <FiX className="mr-1" /> Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                    isSaving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? 'Saving...' : <AiOutlineCheck className="mr-1" />} Save Signature
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SignatureModal;
