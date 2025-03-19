const express = require('express');

// Mock data for recent listings
const recentListings = [
    {
        id: 1,
        image: '/Public/images/property-2.jpg',
        title: 'Sunset Villa',
        address: '123 Sunset Blvd, Malibu, California 90265',
        beds: 4,
        baths: 3,
        sqft: 2000
    },
    {
        id: 2,
        image: '/Public/images/property-3.jpg',
        title: 'Urban Loft',
        address: '456 Downtown St, New York, NY 10001',
        beds: 2,
        baths: 2,
        sqft: 1200
    }
];

// Render the index page with recent listings data
function renderIndex(req, res) {
  res.render('index', { recentListings: recentListings });
}

// Endpoint to fetch recent listings in JSON format
function getRecentListings(req, res) {
  res.json(recentListings);
}

function handleRedirect(req, res) {
  const action = req.body.action;
  const location = req.body.location;
  const propertyType = req.body.propertyType;

  let redirectURL = '';

  switch (action) {
    case 'sell':
      redirectURL = `/sell?location=${location}&propertyType=${propertyType}`;
      break;
    case 'rent':
      redirectURL = `/rent?location=${location}&propertyType=${propertyType}`;
      break;
    case 'buy':
      redirectURL = `/buy?location=${location}&propertyType=${propertyType}`;
      break;
    default:
      res.send('Invalid action');
      return;
  }

  res.redirect(redirectURL);
}

function renderSell(req, res) {
  const location = req.query.location;
  const propertyType = req.query.propertyType;
  res.render('all', { location: location, propertyType: propertyType });
}

function renderRent(req, res) {
  const location = req.query.location;
  const propertyType = req.query.propertyType;
  res.render('rent', { location: location, propertyType: propertyType });
}

function renderBuy(req, res) {
  const location = req.query.location;
  const propertyType = req.query.propertyType;
  res.render('buy', { location: location, propertyType: propertyType });
}

module.exports = {
  renderIndex,
  getRecentListings,
  handleRedirect,
  renderSell,
  renderRent,
  renderBuy,
};