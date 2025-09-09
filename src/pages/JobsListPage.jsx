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

  // Handle job application
   const handleApply = (jobId) => {
    const applyUrl = `https://jobs.teknorix.com/apply/${jobId}`;
    window.open(applyUrl, '_blank');
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4">
        <h2 className="mb-4 text-center">Open Positions</h2>

        {/* Search Bar with updated styling */}
        <div className="mb-4">
          <div className="position-relative">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search for Job"
              value={filters.search}
              onChange={handleSearchChange}
              style={{
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
                padding: '12px 50px 12px 16px'
              }}
            />
            <i 
              className="fas fa-search position-absolute"
              style={{
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#28a745',
                fontSize: '18px'
              }}
            ></i>
          </div>
        </div>

        {/* Filter Dropdowns with updated styling */}
        <div className="mb-4">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#6c757d'
                  }}
                >
                  <span>Department {filters.department.length > 0 && `(${filters.department.length})`}</span>
                  <i className="fas fa-chevron-down" style={{ fontSize: '12px' }}></i>
                </button>
                <ul className="dropdown-menu w-100" style={{ borderRadius: '8px', border: '1px solid #e0e0e0' }}>
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
                  className="btn btn-light dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#6c757d'
                  }}
                >
                  <span>Location {filters.location.length > 0 && `(${filters.location.length})`}</span>
                  <i className="fas fa-chevron-down" style={{ fontSize: '12px' }}></i>
                </button>
                <ul className="dropdown-menu w-100" style={{ borderRadius: '8px', border: '1px solid #e0e0e0' }}>
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
                  className="btn btn-light dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#6c757d'
                  }}
                >
                  <span>Function {filters.function.length > 0 && `(${filters.function.length})`}</span>
                  <i className="fas fa-chevron-down" style={{ fontSize: '12px' }}></i>
                </button>
                <ul className="dropdown-menu w-100" style={{ borderRadius: '8px', border: '1px solid #e0e0e0' }}>
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

        {/* Selected Filters Display with updated styling */}
        {hasActiveFilters() && (
          <div className="mb-4 p-3" style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <div className="d-flex flex-wrap align-items-center gap-2">
              {/* Department chips */}
              {filters.department.map(deptId => {
                const dept = getItemById(departments, deptId);
                return dept ? (
                  <span key={`dept-${deptId}`} className="badge bg-primary rounded-pill" style={{ fontSize: '12px', padding: '6px 12px' }}>
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
                  <span key={`loc-${locId}`} className="badge bg-info rounded-pill" style={{ fontSize: '12px', padding: '6px 12px' }}>
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
                  <span key={`fn-${fnId}`} className="badge bg-success rounded-pill" style={{ fontSize: '12px', padding: '6px 12px' }}>
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
                style={{ borderRadius: '20px', fontSize: '12px', padding: '4px 16px', color: '#28a745', borderColor: '#28a745' }}
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Jobs organized by categories with updated styling */}
        {jobs.length > 0 && (
          <>
            {departments.map((dept) => {
              const deptJobs = jobs.filter(job => job.department?.id === dept.id);

              if (deptJobs.length === 0) return null;

              return (
                <div key={dept.id} className="mb-5">
                  <h3
                    className="mb-4"
                    style={{
                      borderBottom: '3px solid #007bff',
                      paddingBottom: '8px',
                      display: 'inline-block',
                      fontSize: '24px',
                      fontWeight: '600',
                      color: '#333'
                    }}
                  >
                    {dept.title}
                  </h3>
                  <div className="row">
                    {deptJobs.map((job) => (
                      <div key={job.id} className="col-12 mb-3">
                        <div className="card" style={{ border: 'none', borderRadius: '8px', backgroundColor: 'white' }}>
                          <div className="card-body" style={{ padding: '24px' }}>
                            <div className="row align-items-center">
                              <div className="col-md-8">
                                <h5 className="card-title mb-2" style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
                                  {job.title}
                                </h5>
                                <div className="text-muted mb-2" style={{ fontSize: '14px', color: '#666' }}>
                                  <i className="fas fa-building me-2" style={{ color: '#666' }}></i>
                                  {job.department?.title}
                                  <i className="fas fa-map-marker-alt ms-3 me-2" style={{ color: '#666' }}></i>
                                  {job.location?.city}
                                  <span 
                                    className="badge ms-3" 
                                    style={{ 
                                      backgroundColor: '#e9ecef', 
                                      color: '#495057', 
                                      fontSize: '11px',
                                      fontWeight: '500',
                                      padding: '4px 8px'
                                    }}
                                  >
                                    {job.type || 'FULL TIME'}
                                  </span>
                                </div>
                              </div>
                              <div className="col-md-4 text-md-end">
                                <div className="d-flex gap-2 justify-content-md-end">
                                  <button
                                    onClick={() => handleApply(job.id)}
                                    className="btn"
                                    style={{
                                      backgroundColor: 'transparent',
                                      border: '1px solid #007bff',
                                      color: '#007bff',
                                      borderRadius: '20px',
                                      fontSize: '14px',
                                      padding: '8px 20px',
                                      fontWeight: '500'
                                    }}
                                  >
                                    Apply
                                  </button>
                                  <Link 
                                    to={`/jobs/${job.id}`} 
                                    className="btn"
                                    style={{
                                      backgroundColor: '#007bff',
                                      border: '1px solid #007bff',
                                      color: 'white',
                                      borderRadius: '20px',
                                      fontSize: '14px',
                                      padding: '8px 20px',
                                      fontWeight: '500',
                                      textDecoration: 'none'
                                    }}
                                  >
                                    View
                                  </Link>
                                </div>
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
              <div className="card" style={{ border: 'none', borderRadius: '8px', backgroundColor: 'white' }}>
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
    </div>
  );
}

export default JobsListPage;