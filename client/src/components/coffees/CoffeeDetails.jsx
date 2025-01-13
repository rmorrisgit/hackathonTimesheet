import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from "../../services/apiService";

const CoffeeDetails = () => {
  const { coffeeId } = useParams();
  const [coffee, setCoffee] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoffee = async () => {
      try {
        const coffeeData = await apiService.getCoffeeById(coffeeId);
        setCoffee(coffeeData);
      } catch (err) {
        console.error('Error fetching coffee details:', err);
        setError('Failed to fetch coffee details.');
      }
    };

    fetchCoffee();
  }, [coffeeId]);

  if (error) return <div>Error: {error}</div>;
  if (!coffee) return <div>Loading...</div>;

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="row gx-0 m-0 pt-4" style={{  minHeight: '100vw' }}>
      <div className="col-lg-2 d-none d-lg-block gx-0 m-0 p-0"></div>

      <div className="col-lg-8 col-sm-12 d-flex align-items-start p-4" style={{ backgroundColor: '#f8f9fa', marginTop: '150px', maxHeight: '500px'}}>
        {/* Back Button */}
        <button
          className="btn btn-dark position-absolute"
          style={{ right: '16px', top: '16px', zIndex: '999'
           }}
          onClick={handleCancel}
        >
          Back
        </button>

        {/* Coffee Image */}
        <div className="col-6 text-center">
          <img
            src={coffee.image}
            alt={coffee.coffeeName}
            className="img-fluid"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
            onError={(e) => {
              e.target.src = '/images/fallback.svg';
            }}
          />
        </div>

        {/* Coffee Details */}
        <div className="col-6 ps-4">
          <h4 className="fw-bold mb-3">{coffee.coffeeName}</h4>
          <p><strong>Origin:</strong> {coffee.origin}</p>
          <p><strong>Processing Method:</strong> {coffee.processingMethod || 'N/A'}</p>
          <p><strong>Flavor Notes:</strong> {coffee.flavorNotes?.join(', ') || 'N/A'}</p>
          <p><strong>Brew Methods:</strong> {coffee.brewMethods?.join(', ') || 'N/A'}</p>
          <p><strong>Roast Level:</strong> {coffee.roastLevel || 'N/A'}</p>

          <h4 className="mt-4">Harvest Info</h4>
          <p><strong>Season:</strong> {coffee.harvestInfo?.season || 'N/A'}</p>
          <p><strong>Harvest Method:</strong> {coffee.harvestInfo?.harvestMethod || 'N/A'}</p>
          <p><strong>Altitude:</strong> {coffee.harvestInfo?.altitude || 'N/A'}</p>
        </div>
      </div>

      <div className="col-lg-2 d-none d-lg-block gx-0 m-0 p-0"></div>
    </div>
  );
};

export default CoffeeDetails;
