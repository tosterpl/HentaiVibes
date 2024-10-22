import React, { useState } from 'react';

const Downloader = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch images from the API (POST request)
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.waifu.pics/many/nsfw/waifu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'waifu' }), // Example body if needed, depends on the API
      });
      const data = await response.json();
      setImages(data.files || []); // Default to empty array if no files are returned
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]); // Set empty array on error
    }
    setLoading(false);
  };

  // Download a single image
  const downloadImage = (url) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = url.split('/').pop(); // Use the file name from the URL
        document.body.appendChild(link); // Append to body
        link.click(); // Trigger the download
        link.remove(); // Clean up by removing the link
        URL.revokeObjectURL(link.href); // Revoke the Object URL after the download
      })
      .catch((error) => console.error('Error downloading image:', error));
  };

  // Download all images
  const downloadAllImages = () => {
    images.forEach((url) => downloadImage(url));
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary" onClick={fetchImages} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Waifu Images'}
      </button>
      <div className="row mt-4">
        {images && images.length > 0 ? (
          images.map((image, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card">
                <img src={image} alt={`waifu-${index}`} className="card-img-top" />
                <div className="card-body text-center">
                  <button className="btn btn-secondary" onClick={() => downloadImage(image)}>
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No images available. Please fetch the images.</p>
        )}
      </div>
    </div>
  );
};

export default Downloader;
