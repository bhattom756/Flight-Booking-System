import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="container mt-5 text-center">
        <div className="d-flex justify-content-center gap-3 mt-4 w-100">
          <div className="input-group mb-3 w-50">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search Source"
              aria-label="source"
              aria-describedby="button-addon2"
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Select Destination"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
            />
            <input
              type="date"
              className="form-control mx-4"
              placeholder="Date"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
            />
            <button
              className="btn btn-outline-secondary "
              type="button"
              id="button-addon2"
            >
              Search
            </button>
          </div>
        </div>
        <div className="bg-white mt-5 d-flex container">
          <h1>Search results</h1>
        </div>
      </div>
    </>
  );
}
