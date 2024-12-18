import React, { useState } from 'react';
import { useMarkAsAbsentMutation, useFetchAbsencesQuery } from '../../api/timeEntryApiSlice';
import FilterByEmployeeDropdown from './FilterByEmployeeDropdown';
import FilterByShiftDropdown from './FilterByShiftDropdown';
import { IShift } from '../../types/shift';

interface AbsenceMarkerProps {
  employeeId: string;
}

const AbsenceMarker: React.FC<AbsenceMarkerProps> = ({ employeeId }) => {
  const [absenceReason, setAbsenceReason] = useState('');
  const [selectedShift, setSelectedShift] = useState<IShift | null>(null); // Hold the selected shift
  const { data: absences, isLoading: isLoadingAbsences } = useFetchAbsencesQuery(employeeId, {
    skip: !employeeId, // Skip query if no employeeId
  });
  const [markAsAbsent] = useMarkAsAbsentMutation();

  const handleMarkAbsence = async () => {
    if (!absenceReason) {
      alert('Please provide a reason for the absence.');
      return;
    }
  
    if (!selectedShift) {
      alert('Please select a shift.');
      return;
    }
  
    try {
      await markAsAbsent({ employeeId, shiftId: selectedShift._id, reason: absenceReason });
      setAbsenceReason('');
      alert('Absence marked successfully.');
    } catch (error) {
      alert('Failed to mark absence: ' + (error as any).message);
    }
  };
  

  if (!employeeId) {
    return <p className="text-red-500">No employee selected. Please select an employee.</p>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-sm mt-4 font-secondary">
      <h1 className="text-2xl border p-2 text-center font-bold mb-4 font-primary bg-yellow-100">Mark Absence</h1>
  
      
      {/* Select Employee */}
      

      {/* Select Shift */}
      <FilterByShiftDropdown onChange={setSelectedShift} />

      {/* Enter Absence Reason */}
      <textarea
        className="w-full border rounded p-2 mb-4"
        placeholder="Enter reason for absence"
        value={absenceReason}
        onChange={(e) => setAbsenceReason(e.target.value)}
      />

      {/* Mark Absence Button */}
      <button
        className="bg-red-500 text-white py-2 px-4 rounded"
        onClick={handleMarkAbsence}
        disabled={!employeeId || !selectedShift}
      >
        Mark Absence
      </button>

      {/* Existing Absences */}
      <div className="mt-6 bg-white p-2 shadow-lg">
        <h3 className="font-bold mb-2">Existing Absences</h3>
        {isLoadingAbsences ? (
          <p>Loading absences...</p>
        ) : (
          <ul>
            {absences?.map((absence, idx) => (
              <li key={idx} className="mb-2">
                <span className="font-medium">Date:</span> {new Date(absence.createdAt).toLocaleDateString()}
                <br />
                <span className="font-medium">Reason:</span> {absence.reasonForAbsence}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AbsenceMarker;
