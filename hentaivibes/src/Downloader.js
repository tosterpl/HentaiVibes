import React, { useState } from 'react';

const Downloader = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadingImage, setDownloadingImage] = useState(null); // Track currently downloading image

  // Fetch images from the API (POST request)
  const fetchImages = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await fetch('https://api.waifu.pics/many/nsfw/waifu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'waifu' }), // Example body if needed
      });
      const data = await response.json();
      setImages(data.files || []); // Default to empty array if no files are returned
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images. Please try again later.');
      setImages([]); // Clear images array on error
    }
    setLoading(false);
  };

  // Download a single image
  const downloadImage = (url) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'; // Open in a new tab
      link.download = url.split('/').pop(); // Extract filename from the URL
      document.body.appendChild(link); // Append to body to make link work
      link.click(); // Trigger the download
      link.remove(); // Clean up by removing the link
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download the image.');
    }
  };
  
  

  // Download all images
  const downloadAllImages = () => {
    images.forEach((url) => downloadImage(url));
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary me-2" onClick={fetchImages} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Waifu Images'}
      </button>

      {/* Add "Renew Images" button */}
      {images.length > 0 && (
        <button className="btn btn-warning me-2" onClick={fetchImages} disabled={loading}>
          {loading ? 'Loading...' : 'Renew Images'}
        </button>
      )}

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      {/* Show loading spinner during image load or renew */}
      {loading ? (
        <div className="d-flex justify-content-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row mt-4">
          {images && images.length > 0 ? (
            <>
              <button className="btn btn-success mb-4" onClick={downloadAllImages}>
                Download All Images
              </button>
              {images.map((image, index) => (
                <div key={index} className="col-md-4 col-sm-6 mb-4">
                  <div className="card">
                    <img src={image} alt={`waifu-${index}`} className="card-img-top" />
                    <div className="card-body text-center">
                      <button
                        className="btn btn-secondary"
                        onClick={() => downloadImage(image)}
                        disabled={downloadingImage === image}
                      >
                        {downloadingImage === image ? 'Downloading...' : 'Download'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p>No images available. Please fetch the images.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Downloader;
