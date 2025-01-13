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

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg font-secondary">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Contractor Management
      </h1>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search contractors..."
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full md:w-1/3 focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/dashboard/admin/contractors/create">
          <Button variant="primary" size="medium">
            Add Contractor
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="text-center mt-8 text-gray-600 dark:text-gray-400">Loading Contractors...</div>
      )}
      {error && (
        <div className="text-center mt-8 text-red-500">
          Error fetching contractors. Please try again later.
        </div>
      )}
      {!isLoading && !filteredContractors.length && (
        <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
          No contractors found.
        </div>
      )}

      {!isLoading && filteredContractors.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
              <thead className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContractors.map((contractor: IContractor) => (
                  <tr key={contractor._id} className="border-t hover:bg-gray-100 dark:hover:bg-gray-600">
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{contractor.name}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{contractor.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          contractor.status === "Active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {contractor.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex items-center space-x-2">
                      <Link to={`/dashboard/contractor/contracts/${contractor._id}`}>
                        <Button variant="view" size="small">
                          View
                        </Button>
                      </Link>
                      <Link to={`/dashboard/admin/contractors/${contractor._id}/edit`}>
                        <Button variant="edit" size="small">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}

      {isFetching && (
        <div className="text-center mt-4 text-gray-500 dark:text-gray-400">Updating...</div>
      )}
    </div>
  );
};

export default ContractorList;
