import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobById, getJobs } from "../api/jobs"; // Assuming you have these API functions

function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobDetails();
    loadRelatedJobs();
  }, [id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const jobData = await getJobById(id);
      setJob(jobData);
    } catch (err) {
      setError("Error loading job details");
      console.error("Error loading job details:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedJobs = async () => {
    try {
      // Get related jobs (you can modify this logic based on your needs)
      const allJobs = await getJobs();
      // Filter out current job and limit to 4 related jobs
      const related = allJobs.filter(j => j.id !== parseInt(id)).slice(0, 4);
      setRelatedJobs(related);
    } catch (err) {
      console.error("Error loading related jobs:", err);
    }
  };

  const stripHtmlTags = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const parseJobDescription = (description) => {
    // Parse HTML content to extract sections
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');
    
    // Extract overview
    const overviewDiv = doc.querySelector('#job-overview');
    const overview = overviewDiv ? stripHtmlTags(overviewDiv.innerHTML) : "";
    
    // Extract responsibilities
    const responsibilitiesDiv = doc.querySelector('#responsibilities');
    const responsibilities = [];
    if (responsibilitiesDiv) {
      const lists = responsibilitiesDiv.querySelectorAll('ul');
      lists.forEach(ul => {
        const items = ul.querySelectorAll('li');
        items.forEach(li => responsibilities.push(li.textContent.trim()));
      });
    }
    
    // Extract requirements
    const requirementsDiv = doc.querySelector('#requirements');
    const requirements = [];
    if (requirementsDiv) {
      const lists = requirementsDiv.querySelectorAll('ul');
      lists.forEach(ul => {
        const items = ul.querySelectorAll('li');
        items.forEach(li => requirements.push(li.textContent.trim()));
      });
    }
    
    return { overview, responsibilities, requirements };
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger text-center">
          <h4>Job Not Found</h4>
          <p>{error || "The job you're looking for doesn't exist."}</p>
          <Link to="/jobs" className="btn btn-primary">Back to Jobs</Link>
        </div>
      </div>
    );
  }

  const { overview, responsibilities, requirements } = parseJobDescription(job.description);

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          {/* Job Header */}
          <div className="mb-4">
            <div className="text-muted mb-2">
              {job.department?.title || 'General'} Department At {job.company}
            </div>
            <h1 className="display-6 fw-bold mb-3">{job.title}</h1>
            
            <div className="d-flex align-items-center gap-3 mb-4 text-muted">
              <div className="d-flex align-items-center">
                <i className="fas fa-building me-2"></i>
                {job.department?.title || 'General'}
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-map-marker-alt me-2"></i>
                {job.location?.city}, {job.location?.state}
              </div>
              {job.type && (
                <span className="badge bg-primary px-3 py-2">
                  {job.type || 'FULL TIME'}
                </span>
              )}
            </div>

            {/* Apply Button */}
            <a 
              href={job.applyUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary btn-lg px-4 py-2 rounded-pill"
            >
              Apply
            </a>
          </div>

          <hr className="my-4" />

          {/* Job Description */}
          <div className="mb-5">
            <h3 className="h4 mb-3">{overview.includes('React') || overview.includes('Angular') ? 'Looking for React / Angular Experts.' : 'Job Overview'}</h3>
            <p className="text-muted lh-lg">
              {overview || stripHtmlTags(job.description).substring(0, 500) + '...'}
            </p>

            {/* Requirements Section */}
            {requirements.length > 0 && (
              <div className="mt-4">
                <h4 className="h5 mb-3">Requirements:</h4>
                <ul className="list-unstyled">
                  {requirements.slice(0, 6).map((req, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-circle text-primary me-3" style={{fontSize: '0.5rem'}}></i>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bonus Points Section */}
            {requirements.length > 6 && (
              <div className="mt-4">
                <h4 className="h5 mb-3">Bonus Points if:</h4>
                <ul className="list-unstyled">
                  {requirements.slice(6).map((req, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-circle text-primary me-3" style={{fontSize: '0.5rem'}}></i>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Other Job Openings */}
          {relatedJobs.length > 0 && (
            <div className="mb-4">
              <div className="card border-0" style={{backgroundColor: '#f8f9fa'}}>
                <div className="card-body p-4">
                  <h5 className="mb-3 fw-bold">
                    <span style={{borderBottom: '3px solid #007bff', paddingBottom: '5px'}}>
                      OTHER JOB OPENINGS
                    </span>
                  </h5>
                  
                  <div className="test">
                    <div className="list-group list-group-flush">
                      {relatedJobs.map((relatedJob) => (
                        <Link 
                          key={relatedJob.id} 
                          to={`/jobs/${relatedJob.id}`}
                          className="list-group-item list-group-item-action border-0 px-0 py-3 bg-transparent text-decoration-none"
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="mb-2 fw-bold text-dark">{relatedJob.title}</h6>
                              <div className="d-flex align-items-center text-muted small">
                                <i className="fas fa-building me-2 text-secondary"></i>
                                <span className="me-3">{relatedJob.department?.title || 'General'}</span>
                                <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
                                <span>{relatedJob.location?.city}, {relatedJob.location?.state}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Share Job Openings */}
          <div className="mt-5">
            <h5 className="mb-3">
              <span style={{borderBottom: '3px solid #007bff', paddingBottom: '5px'}}>
                SHARE JOB OPENINGS
              </span>
            </h5>
            
               {/* Social Media Share Icons */}
                                  <div className="d-flex gap-2 me-3">
                                    <a 
                                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(job.hostedUrl || window.location.href + '/jobs/' + job.id)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                                      style={{width: '36px', height: '36px', fontSize: '14px'}}
                                      title="Share on Facebook"
                                    >
                                      <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a 
                                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(job.hostedUrl || window.location.href + '/jobs/' + job.id)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                                      style={{width: '36px', height: '36px', fontSize: '14px'}}
                                      title="Share on LinkedIn"
                                    >
                                      <i className="fab fa-linkedin-in"></i>
                                    </a>
                                    <a 
                                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(job.hostedUrl || window.location.href + '/jobs/' + job.id)}&text=${encodeURIComponent(job.title)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                                      style={{width: '36px', height: '36px', fontSize: '14px'}}
                                      title="Share on Twitter"
                                    >
                                      <i className="fab fa-twitter"></i>
                                    </a>
                                  </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetailsPage;