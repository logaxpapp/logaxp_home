// src/components/Admin/Contractors/ContractorList.tsx

import React, { useState } from "react";
import { useFetchContractorsQuery } from "../../../api/contractApi";
import Pagination from "../../common/Pagination/Pagination";
import Button from "../../common/Button";
import { Link } from "react-router-dom";
import { IContractor } from "../../../types/contractTypes";

const ContractorList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;
  const skip = (page - 1) * limit;

  const { data = [], error, isLoading, isFetching } = useFetchContractorsQuery({ skip, limit });

  const totalPages = Math.ceil(data.length / limit);

  const filteredContractors = data.filter((contractor: IContractor) =>
    contractor.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center mt-8">Loading Contractors...</div>;
  }

  if (error) {
    console.error("Error fetching contractors:", error);
    return <div className="text-center mt-8 text-red-500">Error fetching contractors. Please try again later.</div>;
  }

  if (!filteredContractors.length) {
    return <div className="text-center mt-8 text-gray-600">No contractors found.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg font-secondary">
     

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search contractors..."
          className="border border-gray-300 rounded-lg p-2 w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/admin/contractors/create">
          <Button variant="primary">Add Contractor</Button>
        </Link>
      </div>

      <table className="min-w-full bg-white border-collapse border border-gray-200 rounded-lg">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContractors.map((contractor: IContractor) => (
            <tr key={contractor._id} className="border-t hover:bg-gray-100">
              <td className="py-3 px-4 text-gray-800">{contractor.name}</td>
              <td className="py-3 px-4 text-gray-600">{contractor.email}</td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    contractor.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {contractor.status}
                </span>
              </td>
              <td className="py-3 px-4 flex items-center">
                <Link to={`/dashboard/contractor/contracts/${contractor._id}`}>
                  <Button variant="view" size="small" className="mr-2">
                    View
                  </Button>
                </Link>
                <Link to={`/admin/contractors/${contractor._id}/edit`}>
                  <Button variant="edit" size="small">
                    Edit
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {isFetching && <div className="text-center mt-4 text-gray-500">Updating...</div>}
    </div>
  );
};

export default ContractorList;
