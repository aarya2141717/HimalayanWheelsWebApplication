import React from 'react';

const Feedback = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Feedback</h1>
      <div className="card">
        <div className="card-body">
          <p className="card-text">User feedback form or list goes here.</p>
          <form>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows={4}></textarea>
            </div>
            <button className="btn btn-primary">Send Feedback</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
