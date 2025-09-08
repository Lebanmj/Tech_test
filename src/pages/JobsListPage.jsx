import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getJobs,
  getLocations,
  getDepartments,
  getFunctions,
} from "../api/jobs";

function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    location: [],
    department: [],
    function: [],
  });

  // Add debounce state for search
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    loadJobs();
    loadLookups();
  }, []);

  // Auto-apply filters whenever filters change (except for initial load)
  useEffect(() => {
    const apiParams = {};
    
    if (filters.search) apiParams.q = filters.search;
    
    if (filters.location.length > 0) 
      apiParams.loc = filters.location.join(',');
    
    if (filters.department.length > 0) 
      apiParams.dept = filters.department.join(',');
    
    if (filters.function.length > 0) 
      apiParams.fun = filters.function.join(',');

    // Only apply filters if there's at least one filter active or if it's a reset
    const hasFilters = filters.search || filters.location.length > 0 || 
                      filters.department.length > 0 || filters.function.length > 0;
    
    if (hasFilters || Object.keys(apiParams).length === 0) {
      loadJobs(apiParams);
    }
  }, [filters]);

  const loadJobs = async (appliedFilters = {}) => {
    try {
      const data = await getJobs(appliedFilters);
      setJobs(data);
    } catch (err) {
      console.error("Error loading jobs:", err);
    }
  };

  const loadLookups = async () => {
    setLocations(await getLocations());
    setDepartments(await getDepartments());
    setFunctions(await getFunctions());
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for 2000ms (2 seconds)
    const newTimeout = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchValue }));
    }, 2000);
    
    setSearchTimeout(newTimeout);
    
    // Update the input immediately for visual feedback
    setFilters(prev => ({ ...prev, search: searchValue }));
  };

  const handleMultiSelectChange = (filterType, value) => {
    const currentValues = filters[filterType];
    let newValues;
    
    if (currentValues.includes(value)) {
      // Remove if already selected
      newValues = currentValues.filter(item => item !== value);
    } else {
      // Add if not selected
      newValues = [...currentValues, value];
    }
    
    setFilters({ ...filters, [filterType]: newValues });
  };

  const removeFilter = (filterType, value) => {
    const newValues = filters[filterType].filter(item => item !== value);
    setFilters({ ...filters, [filterType]: newValues });
  };

  const clearAllFilters = () => {
    // Clear any pending search timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const resetFilters = {
      search: "",
      location: [],
      department: [],
      function: [],
    };
    
    setFilters(resetFilters);
  };

  const getItemById = (items, id) => {
    return items.find(item => item.id === id);
  };

  const hasActiveFilters = () => {
    return filters.location.length > 0 || 
           filters.department.length > 0 || 
           filters.function.length > 0;
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Open Positions</h2>

      {/* Search Bar */}
      <div className="card mb-3 p-3 shadow-sm">
        <div className="row">
          <div className="col-12">
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search for Job (searches after 2 seconds)"
                value={filters.search}
                onChange={handleSearchChange}
              />
        
            </div>
          </div>
        </div>
      </div>

      {/* Filter Dropdowns - Removed Apply Filters button */}
      <div className="card mb-3 p-3 shadow-sm">
        <div className="row g-2">
          <div className="col-md-4">
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Department {filters.department.length > 0 && `(${filters.department.length})`}
              </button>
              <ul className="dropdown-menu w-100">
                {departments.map((dept) => (
                  <li key={dept.id}>
                    <span
                      className={`dropdown-item d-flex justify-content-between align-items-center ${
                        filters.department.includes(dept.id) ? 'active' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleMultiSelectChange('department', dept.id)}
                    >
                      {dept.title}
                      {filters.department.includes(dept.id) && (
                        <i className="fas fa-check text-success"></i>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Location {filters.location.length > 0 && `(${filters.location.length})`}
              </button>
              <ul className="dropdown-menu w-100">
                {locations.map((loc) => (
                  <li key={loc.id}>
                    <span
                      className={`dropdown-item d-flex justify-content-between align-items-center ${
                        filters.location.includes(loc.id) ? 'active' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleMultiSelectChange('location', loc.id)}
                    >
                      {loc.title}
                      {filters.location.includes(loc.id) && (
                        <i className="fas fa-check text-success"></i>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Function {filters.function.length > 0 && `(${filters.function.length})`}
              </button>
              <ul className="dropdown-menu w-100">
                {functions.map((fn) => (
                  <li key={fn.id}>
                    <span
                      className={`dropdown-item d-flex justify-content-between align-items-center ${
                        filters.function.includes(fn.id) ? 'active' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleMultiSelectChange('function', fn.id)}
                    >
                      {fn.title}
                      {filters.function.includes(fn.id) && (
                        <i className="fas fa-check text-success"></i>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Filters Display */}
      {hasActiveFilters() && (
        <div className="card mb-4 p-3 shadow-sm bg-light">
          <div className="d-flex flex-wrap align-items-center gap-2">
            {/* Department chips */}
            {filters.department.map(deptId => {
              const dept = getItemById(departments, deptId);
              return dept ? (
                <span key={`dept-${deptId}`} className="badge bg-primary rounded-pill">
                  {dept.title}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    style={{ fontSize: '0.7em' }}
                    onClick={() => removeFilter('department', deptId)}
                  ></button>
                </span>
              ) : null;
            })}
            
            {/* Location chips */}
            {filters.location.map(locId => {
              const loc = getItemById(locations, locId);
              return loc ? (
                <span key={`loc-${locId}`} className="badge bg-info rounded-pill">
                  {loc.title}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    style={{ fontSize: '0.7em' }}
                    onClick={() => removeFilter('location', locId)}
                  ></button>
                </span>
              ) : null;
            })}
            
            {/* Function chips */}
            {filters.function.map(fnId => {
              const fn = getItemById(functions, fnId);
              return fn ? (
                <span key={`fn-${fnId}`} className="badge bg-success rounded-pill">
                  {fn.title}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    style={{ fontSize: '0.7em' }}
                    onClick={() => removeFilter('function', fnId)}
                  ></button>
                </span>
              ) : null;
            })}
            
            {/* Clear All button */}
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary ms-auto"
              onClick={clearAllFilters}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Jobs organized by categories */}
      {jobs.length > 0 && (
        <>
          {departments.map((dept) => {
            const deptJobs = jobs.filter(job => job.department?.id === dept.id);

            if (deptJobs.length === 0) return null;

            return (
              <div key={dept.id} className="mb-5">
                <h3
                  className="mb-3"
                  style={{
                    borderBottom: '3px solid #007bff',
                    paddingBottom: '8px',
                    display: 'inline-block',
                  }}
                >
                  {dept.title}
                </h3>
                <div className="row">
                  {deptJobs.map((job) => (
                    <div key={job.id} className="col-12 mb-3">
                      <div className="card shadow-sm">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <h5 className="card-title mb-1">{job.title}</h5>
                              <div className="text-muted mb-2">
                                <i className="fas fa-building me-1"></i>
                                {job.department?.title}
                                <i className="fas fa-map-marker-alt ms-3 me-1"></i>
                                {job.location?.city}
                                <span className="badge bg-secondary ms-3">
                                  {job.type || 'FULL TIME'}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                              <Link to={`/jobs/${job.id}`} className="btn btn-primary">
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      {jobs.length === 0 && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <i className="fas fa-briefcase fa-3x text-muted mb-3"></i>
                <h4 className="text-muted mb-2">No jobs found</h4>
                <p className="text-muted mb-0">Try adjusting your search criteria or filters</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobsListPage;