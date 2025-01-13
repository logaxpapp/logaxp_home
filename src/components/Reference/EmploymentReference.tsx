// // src/components/EmploymentReference.tsx

// import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react";
// import { Dialog } from "@headlessui/react";
// import SignatureCanvas from "react-signature-canvas";
// import { useSubmitReferenceFormMutation } from "../../api/referenceApi";
// import { IEmploymentReferenceFormData, IEmploymentReferenceErrors } from "../../types/employmentReference";
// import { useToast } from "../../features/Toast/ToastContext";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Logo from "../../assets/images/green.svg";

// const EmploymentReference: React.FC = () => {
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [searchParams] = useSearchParams();
//   const uniqueToken = searchParams.get("token") || "";

//   // Initialize RTK Query Mutation
//   const [submitReferenceForm, { isLoading, isSuccess, isError, error }] = useSubmitReferenceFormMutation();

//   // Local State for Signature Modal
//   const [isSignatureModalOpen, setSignatureModalOpen] = useState<boolean>(false);
//   const [useSignaturePad, setUseSignaturePad] = useState<boolean>(false); // Toggle between typing and drawing
//   const [signature, setSignature] = useState<string>("");
//   const [signatureDataURL, setSignatureDataURL] = useState<string>(""); // Store drawn signature
//   const signaturePadRef = useRef<SignatureCanvas>(null); // Reference to SignatureCanvas

//   // Local State for Form Data
//   const [formData, setFormData] = useState<IEmploymentReferenceFormData>({
//     from: "",
//     to: "",
//     position: "",
//     reasonForLeaving: "",
//     salary: "",
//     daysAbsent: "",
//     periodsAbsent: "",
//     attendance: "",
//     conduct: "",
//     performance: "",
//     relationships: "",
//     integrity: "",
//     unsuitableReasons: "",
//     reEmploy: "",
//     disciplinaryConcerns: "",
//     details: "",
//     name: "",
//     jobTitle: "",
//     date: "",
//     companyName: "",
//     companyAddress: "",
//   });

//   // Local State for Form Errors
//   const [errors, setErrors] = useState<IEmploymentReferenceErrors>({});

//   // Effect to handle success
//   useEffect(() => {
//     if (isSuccess) {
//       showToast("Employment reference submitted successfully!", "success");
//       // Redirect to a thank-you page or reset the form
//       navigate("/thank-you"); // Ensure this route exists
//     }
//   }, [isSuccess, showToast, navigate]);

//   // Effect to handle errors
//   useEffect(() => {
//     if (isError) {
//       const errMsg =
//         (error as any)?.data?.message || "Failed to submit employment reference.";
//       showToast(errMsg, "error");
//     }
//   }, [isError, error, showToast]);

//   // Handle Input Changes
//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Validate Form
//   const validateForm = (): boolean => {
//     const newErrors: IEmploymentReferenceErrors = {};
//     // Add validation rules as needed
//     if (!formData.from) newErrors.from = "From date is required.";
//     if (!formData.to) newErrors.to = "To date is required.";
//     if (!formData.position) newErrors.position = "Position is required.";
//     if (!formData.reasonForLeaving)
//       newErrors.reasonForLeaving = "Reason for leaving is required.";
//     if (!formData.salary) newErrors.salary = "Salary is required.";
//     if (!formData.name.trim()) newErrors.name = "Your name is required.";
//     if (!formData.date) newErrors.date = "Date is required.";
//     if (!formData.companyName)
//       newErrors.companyName = "Company name is required.";
//     if (!formData.companyAddress)
//       newErrors.companyAddress = "Company address is required.";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle Signature Adoption
//   const handleSignatureAdoption = () => {
//     const newErrors: IEmploymentReferenceErrors = { ...errors };

//     if (useSignaturePad) {
//       // If using signature pad
//       if (signaturePadRef.current && signaturePadRef.current.isEmpty()) {
//         newErrors.signature = "Please provide a signature.";
//       } else if (signaturePadRef.current) {
//         const dataURL = signaturePadRef.current
//           .getTrimmedCanvas()
//           .toDataURL("image/png");
//         setSignatureDataURL(dataURL);
//         setSignature(""); // Clear typed signature
//       }
//     } else {
//       // If typing signature
//       if (formData.name.trim() === "") {
//         newErrors.signature = "Name is required to adopt signature.";
//       } else {
//         setSignature(formData.name);
//         setSignatureDataURL(""); // Clear drawn signature
//       }
//     }

//     if (newErrors.signature) {
//       setErrors(newErrors);
//       return;
//     }

//     setSignatureModalOpen(false);
//     setErrors((prev) => ({ ...prev, signature: undefined })); // Clear signature errors
//   };

//   // Handle Clear Signature
//   const handleClearSignature = () => {
//     if (useSignaturePad && signaturePadRef.current) {
//       signaturePadRef.current.clear();
//     }
//     setSignature("");
//     setSignatureDataURL("");
//     setErrors((prev) => ({ ...prev, signature: undefined }));
//   };

//   // Handle Form Submission
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       if (!signature && !signatureDataURL) {
//         setErrors((prev) => ({ ...prev, signature: "Signature is required." }));
//         return;
//       }

//       // Prepare payload
//       const payload = {
//         token: uniqueToken,
//         ...formData,
//         signature: signature || signatureDataURL,
//       };

//       try {
//         await submitReferenceForm(payload).unwrap();
//         // Success handled by useEffect
//       } catch (err) {
//         // Error handled by useEffect
//         console.error("Submission Error:", err);
//       }
//     } else {
//       showToast("Please fill in the required fields.", "error");
//     }
//   };

//   return (
//     <div className="mx-auto p-8 bg-white shadow-md rounded-lg">
//       <div className="max-w-6xl mx-auto border p-8 shadow-secondary-light items-center justify-between mb-6">
//       {/* Header Section */}
// <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between border-b-2 pb-6 mb-8">
//   <div className="flex items-center space-x-4">
//     <img src={Logo} alt="Company Logo" className="h-12 w-auto" />
//     <div>
//       <h1 className="text-3xl font-bold text-gray-900">Reference Request</h1>
//       <p className="text-sm text-gray-600">
//         Candidate: <span className="font-medium">Edith Mudiaga-Abadoni</span> <br />
//         Position: <span className="font-medium">Care Assistant</span> | <a href="#" className="text-blue-600 hover:underline">View Job</a>
//       </p>
//     </div>
//   </div>
//   <button
//     className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//     onClick={() => alert("View Consent button clicked")}
//   >
//     View Consent
//   </button>
// </div>

// {/* Candidate Notes Section */}
// <div className="bg-gray-100 p-5 rounded-md mb-8">
//   <h2 className="text-lg font-semibold text-gray-800">Candidate Notes</h2>
//   <p className="text-sm text-gray-600">
//     Edith Mudiaga-Abadoni worked for your company as a <span className="font-medium">Care Assistant</span> starting from <span className="font-medium">23 February, 2024</span>.
//   </p>
// </div>

// {/* Introduction Section */}
// <div className="mb-8">
//   <h2 className="text-xl font-semibold mb-4 text-gray-800">
//     Thank You for Providing a Reference
//   </h2>
//   <p className="text-sm text-gray-700 leading-relaxed">
//     Thank you for taking the time to provide a reference for the applicant named above. 
//     If you are submitting an employment reference, please complete <span className="font-medium">Section 1</span>.
//     If you are submitting a character reference, please complete <span className="font-medium">Section 2</span>.
//   </p>
// </div>

// {/* Confidentiality Notice */}
// <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
//   <p className="text-sm text-gray-700 leading-relaxed">
//     <strong>Note:</strong> This reference is strictly confidential and will only be used to assess the applicant's suitability for the position. It does not serve as an employment offer or guarantee. Please ensure that all the information provided is accurate and complete.
//   </p>
// </div>

// {/* Legal Disclaimer */}
// <div className="text-xs text-gray-500">
//   <p>
//     <strong>Important:</strong> This role is exempt from the Rehabilitation of Offenders Act 1974. This means that all relevant convictions must be disclosed as part of this reference.
//   </p>
// </div>


//         <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
//           {/* Employment Period */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label
//                 htmlFor="from"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 From
//               </label>
//               <input
//                 type="date"
//                 id="from"
//                 name="from"
//                 value={formData.from}
//                 onChange={handleInputChange}
//                 className={`mt-1 block w-full border ${
//                   errors.from ? "border-red-500" : "border-gray-300"
//                 } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               />
//               {errors.from && (
//                 <p className="text-red-500 text-sm mt-1">{errors.from}</p>
//               )}
//             </div>
//             <div>
//               <label
//                 htmlFor="to"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 To
//               </label>
//               <input
//                 type="date"
//                 id="to"
//                 name="to"
//                 value={formData.to}
//                 onChange={handleInputChange}
//                 className={`mt-1 block w-full border ${
//                   errors.to ? "border-red-500" : "border-gray-300"
//                 } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               />
//               {errors.to && (
//                 <p className="text-red-500 text-sm mt-1">{errors.to}</p>
//               )}
//             </div>
//           </div>

//           {/* Position Held */}
//           <div>
//             <label
//               htmlFor="position"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Position(s) Held
//             </label>
//             <input
//               type="text"
//               id="position"
//               name="position"
//               value={formData.position}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.position ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="e.g., Software Engineer"
//             />
//             {errors.position && (
//               <p className="text-red-500 text-sm mt-1">{errors.position}</p>
//             )}
//           </div>

//           {/* Reason for Leaving */}
//           <div>
//             <label
//               htmlFor="reasonForLeaving"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Reason(s) for Leaving
//             </label>
//             <textarea
//               id="reasonForLeaving"
//               name="reasonForLeaving"
//               value={formData.reasonForLeaving}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.reasonForLeaving ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Please provide detailed reasons for leaving."
//               rows={3}
//             ></textarea>
//             {errors.reasonForLeaving && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.reasonForLeaving}
//               </p>
//             )}
//           </div>

//           {/* Salary */}
//           <div>
//             <label
//               htmlFor="salary"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Salary / Rate of Pay on Leaving
//             </label>
//             <input
//               type="text"
//               id="salary"
//               name="salary"
//               value={formData.salary}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.salary ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="e.g., $80,000 per annum"
//             />
//             {errors.salary && (
//               <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
//             )}
//           </div>

//           {/* Days Absent */}
//           <div>
//             <label
//               htmlFor="daysAbsent"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Days Absent
//             </label>
//             <input
//               type="number"
//               id="daysAbsent"
//               name="daysAbsent"
//               value={formData.daysAbsent}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.daysAbsent ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Number of days absent"
//             />
//             {errors.daysAbsent && (
//               <p className="text-red-500 text-sm mt-1">{errors.daysAbsent}</p>
//             )}
//           </div>

//           {/* Periods Absent */}
//           <div>
//             <label
//               htmlFor="periodsAbsent"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Periods Absent
//             </label>
//             <input
//               type="text"
//               id="periodsAbsent"
//               name="periodsAbsent"
//               value={formData.periodsAbsent}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.periodsAbsent ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="e.g., Sick leave, Vacation"
//             />
//             {errors.periodsAbsent && (
//               <p className="text-red-500 text-sm mt-1">{errors.periodsAbsent}</p>
//             )}
//           </div>

//           {/* Attendance */}
//           <div>
//             <label
//               htmlFor="attendance"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Attendance
//             </label>
//             <textarea
//               id="attendance"
//               name="attendance"
//               value={formData.attendance}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.attendance ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Comments on attendance"
//               rows={3}
//             ></textarea>
//             {errors.attendance && (
//               <p className="text-red-500 text-sm mt-1">{errors.attendance}</p>
//             )}
//           </div>

//           {/* Conduct */}
//           <div>
//             <label
//               htmlFor="conduct"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Conduct
//             </label>
//             <textarea
//               id="conduct"
//               name="conduct"
//               value={formData.conduct}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.conduct ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Comments on conduct"
//               rows={3}
//             ></textarea>
//             {errors.conduct && (
//               <p className="text-red-500 text-sm mt-1">{errors.conduct}</p>
//             )}
//           </div>

//           {/* Performance */}
//           <div>
//             <label
//               htmlFor="performance"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Performance
//             </label>
//             <textarea
//               id="performance"
//               name="performance"
//               value={formData.performance}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.performance ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Comments on performance"
//               rows={3}
//             ></textarea>
//             {errors.performance && (
//               <p className="text-red-500 text-sm mt-1">{errors.performance}</p>
//             )}
//           </div>

//           {/* Relationships */}
//           <div>
//             <label
//               htmlFor="relationships"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Relationships
//             </label>
//             <textarea
//               id="relationships"
//               name="relationships"
//               value={formData.relationships}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.relationships ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Comments on relationships with colleagues and supervisors"
//               rows={3}
//             ></textarea>
//             {errors.relationships && (
//               <p className="text-red-500 text-sm mt-1">{errors.relationships}</p>
//             )}
//           </div>

//           {/* Integrity */}
//           <div>
//             <label
//               htmlFor="integrity"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Integrity
//             </label>
//             <textarea
//               id="integrity"
//               name="integrity"
//               value={formData.integrity}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.integrity ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Comments on integrity and ethical behavior"
//               rows={3}
//             ></textarea>
//             {errors.integrity && (
//               <p className="text-red-500 text-sm mt-1">{errors.integrity}</p>
//             )}
//           </div>

//           {/* Unsuitable Reasons */}
//           <div>
//             <label
//               htmlFor="unsuitableReasons"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Unsuitable Reasons for Re-employment
//             </label>
//             <textarea
//               id="unsuitableReasons"
//               name="unsuitableReasons"
//               value={formData.unsuitableReasons}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.unsuitableReasons ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Reasons why the applicant may not be suitable for re-employment"
//               rows={3}
//             ></textarea>
//             {errors.unsuitableReasons && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.unsuitableReasons}
//               </p>
//             )}
//           </div>

//           {/* Re-Employment */}
//           <div>
//             <label
//               htmlFor="reEmploy"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Re-Employment Recommendation
//             </label>
//             <select
//               id="reEmploy"
//               name="reEmploy"
//               value={formData.reEmploy}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.reEmploy ? "border-red-500" : "border-gray-300"
//               } bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//             >
//               <option value="">-- Select --</option>
//               <option value="Yes">Yes, I would re-employ this individual.</option>
//               <option value="No">No, I would not re-employ this individual.</option>
//               <option value="Maybe">Maybe, under certain conditions.</option>
//             </select>
//             {errors.reEmploy && (
//               <p className="text-red-500 text-sm mt-1">{errors.reEmploy}</p>
//             )}
//           </div>

//           {/* Disciplinary Concerns */}
//           <div>
//             <label
//               htmlFor="disciplinaryConcerns"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Disciplinary Concerns
//             </label>
//             <textarea
//               id="disciplinaryConcerns"
//               name="disciplinaryConcerns"
//               value={formData.disciplinaryConcerns}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.disciplinaryConcerns ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Details about any disciplinary actions taken"
//               rows={3}
//             ></textarea>
//             {errors.disciplinaryConcerns && (
//               <p className="text-red-500 text-sm mt-1">{errors.disciplinaryConcerns}</p>
//             )}
//           </div>

//           {/* Additional Details */}
//           <div>
//             <label
//               htmlFor="details"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Additional Details
//             </label>
//             <textarea
//               id="details"
//               name="details"
//               value={formData.details}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.details ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Any additional comments or details you'd like to provide."
//               rows={4}
//             ></textarea>
//             {errors.details && (
//               <p className="text-red-500 text-sm mt-1">{errors.details}</p>
//             )}
//           </div>

//           {/* Your Name */}
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Your Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.name ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Your Full Name"
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//             )}
//           </div>

//           {/* Job Title */}
//           <div>
//             <label
//               htmlFor="jobTitle"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Your Job Title
//             </label>
//             <input
//               type="text"
//               id="jobTitle"
//               name="jobTitle"
//               value={formData.jobTitle}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.jobTitle ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Your Job Title"
//             />
//             {errors.jobTitle && (
//               <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
//             )}
//           </div>

//           {/* Signature */}
//           <div>
//             <label
//               htmlFor="signature"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Your Signature
//             </label>
//             <button
//               type="button"
//               onClick={() => setSignatureModalOpen(true)}
//               className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
//             >
//               {signature || signatureDataURL ? "Edit Signature" : "Sign"}
//             </button>
//             {signature && (
//               <p className="mt-2 text-xl font-semibold text-gray-800">
//                 {signature}
//               </p>
//             )}
//             {signatureDataURL && (
//               <img
//                 src={signatureDataURL}
//                 alt="User Signature"
//                 className="mt-2 h-16 w-auto border border-gray-300 rounded-md"
//               />
//             )}
//             {errors.signature && (
//               <p className="text-red-500 text-sm mt-1">{errors.signature}</p>
//             )}
//           </div>

//           {/* Date */}
//           <div>
//             <label
//               htmlFor="date"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Date
//             </label>
//             <input
//               type="date"
//               id="date"
//               name="date"
//               value={formData.date}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.date ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//             />
//             {errors.date && (
//               <p className="text-red-500 text-sm mt-1">{errors.date}</p>
//             )}
//           </div>

//           {/* Company Name */}
//           <div>
//             <label
//               htmlFor="companyName"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Company Name
//             </label>
//             <input
//               type="text"
//               id="companyName"
//               name="companyName"
//               value={formData.companyName}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.companyName ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Company Name"
//             />
//             {errors.companyName && (
//               <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
//             )}
//           </div>

//           {/* Company Address */}
//           <div>
//             <label
//               htmlFor="companyAddress"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Company Address
//             </label>
//             <textarea
//               id="companyAddress"
//               name="companyAddress"
//               value={formData.companyAddress}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.companyAddress ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Company Address"
//               rows={3}
//             ></textarea>
//             {errors.companyAddress && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.companyAddress}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white ${
//                 isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//               } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//             >
//               {isLoading ? "Submitting..." : "Submit Reference"}
//             </button>
//           </div>
//         </form>

//         {/* Signature Modal */}
//         <Dialog
//           open={isSignatureModalOpen}
//           onClose={() => setSignatureModalOpen(false)}
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 text-gray-800"
//         >
//           <Dialog.Panel className="bg-white rounded-lg p-8 max-w-lg w-full">
//             <Dialog.Title className="text-2xl font-semibold mb-4">
//               Adopt Your Signature
//             </Dialog.Title>

//             {/* Toggle between typing and drawing signature */}
//             <div className="mb-4 flex space-x-4">
//               <button
//                 type="button"
//                 onClick={() => setUseSignaturePad(false)}
//                 className={`px-4 py-2 rounded ${
//                   !useSignaturePad
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//               >
//                 Type Signature
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setUseSignaturePad(true)}
//                 className={`px-4 py-2 rounded ${
//                   useSignaturePad
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//               >
//                 Draw Signature
//               </button>
//             </div>

//             {/* Conditionally render input or signature pad */}
//             {!useSignaturePad ? (
//               <div>
//                 <label
//                   htmlFor="modalName"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Your Name *
//                 </label>
//                 <input
//                   type="text"
//                   id="modalName"
//                   name="modalName"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className={`mt-1 block w-full border ${
//                     errors.name ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//                   placeholder="Your Full Name"
//                 />
//                 {errors.name && (
//                   <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//                 )}
//               </div>
//             ) : (
//               <div>
//                 <label
//                   htmlFor="signaturePad"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Draw Your Signature *
//                 </label>
//                 <div className="border border-gray-300 rounded-md shadow-sm">
//                   <SignatureCanvas
//                     penColor="black"
//                     canvasProps={{
//                       width: 500,
//                       height: 200,
//                       className: "signature-canvas",
//                     }}
//                     ref={signaturePadRef}
//                   />
//                 </div>
//                 {errors.signature && (
//                   <p className="text-red-500 text-sm mt-1">{errors.signature}</p>
//                 )}
//                 <div className="flex justify-end space-x-2 mt-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       if (signaturePadRef.current) signaturePadRef.current.clear();
//                       setErrors((prev) => ({ ...prev, signature: undefined }));
//                     }}
//                     className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                   >
//                     Clear
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-4 mt-6">
//               <button
//                 type="button"
//                 onClick={handleSignatureAdoption}
//                 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//               >
//                 Adopt and Sign
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSignatureModalOpen(false);
//                   setUseSignaturePad(false); // Reset to typing by default
//                   setErrors((prev) => ({
//                     ...prev,
//                     signature: undefined,
//                     name: undefined,
//                   }));
//                 }}
//                 className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//               >
//                 Cancel
//               </button>
//             </div>
//           </Dialog.Panel>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default EmploymentReference;
